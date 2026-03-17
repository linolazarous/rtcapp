export default function AiMockup() {
  const threads = [
    { title: "Code Review Help", time: "Just now", active: true },
    { title: "Architecture Design", time: "2h ago", active: false },
    { title: "Bug Investigation", time: "Yesterday", active: false },
    { title: "API Documentation", time: "2 days ago", active: false },
  ];
  const messages = [
    { role: "user", text: "Can you help me design a scalable notification system for my SaaS app? It needs to support email, SMS, and push notifications." },
    { role: "ai", text: "I'd recommend a **message queue-based architecture** with these components:\n\n**1. Event Bus** - Kafka or RabbitMQ for reliable event processing\n\n**2. Notification Service** - Consumes events and routes to the right channel\n\n**3. Channel Adapters:**\n  - Email: SendGrid / SES\n  - SMS: Twilio\n  - Push: Firebase Cloud Messaging\n\n**4. Template Engine** - Store notification templates in DB with variable interpolation\n\n**5. User Preferences** - Let users control which channels they receive notifications on\n\nShall I generate the code for any of these components?" },
    { role: "user", text: "Yes, generate the notification service with the message queue consumer." },
  ];
  return (
    <div className="flex h-full min-h-[600px] bg-[#0c0c14] text-white">
      {/* Sidebar */}
      <div className="w-56 bg-[#0a0a12] border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-[10px] font-bold">AI</div>
            <span className="font-semibold text-sm">Assistant</span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-white/5 text-xs text-center text-zinc-400 cursor-pointer hover:bg-white/10 transition-colors">+ New Chat</div>
        </div>
        <div className="flex-1 p-2 space-y-0.5">
          {threads.map((t) => (
            <div key={t.title} className={`px-3 py-2.5 rounded-lg cursor-pointer text-xs transition-colors ${t.active ? "bg-white/[0.06] text-white" : "text-zinc-500 hover:bg-white/[0.03]"}`}>
              <p className="truncate">{t.title}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">{t.time}</p>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.03]">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[9px] font-bold">U</div>
            <div><p className="text-[10px] text-zinc-300">Free Plan</p><p className="text-[9px] text-zinc-600">8/10 credits</p></div>
          </div>
        </div>
      </div>
      {/* Chat */}
      <div className="flex-1 flex flex-col">
        <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Code Review Help</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400">GPT-4</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Tokens: 2,847</span>
            <div className="w-px h-3 bg-white/10" />
            <span>3 messages</span>
          </div>
        </div>
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "" : ""}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${m.role === "ai" ? "bg-gradient-to-br from-rose-500 to-pink-600" : "bg-white/10"}`}>
                {m.role === "ai" ? "AI" : "U"}
              </div>
              <div className="flex-1">
                <div className={`text-xs leading-relaxed ${m.role === "ai" ? "text-zinc-300" : "text-zinc-200"}`}>
                  {m.text.split("\n").map((line, j) => (
                    <p key={j} className={`${line.startsWith("**") ? "font-semibold text-white mt-2" : ""} ${line.startsWith("  -") ? "ml-4 text-zinc-400" : ""} ${j > 0 ? "mt-1" : ""}`}>
                      {line.replace(/\*\*/g, "")}
                    </p>
                  ))}
                </div>
                {m.role === "ai" && i === 1 && (
                  <div className="flex gap-2 mt-3">
                    <div className="px-2.5 py-1 rounded bg-white/5 text-[10px] text-zinc-400 cursor-pointer hover:bg-white/10">Copy</div>
                    <div className="px-2.5 py-1 rounded bg-white/5 text-[10px] text-zinc-400 cursor-pointer hover:bg-white/10">Regenerate</div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Streaming indicator */}
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-[10px] font-bold">AI</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{animationDelay:"0.15s"}} />
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{animationDelay:"0.3s"}} />
                </div>
                <span className="text-[10px] text-zinc-600">Generating notification service code...</span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-500">Ask anything about your project...</div>
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center cursor-pointer">
              <span className="text-xs">-&gt;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
