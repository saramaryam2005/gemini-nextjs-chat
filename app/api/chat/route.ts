import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Yahan naam change karke GoogleGenerativeAI kiya hai
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const response = await model.generateContent(message);
    const botReply = response.response.text();

    return NextResponse.json({ response: botReply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}