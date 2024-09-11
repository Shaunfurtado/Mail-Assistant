import { Queue, Worker } from 'bullmq';
import dotenv from 'dotenv';
import IoRedis from 'ioredis';
import { analyzeEmailContext, generateReply } from '../services/geminiService';
import { sendEmailReply } from '../services/gmailService';
dotenv.config();

export const connection = new IoRedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
  maxRetriesPerRequest: null,
});

const emailQueue = new Queue('email-processing', {
  connection,
});

export const processedEmailIdsKey = 'processedEmailIds';

const worker = new Worker('email-processing', async (job) => {
  const { emailBody, emailData } = job.data;
  console.log('\nProcessing email:', emailData);

  const emailId = emailData.id;
  if (!emailId) {
    console.error('Email data is missing an ID. Skipping processing.');
    return;
  }

  const isProcessed = await connection.sismember(processedEmailIdsKey, emailId);
  if (isProcessed) {
    console.log(`Email with ID ${emailId} already processed. Skipping.`);
    return;
  }

  try {
    const snippet = emailData.snippet;
    const label = await analyzeEmailContext(snippet);
    console.log(`Email classified as: ${label}`);
    const replyMessage = await generateReply(snippet, label || 'default');
    console.log(`Generated reply: ${replyMessage}`);
    await sendEmailReply(emailData, replyMessage || 'Hi, \nThank you for reaching out! I appreciate your message and will get back to you soon. \nBest regards');
    console.log(`Reply sent: ${replyMessage}`);
  } catch (error) {
    console.error(`Error processing email with ID ${emailId}:`, error);
  }

  // Add email ID to processed set using SADD
  await connection.sadd(processedEmailIdsKey, emailId);
  console.log(`Email with ID ${emailId} processed successfully.`);
}, {
  connection,
  limiter: {
    max: 1,
    duration: 10000,
  },
});

worker.on('completed', (job) => {
  console.log(`Job with id ${job.id} has been completed`);
});

worker.on('failed', (job, err) => {
  if (job) {
    console.error(`Job with id ${job.id} has failed with error ${err.message}`);
  } else {
    console.error(`Job has failed with error ${err.message}`);
  }
});

export const addEmailJob = async (emailData: any) => {
  await emailQueue.add('process-email', emailData);
};