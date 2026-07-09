"use client";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // 1. User ka message screen par dikhayein
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // 2. Next.js ke backend API route ko call karein
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      
      // 3. Bot ka reply screen par add karein
      if (data.response) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-slate-900 text-white p-4 max-w-2xl mx-auto">
      <header className="py-4 border-b border-slate-800 text-center">
        <h1 className="text-xl font-bold text-teal-400">Gemini Next.js Chatbot</h1>
      </header>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto my-4 space-y-4 p-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === "user" ? "bg-teal-600 text-white" : "bg-slate-800 text-slate-100"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-slate-400 text-sm animate-pulse">Thinking...</div>}
      </div>

      {/* Input Form Area */}
      <div className="flex gap-2 bg-slate-800 p-2 rounded-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 bg-transparent outline-none px-2 text-white"
        />
        <button onClick={handleSend} className="bg-teal-500 px-4 py-2 rounded-lg font-semibold hover:bg-teal-600">
          Send
        </button>
      </div>
    </main>
  );
}