import dotenv from "dotenv";
import amqp from "amqplib";
import axios from "axios";

import { query } from "../src/utils/database.js";
import { encrypt } from "../src/utils/encryption.js";
import { getEpochTime } from "../src/utils/epoch.js";
import { setupQueues } from "./setupQueues.js";
import { rabbitmqUrl, queueName } from "./config.js";
import { generateVideoThumbnail } from "../src/utils/videoUtil.js";
import { generateImageThumbnail } from "../src/utils/imageUtil.js";
import { redisClient } from "../src/utils/redisClient.js";

dotenv.config();

const THUMBNAIL_CONTAINER_NAME = process.env.MEDIA_THUMBNAIL_CONTAINER;
const STORAGE_ACCOUNT = process.env.STORAGE_ACCOUNT || "memorifygallery";

export async function startWorker() {
  const connection = await amqp.connect(rabbitmqUrl);
  const channel = await connection.createChannel();

  await setupQueues(channel, queueName);
  channel.prefetch(2);

  const retryQueue = `${queueName}_retry`;
  const dlqQueue = `${queueName}_dead`;

  const workerId = process.env.NODE_APP_INSTANCE || "0";
  let processedCount = 0;

  console.log(`[Worker ${workerId}] 🚀 Thumbnail worker started`);

  channel.consume(queueName, async (msg) => {
    if (!msg) return;

    const startTime = Date.now();
    processedCount++;

    try {
      const job = JSON.parse(msg.content.toString());
      const retryCount = msg.properties.headers["x-retry-count"] || 0;

      const {
        sasUrl,
        thumbnailSasUrl,
        mediaId,
        userId,
        thumbnailBlobName,
        fileType,
      } = job;

      if (!sasUrl || !thumbnailSasUrl || !fileType) {
        throw new Error("Invalid thumbnail job payload");
      }

      let thumbnailBuffer;

      // ===== Generate thumbnail =====
      if (fileType.startsWith("video")) {
        thumbnailBuffer = await generateVideoThumbnail(sasUrl);
      } else if (fileType.startsWith("image")) {
        const res = await axios.get(sasUrl, {
          responseType: "arraybuffer",
          timeout: 60000,
          maxContentLength: 1024 * 1024 * 1024,
        });
        thumbnailBuffer = await generateImageThumbnail(Buffer.from(res.data));
      } else {
        throw new Error(`Unsupported media type: ${fileType}`);
      }

      if (!thumbnailBuffer) {
        throw new Error("Thumbnail generation failed");
      }

      // ===== Upload thumbnail =====
      await axios.put(thumbnailSasUrl, thumbnailBuffer, {
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": "image/webp",
        },
        timeout: 30000,
      });

      // ===== Update DB =====
      if (mediaId && thumbnailBlobName) {
        const thumbnailUrl = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${THUMBNAIL_CONTAINER_NAME}/${thumbnailBlobName}`;
        const encryptedUrl = encrypt(thumbnailUrl).encryptedData;

        await query(
          `UPDATE tbl_media
           SET thumbnail_url = ?, updated_at = ?, updated_by = ?
           WHERE media_id = ?`,
          [encryptedUrl, getEpochTime(), userId, mediaId],
        );

        await redisClient.publish(
          "thumbnail_ready",
          JSON.stringify({
            userId,
            mediaId,
            thumbnailUrl: encryptedUrl,
          }),
        );
      }

      channel.ack(msg);

      console.log(
        `[Worker ${workerId}] ✅ Done (${(
          (Date.now() - startTime) /
          1000
        ).toFixed(1)}s)`,
      );
    } catch (err) {
      console.error(`[Worker ${workerId}] ❌ ${err.message}`);

      try {
        const job = JSON.parse(msg.content.toString());
        const retryCount = msg.properties.headers["x-retry-count"] || 0;

        if (retryCount < 3) {
          channel.sendToQueue(retryQueue, Buffer.from(JSON.stringify(job)), {
            persistent: true,
            headers: { "x-retry-count": retryCount + 1 },
          });
        } else {
          channel.sendToQueue(dlqQueue, Buffer.from(JSON.stringify(job)), {
            persistent: true,
          });
        }
      } catch (retryErr) {
        console.error(
          `[Worker ${workerId}] Retry handling failed: ${retryErr.message}`,
        );
      }

      channel.ack(msg);
    }
  });

  process.on("SIGINT", async () => {
    console.log(
      `[Worker ${workerId}] Shutting down (${processedCount} jobs processed)`,
    );
    await channel.close();
    await connection.close();
    process.exit(0);
  });

  process.on("SIGTERM", () => process.emit("SIGINT"));
}

startWorker().catch((err) => {
  console.error("Fatal worker error:", err);
  process.exit(1);
});
