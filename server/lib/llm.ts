import OpenAI from "openai";

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("[LLM] WARNING: API Key (for Groq) is not configured. Chatbot features will be unavailable.");
    return null;
  }
  // Using Groq but via OpenAI SDK
  return new OpenAI({ 
    apiKey,
    baseURL: "https://api.groq.com/openai/v1"
  });
};

const openai = getOpenAIClient();

export async function invokeLLM(messages: any[]) {
  if (!openai) {
    throw new Error("Chatbot is currently disabled: API Key is missing in .env");
  }

  const completion = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: messages,
  });

  return completion.choices[0].message.content;
}