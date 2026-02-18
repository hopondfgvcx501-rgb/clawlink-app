import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Mistral } from '@mistralai/mistralai';

// 1. Clients Setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

export async function POST(req: Request) {
  try {
    // User request se 'model' aur 'prompt' dono lenge
    const { prompt, model } = await req.json();
    
    let result = "";

    // 2. Model Switcher Logic
    switch (model) {
      case 'chatgpt':
        // ChatGPT 5.1 / 5.2 Logic
        const gptResponse = await openai.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: process.env.OPENAI_MODEL || "gpt-4o",
        });
        result = gptResponse.choices[0].message.content || "";
        break;

      case 'claude':
        // Claude Opus 4.5 / 4.6 Logic
        const claudeResponse = await anthropic.messages.create({
          model: process.env.CLAUDE_MODEL || "claude-3-opus-20240229",
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
        });
        // Note: Anthropic response structure handling
        if (claudeResponse.content[0].type === 'text') {
            result = claudeResponse.content[0].text;
        }
        break;

      case 'gemini':
        // Gemini 3 Pro Logic
        const googleModel = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-1.5-pro" });
        const geminiResult = await googleModel.generateContent(prompt);
        result = geminiResult.response.text();
        break;

      case 'mistral':
        // Mistral Large Logic
        const mistralResponse = await mistral.chat.complete({
            model: process.env.MISTRAL_MODEL || "mistral-large-latest",
            messages: [{ role: "user", content: prompt }],
        });
        result = mistralResponse.choices?.[0].message.content || "";
        break;

      default:
        return NextResponse.json({ error: "Invalid Model Selected" }, { status: 400 });
    }

    return NextResponse.json({ result });

  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "AI Service Failed" }, { status: 500 });
  }
}