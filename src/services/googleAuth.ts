// done setup the google auth service
import { OAuth2Client } from "google-auth-library";

export const oauth2Client = new OAuth2Client(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

// Function to generate the authorization URL
export const getGoogleAuthUrl = () => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
  });
  return authUrl;
};

// Function to exchange the authorization code for tokens
export const getGoogleToken = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};
