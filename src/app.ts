// src/app.ts
import express from 'express';
import { processEmails } from './controllers/gmailController';
import { CronJob } from 'cron';
import { Request, Response } from 'express';
import { loadSavedCredentialsIfExist, getAuthUrl, getTokens, initializeOAuth2Client } from './services/googleAuth';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

const TOKEN_PATH = path.join(__dirname, '../Google_Tokens/tokens.json');

// Initialize OAuth2Client
if (!initializeOAuth2Client()) {
  console.error("Failed to initialize OAuth2Client. Please check your credentials.");
  process.exit(1);
}

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Email Assitant. <a href="/auth">Click here to authenticate</a>');
});

// Endpoint to start OAuth flow
app.get('/auth', (req: Request, res: Response) => {
  try {
    const authUrl = getAuthUrl();
    res.redirect(authUrl);
  } catch (error) {
    console.log('Error starting authentication process, Error generating auth URL:', error);
  }
});

// OAuth callback endpoint
app.get('/auth/callback', async (req: Request, res: Response) => {
  const { code } = req.query;
  if (code) {
    console.log("Received authorization code:", code);
    try {
      const tokens = await getTokens(code as string);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
      console.log("Tokens retrieved successfully:", tokens);
      res.redirect('/process-emails');
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  } else {
    console.log('No authorization code provided');
  }
});

// Endpoint to trigger email processing
app.get('/process-emails', async (req: Request, res: Response) => {
  if (!loadSavedCredentialsIfExist()) {
    res.redirect('/auth');
    return;
  }
  try {
    await processEmails(req, res);
  } catch (error) {
    console.error('Error processing emails:', error);
  }
});

// Scheduling the email processing job using CronJob
const job = new CronJob('*/100 * * * * *', async () => {
  if (loadSavedCredentialsIfExist()) {
    try {
      await processEmails({} as Request, { send: () => {} } as unknown as Response);
      console.log('Emails processed successfully.');
    } catch (err) {
      console.error('Error processing emails:', err);
    }
  } else {
    console.log('No saved credentials found. Please authenticate at /auth');
  }
}, null, true, 'Asia/Kolkata');

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Please authenticate by visiting http://localhost:${PORT}/auth`);
});