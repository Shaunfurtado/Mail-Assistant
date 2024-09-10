// src/services/gmailService.ts
import { google } from 'googleapis';
import { oauth2Client } from './googleAuth';

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

export const listEmails = async () => {
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread',
  });
  return res.data.messages || [];
};

export const getEmailContent = async (messageId: string) => {
  const res = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
  });
  const emailData = res.data;
  const emailBody = Buffer.from(emailData.payload?.body?.data || '', 'base64').toString();
  return { emailBody, emailData };
};
