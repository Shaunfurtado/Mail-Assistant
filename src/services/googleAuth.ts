import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const TOKEN_PATH = path.join(__dirname, '../../Google_Tokens/tokens.json');
const CREDENTIALS_PATH = path.join(__dirname, '../../Google_Tokens/credentials.json');

let oauth2Client: OAuth2Client;

export function initializeOAuth2Client(): boolean {
  try {
    const credentials =  JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id, redirect_uris } = credentials.web;
    oauth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);
    return true;
  } catch (error) {
    console.error('Error loading client secret file:', error);
    return false;
  }
}

export const getAuthUrl = () => {
  if (!oauth2Client) {
    if (!initializeOAuth2Client()) {
      throw new Error("OAuth2Client not initialized");
    }
  }
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.modify'],
    prompt: 'consent'
  });
};

export async function getTokens(code: string) {
  if (!oauth2Client) {
    throw new Error("OAuth2Client is not initialized");
  }
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
}

export function loadSavedCredentialsIfExist(): boolean {
  try {
    const tokenData = fs.readFileSync(TOKEN_PATH, 'utf8');
    const tokens = JSON.parse(tokenData);
    if (oauth2Client) {
      oauth2Client.setCredentials(tokens);
      return true;
    }
    return false;
  } catch (error) {
    console.log('No saved credentials found.');
    return false;
  }
}

export function getOAuth2Client(): OAuth2Client {
  return oauth2Client;
}