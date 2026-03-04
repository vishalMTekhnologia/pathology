export async function setupQueues(channel, queueName) {
  const retryExchange = `${queueName}_retry_exchange`;
  const retryQueue = `${queueName}_retry`;
  const retryRoutingKey = 'retry';

  // DLX Exchange
  await channel.assertExchange(retryExchange, 'direct', { durable: true });

  // Main queue with DLX
  await channel.assertQueue(queueName, {
    durable: true,
    deadLetterExchange: retryExchange,
    deadLetterRoutingKey: retryRoutingKey,
  });

  // Retry queue with TTL and dead-lettering back to main queue
  await channel.assertQueue(retryQueue, {
    durable: true,
    messageTtl: 3000, // 3 seconds delay
    deadLetterExchange: '', // default exchange
    deadLetterRoutingKey: queueName,
  });

  // Bind retry queue to DLX
  await channel.bindQueue(retryQueue, retryExchange, retryRoutingKey);
}