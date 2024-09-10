// src/services/openAiService.ts
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const analyzeEmailContext = async (emailContent: string) => {
  const response = await openai.createCompletion({
    model: "gpt-4",
    prompt: `Classify this email: ${emailContent}`,
    max_tokens: 50,
  });
  return response.data.choices[0].text.trim();
};

export const generateReply = async (emailContent: string) => {
  const response = await openai.createCompletion({
    model: "gpt-4",
    prompt: `Generate an appropriate response for this email: ${emailContent}`,
    max_tokens: 100,
  });
  return response.data.choices[0].text.trim();
};
