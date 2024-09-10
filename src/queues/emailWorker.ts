// src/queues/emailWorker.ts
import { Worker } from 'bullmq';
import { analyzeEmailContext, generateReply } from '../services/openAiService';

const worker = new Worker('email-processing', async (job) => {
  const { emailContent } = job.data;

  // Analyze context and categorize email
  const label = await analyzeEmailContext(emailContent);

  // Generate reply
  const reply = await generateReply(emailContent);

  // Send reply (use nodemailer or Outlook API)
  console.log(`Reply: ${reply} - Label: ${label}`);
});
