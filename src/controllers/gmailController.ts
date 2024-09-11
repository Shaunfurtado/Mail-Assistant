import { Request, Response } from 'express';
import { listEmails, getEmailContent } from '../services/gmailService';
import { addEmailJob, connection, processedEmailIdsKey } from '../queues/emailQueue';
import { loadSavedCredentialsIfExist } from '../services/googleAuth';

export const processEmails = async (req: Request, res: Response) => {
  if (!loadSavedCredentialsIfExist()) {
    if (res.redirect) {
      res.redirect('/auth');
    } else {
      console.log('No saved credentials found. Please authenticate at /auth');
    }
    return;
  }
  try {
    const emails = await listEmails();

    for (const email of emails) {
      if (email.id && !await connection.sismember(processedEmailIdsKey, email.id)) { 
        try {
          const { emailBody, emailData } = await getEmailContent(email.id);
          await addEmailJob({ emailBody, emailData });
          console.log(`Email with ID ${email.id} processed successfully.`);
        } catch (emailError) {
          console.error(`Error processing email with ID ${email.id}:`, emailError);
        }
      } else {
        console.log(`Skipping email with invalid ID: ${email.id} or already processed`);
      }
    }
    if (res.send) {
      res.send('Emails queued for processing');
    }
  } catch (err) {
    console.error('Error fetching email list:', err);
  }
};