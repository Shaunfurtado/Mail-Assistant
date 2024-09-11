// src/services/gmailService.ts
import { google } from 'googleapis';
import { getOAuth2Client } from './googleAuth';

const getGmailService = () => {
  const oauth2Client = getOAuth2Client();
  return google.gmail({ version: 'v1', auth: oauth2Client });
};

export const listEmails = async () => {
  const gmail = getGmailService();
  const res = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread',
  });
  return res.data.messages || [];
};

export const getEmailContent = async (messageId: string) => {
  const gmail = getGmailService();
  const res = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
  });
  const emailData = res.data;
  const emailBody = Buffer.from(emailData.payload?.body?.data || '', 'base64').toString();
  return { emailBody, emailData };
};

export const sendEmailReply = async (emailData: any, replyMessage: string) => {
  const gmail = getGmailService();
  const threadId = emailData.threadId;
  const replyTo = emailData.payload.headers.find((header: any) => header.name === 'From').value;

  const rawMessage = [
    `To: ${replyTo}`,
    `Subject: Re: ${emailData.payload.headers.find((header: any) => header.name === 'Subject').value}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    replyMessage,
  ].join('\n');

  const encodedMessage = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,   

      threadId,
    },
  });
};