// src/controllers/emailController.ts
import { getGoogleToken } from '../services/googleAuth';
// import { getOutlookToken } from '../services/outlookAuth';
import { addEmailJob } from '../queues/emailQueue';

export const handleGoogleCallback = async (req: any , res: any) => {
  const { code } = req.query;
  const tokens = await getGoogleToken(code);
  // Save tokens and queue email processing
  await addEmailJob({ tokens });
  res.send('Google account connected and email processing queued');
};

// export const handleOutlookCallback = async (req, res) => {
//   const { code } = req.query;
//   const tokens = await getOutlookToken(code);
//   // Save tokens and queue email processing
//   await addEmailJob({ tokens });
//   res.send('Outlook account connected and email processing queued');
// };
