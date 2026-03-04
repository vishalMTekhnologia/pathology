import dotenv from "dotenv";
import amqp from "amqplib";
import { setupQueues } from "../setupQueues.js";
import { rabbitmqUrl } from "../config.js";
import { pushService } from "../../src/api/notification/pushService.js";
import { getUserDeviceTokens } from "../../src/api/device/deviceService.js";

dotenv.config();

const queueName = "notification_queue";

export async function startNotificationWorker() {
  const conn = await amqp.connect(rabbitmqUrl);
  const channel = await conn.createChannel();
  await setupQueues(channel, queueName);
  channel.prefetch(10);

  channel.consume(queueName, async (msg) => {
    if (!msg) return;
    const job = JSON.parse(msg.content.toString());

    try {
      const { receiverId, title, body, entityType, entityId } = job.data;

      console.log("📱 Processing push notification for user:", receiverId);

      // ONLY push notification logic here (no socket, no DB save)
      const tokens = await getUserDeviceTokens(receiverId);
      if (tokens.length > 0) {
        await pushService.sendNotification({
          tokens,
          title,
          body,
          data: { entityType, entityId: entityId.toString() },
        });
        console.log("✅ Push notification sent to", tokens.length, "device(s)");
      } else {
        console.log("📱 No device tokens found for user:", receiverId);
      }

      channel.ack(msg); // Always acknowledge after processing
    } catch (err) {
      console.error("Push notification error:", err.message);
      channel.ack(msg); // Still acknowledge to prevent queue blockage
    }
  });

  console.log("Push notification worker ready");
}

startNotificationWorker();
