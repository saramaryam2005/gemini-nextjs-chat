"use client";
import { useState, useEffect } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let id = localStorage.getItem("chat_session_id");
    
    if (!id) {
      id = "session_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("chat_session_id", id);
    }
    
    setSessionId(id);

    async function loadChatHistory() {
      try {
        const res = await fetch(`/api/chat?sessionId=${id}`);
        const data = await res.json();
        if (data.history) {
          const formattedMessages = data.history.map((msg: any) => ({
            sender: msg.sender,
            text: msg.text
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error loading history:", error);
      }
    }
    
    loadChatHistory();
  }, []);

  const handleSend = async () => {
  if (!input.trim() || !sessionId) return;

  const userMsg: Message = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setIsLoading(true); // Loading shuru karein ⏳

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, sessionId }),
    });
    const data = await res.json();
    
    if (data.response) {
      setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
    }
  } catch (error) {
    console.error("Error sending message:", error);
  } finally {
    setIsLoading(false); // Loading khatam karein ✅
  }
};


  const clearChat = () => {
    setMessages([]);
    const newId = "session_" + Math.random().toString(36).substring(2, 9);
    localStorage.setItem("chat_session_id", newId);
    setSessionId(newId);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans overflow-hidden">
      
      {/* Left Sidebar - Premium Layout */}
      <aside className="w-80 bg-slate-900/60 backdrop-blur-md border-r border-slate-800/80 p-6 flex flex-col justify-between max-md:hidden">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-600/20 text-indigo-400 p-2.5 rounded-xl border border-indigo-500/30 text-xl">
              🚀
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Gemini Next AI</h1>
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Cloud PostgreSQL Live
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase px-1">Active Space 🪐</p>
            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-xl text-sm font-mono text-slate-400 flex items-center justify-between group hover:border-slate-700 transition">
              <span>🆔 {sessionId || "Initializing..."}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={clearChat}
          className="w-full py-3 px-4 bg-slate-800/80 border border-slate-700/60 hover:bg-rose-950/30 hover:border-rose-900/50 rounded-xl font-medium text-sm text-slate-300 hover:text-rose-300 transition duration-200 flex items-center justify-center gap-2 shadow-sm"
        >
          🗑️ Reset Session & Clear
        </button>
      </aside>

      {/* Main Chat Core Framework */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Top Header Floating Nav */}
        <header className="h-16 border-b border-slate-800/60 px-6 flex items-center justify-between bg-slate-950/20 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <h2 className="font-semibold text-sm tracking-wide text-slate-200">Gemini Assistant Workspace</h2>
          </div>
          <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1.5 rounded-full border border-slate-700/50 font-medium">Next.js 15 App Router v2</span>
        </header>

        {/* Message Pipeline UI */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60 max-w-sm mx-auto space-y-3">
              <span className="text-4xl animate-bounce">✨</span>
              <h3 className="font-medium text-slate-200">Database Context Synced Successfully!</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Type your prompt below. Your message logs are isolated via serverless parameters and archived automatically.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start animate-fade-in"}`}
              >
                <div className={`flex gap-3 max-w-2xl items-start ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-md font-semibold select-none shrink-0 ${
                    msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300 border border-slate-700/60"
                  }`}>
                    {msg.sender === "user" ? "👤" : "🔮"}
                  </div>
                  {/* Messages Display ke andar, map ke thik niche */}
{isLoading && (
  <div className="flex w-full justify-start animate-pulse">
    <div className="flex gap-3 max-w-2xl items-start">
      <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center justify-center text-sm shadow-md font-semibold select-none shrink-0">
        🔮
      </div>
      <div className="p-3.5 rounded-2xl text-[15px] leading-relaxed bg-slate-800/30 border border-slate-800/80 text-indigo-400 font-medium rounded-tl-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
        <span>Gemini is thinking... 🤔</span>
      </div>
    </div>
  </div>
)}
                  <div
                    className={`p-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm break-words border ${
                      msg.sender === "user" 
                        ? "bg-indigo-600 border-indigo-500 text-white rounded-tr-none" 
                        : "bg-slate-800/50 border-slate-800 text-slate-100 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Prompt Input Core Layout */}
        <div className="p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
          <div className="max-w-4xl mx-auto flex gap-3 bg-slate-900/90 border border-slate-800/80 p-2.5 rounded-2xl shadow-2xl focus-within:border-indigo-500/50 transition-all duration-200 backdrop-blur-md">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-transparent text-white placeholder-slate-500 text-[15px] focus:outline-none"
              placeholder="Ask Gemini anything... ⚡"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button 
              onClick={handleSend} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors duration-150 flex items-center gap-1.5 active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              <span>Send</span> 📥
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}