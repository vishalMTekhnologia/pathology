import amqp from "amqplib";
import { rabbitmqUrl } from "../config.js";
import { setupQueues } from "../setupQueues.js";

const notificationQueue = "notification_queue";

export async function sendNotificationJob(job) {
  let connection, channel;
  try {
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();
    await setupQueues(channel, notificationQueue);

    channel.sendToQueue(notificationQueue, Buffer.from(JSON.stringify(job)), {
      persistent: true,
      headers: { "x-retry-count": 0 },
    });

    console.log("Notification job queued:", job.type, "to", job.receiverId);
  } catch (err) {
    console.error("Failed to send notification job:", err.message);
    throw err;
  } finally {
    if (channel) await channel.close();
    if (connection) await connection.close();
  }
}