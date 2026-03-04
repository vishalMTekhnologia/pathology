import amqp from "amqplib";
import { rabbitmqUrl, queueName } from "./config.js";
import { setupQueues } from "./setupQueues.js";

let connection;
let channel;

/**
 * Get or create RabbitMQ channel (singleton)
 */
async function getChannel() {
  if (channel) return channel;

  connection = await amqp.connect(rabbitmqUrl);

  connection.on("error", (err) => {
    console.error("RabbitMQ connection error:", err.message);
    connection = null;
    channel = null;
  });

  connection.on("close", () => {
    console.warn("RabbitMQ connection closed");
    connection = null;
    channel = null;
  });

  // Confirm channel guarantees message delivery
  channel = await connection.createConfirmChannel();

  await setupQueues(channel, queueName);

  return channel;
}

/**
 * Send thumbnail generation job
 */
export async function sendThumbnailJob(job) {
  try {
    const ch = await getChannel();

    const payload = Buffer.from(JSON.stringify(job));

    ch.sendToQueue(queueName, payload, {
      persistent: true,
      contentType: "application/json",
      headers: {
        "x-retry-count": job.retryCount || 0,
      },
    });

    // Wait until broker confirms message
    await ch.waitForConfirms();

    console.log(
      "✅ Thumbnail job queued:",
      job.thumbnailBlobName || job.blobName,
    );
  } catch (err) {
    console.error("❌ Failed to send thumbnail job:", err.message);
    throw err;
  }
}
