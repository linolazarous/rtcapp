export default function ChatMockup() {
  const contacts = [
    { name: "Design Team", msg: "New mockups uploaded", time: "2m", unread: 3, color: "from-violet-500 to-purple-500" },
    { name: "Sarah Chen", msg: "Sounds good! Let me know", time: "15m", unread: 0, color: "from-pink-500 to-rose-500" },
    { name: "Engineering", msg: "PR #142 merged", time: "1h", unread: 1, color: "from-blue-500 to-cyan-500" },
    { name: "Alex Kim", msg: "Meeting at 3pm?", time: "2h", unread: 0, color: "from-emerald-500 to-green-500" },
    { name: "Product", msg: "Sprint review notes", time: "3h", unread: 5, color: "from-amber-500 to-orange-500" },
  ];
  const messages = [
    { sender: "Sarah", text: "Hey! Have you seen the latest design specs?", time: "2:30 PM", self: false },
    { sender: "You", text: "Yes! They look great. I especially like the new dashboard layout.", time: "2:31 PM", self: true },
    { sender: "Sarah", text: "Thanks! We spent a lot of time on the data visualization components. Should be easy to implement with the chart library.", time: "2:33 PM", self: false },
    { sender: "You", text: "I'll start on the frontend implementation tomorrow. Quick question - are we using Recharts or D3?", time: "2:35 PM", self: true },
    { sender: "Sarah", text: "Recharts for the simple charts, D3 for the custom ones. I'll send over the component specs.", time: "2:36 PM", self: false },
  ];
  return (
    <div className="flex h-full min-h-[600px] bg-[#0c0c14] text-white">
      {/* Contacts */}
      <div className="w-64 bg-[#0a0a12] border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Messages</h3>
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px]">+</div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-zinc-500">Search conversations...</div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((c, i) => (
            <div key={c.name} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${i === 0 ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}>
              <div className="relative">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-xs font-bold`}>{c.name[0]}</div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0a0a12]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium truncate">{c.name}</span>
                  <span className="text-[10px] text-zinc-600">{c.time}</span>
                </div>
                <p className="text-[10px] text-zinc-500 truncate">{c.msg}</p>
              </div>
              {c.unread > 0 && (
                <div className="w-4 h-4 rounded-full bg-blue-600 text-[9px] flex items-center justify-center flex-shrink-0">{c.unread}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Chat */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-xs font-bold">D</div>
            <div>
              <p className="text-xs font-medium">Design Team</p>
              <p className="text-[10px] text-emerald-400">4 members online</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[10px] text-zinc-500">P</div>
            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[10px] text-zinc-500">S</div>
          </div>
        </div>
        <div className="flex-1 p-5 space-y-4 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.self ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-xl px-3.5 py-2.5 ${m.self ? "bg-blue-600/20 border border-blue-500/20" : "bg-white/[0.04] border border-white/5"}`}>
                {!m.self && <p className="text-[10px] text-blue-400 mb-0.5">{m.sender}</p>}
                <p className="text-xs text-zinc-200 leading-relaxed">{m.text}</p>
                <p className={`text-[9px] mt-1 ${m.self ? "text-blue-400/50" : "text-zinc-600"}`}>{m.time}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 text-[10px] text-zinc-600">
            <div className="flex gap-0.5"><div className="w-1 h-1 rounded-full bg-zinc-600 animate-bounce" /><div className="w-1 h-1 rounded-full bg-zinc-600 animate-bounce" style={{animationDelay:"0.1s"}} /><div className="w-1 h-1 rounded-full bg-zinc-600 animate-bounce" style={{animationDelay:"0.2s"}} /></div>
            Sarah is typing...
          </div>
        </div>
        <div className="px-5 py-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs text-zinc-500">+</div>
            <div className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-xs text-zinc-500">Type a message...</div>
            <div className="px-4 py-2 rounded-lg bg-blue-600 text-xs">Send</div>
          </div>
        </div>
      </div>
    </div>
  );
}
