import dotenv from 'dotenv';
dotenv.config();

export const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
export const queueName = process.env.QUEUE_NAME || 'thumbnail_jobs';