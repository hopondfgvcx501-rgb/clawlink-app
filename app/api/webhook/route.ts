import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    // 🛠️ Environment Variables fetch kar rahe hain
    const apiKey = process.env.GOOGLE_API_KEY;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-pro';

    // 🚀 Google AI Setup (v1 version use kar rahe hain taaki 404 error na aaye)
    const genAI = new GoogleGenerativeAI(apiKey || '');
    
    const body = await req.json();
    const { message } = body;

    // Agar message mein text nahi hai toh ignore karo
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const userText = message.text;

    // 🔥 Strong Engine (Gemini 1.5 Pro) initialize kar rahe hain
    const model = genAI.getGenerativeModel({ 
      model: modelName 
    });

    // 🌍 Global Personality: English aur Hinglish dono ka support
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      systemInstruction: "You are ClawLink, a professional global AI. Always detect the user's language. If they speak English, reply in English. If they speak Hindi or Hinglish, reply in Hinglish. Keep answers short and strong."
    });

    const replyText = result.response.text();

    // 🤖 Naye Telegram Bot ko message bhej rahe hain
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: replyText,
      }),
    });

    return NextResponse.json({ ok: true });

  } catch (error) {
    // Kisi bhi error ko catch karne ke liye
    console.error("ClawLink Webhook Error:", error);
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}