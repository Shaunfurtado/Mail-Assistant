import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not Found");
  }
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const analyzeEmailContext = async (subject: string, emailContent: string) => {
  const prompt = `Analyze the email content and return only the classification category label: 'Interested', 'Not-Interested', or 'More-Information'.\nEmail Subject: ${subject}\nEmail Content:\n${emailContent}`;

  const result = await model.generateContent(prompt);
  const classification = result.response.text().trim();
  console.log("Email classification result:", classification);
  return classification;
};

export const generateReply = async (subject: string, emailContent: string, label: string) => {
  let context;
  switch (label) {
    case "Interested":
      context = `Write a reply to this email expressing interest in a demo call. Indicate that the user is interested in further information. Suggest a time slot for the call if necessary. Along with proper formatting.`;
      break;
    case "Not-Interested":
      context = `Respond politely to this email, indicating that the user is not interested in further information. Along with proper formatting.`;
      break;
    case "More-Information":
      context = `Provide additional information about the product or service in response to this email. Ask if the user has any other questions. Along with proper formatting.`;
      break;
    default:
      context = `Write a generic reply to this email, thanking the user for their interest. Along with proper formatting.`;
  }

  const prompt = `${context}\nEmail Subject:${subject}\nEmail Content:\n${emailContent}`;
  const result = await model.generateContent(prompt);
  const reply = result.response.text().trim();
  console.log("Generated reply:", reply);
  return reply;
};