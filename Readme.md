## Mail Assistant: Automate Your Email Responses with AI (TypeScript)

[Video Link Here](https://www.youtube.com/watch?v=EtzrnOjGhJA)

This project, Mail Assistant, is a tool built using TypeScript that automates email responses using Artificial Intelligence (AI). It leverages BullMQ as a task scheduler to process incoming emails and generate relevant replies based on their content.

> NOTE:

> - Outlook implementation unavailable, due to issue with Azure Account Verification which is required for Oauth.
> - Gemini Api (gemini-1.5-flash) used Instead of OpenAI (gpt-3.5) due to unavailable Credits.

### Project Description

Mail Assistant connects to your Gmail accounts (using OAuth) and analyzes incoming emails to understand their context. It utilizes Gemini's capabilities to:

1. **Classify Emails:** Assign labels like "Interested," "Not Interested," or "More Information" based on the email content.
2. **Generate Automated Replies:** Craft appropriate responses tailored to the email category.

**Key Features:**

* **Automated Processing:** Mail Assistant works seamlessly in the background, eliminating the need for manual intervention.
* **AI-Powered Analysis:** Leverages AI to understand email context and suggest relevant replies.
* **Customizable Labels:** You can define custom labels to categorize emails according to your specific needs.

### Tech Stack:

* Express.js With Typescript
* @google/generative-ai for Gemini Apis
* BullMQ for task Scheduling
* ioredis For Redis Connections
* CronJobs for timely Execution
* Dotenv For managing Secrets
* google-auth-library for OAuth Configuration
* googleapis For Gmail Apis


### Setting Up Mail Assistant

**Prerequisites:**

* Node.js and npm installed on your system.
* An active Gmail account.
* Redis Installed on your Computer or Redis Cloud.
* API Keys for your Gemini service.

**Installation:**

1. Clone this repository:

   ```bash
   git clone https://github.com/Shaunfurtado/Mail-Assistant.git
   ```

2. Navigate to the project directory:

   ```bash
   cd mail-assistant
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

**Configuration:**

1. Create a `.env` file in the project root directory. Refer `example.env`
2. Add environment variables for:
    * OAuth credentials for your Gmail accounts.
    * Your Gemini API key.
    * On Windows, use WSL for Setting up Redis (preferably Ubuntu)
3. Download you OAuth Credentials and save them in `\Google_Tokens` in the root directory.
    * Example: `\Google_Tokens\credentials.json`

**Running Mail Assistant:**

1. Start the application:

   ```bash
   npm run dev
   ```
2. Go to http://localhost:8000/auth

3. Mail Assistant will connect to your email accounts, process incoming emails, and generate replies based on their content.
