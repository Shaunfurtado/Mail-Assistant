// src/queues/emailQueue.ts
import { Queue, Worker } from 'bullmq';

const emailQueue = new Queue('email-processing', {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
});

// Process emails in the queue
const worker = new Worker('email-processing', async (job) => {
  // Extract job data, classify email, and respond
});

export const addEmailJob = async (emailData: any) => {
  await emailQueue.add('process-email', emailData);
};
