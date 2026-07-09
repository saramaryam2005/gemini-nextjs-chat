import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db"; // Neon client import kiya

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json(); 
    const currentSessionId = sessionId || "default-session";

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const response = await model.generateContent(message);
    const botReply = response.response.text();

    // 1. User ka message database me daalein
    await sql`
      INSERT INTO gemini_messages (session_id, sender, message_text) 
      VALUES (${currentSessionId}, 'user', ${message})
    `;

    // 2. Gemini ka reply database me daalein
    await sql`
      INSERT INTO gemini_messages (session_id, sender, message_text) 
      VALUES (${currentSessionId}, 'bot', ${botReply})
    `;

    return NextResponse.json({ response: botReply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}

// Isko app/api/chat/route.ts me naye function ki tarah jodiye
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId") || "default-session";

    // Neon database se is session ke saare messages purane se naye order me nikalna
    const history = await sql`
      SELECT sender, message_text as text 
      FROM gemini_messages 
      WHERE session_id = ${sessionId} 
      ORDER BY created_at ASC
    `;

    return NextResponse.json({ history });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}