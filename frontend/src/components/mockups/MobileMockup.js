export default function MobileMockup() {
  return (
    <div className="bg-[#0c0c14] text-white min-h-[600px] flex items-start justify-center py-8">
      {/* Phone Frame */}
      <div className="w-[320px] bg-[#0a0a12] rounded-[2.5rem] border-[3px] border-zinc-800 overflow-hidden shadow-2xl">
        {/* Status Bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1">
          <span className="text-[10px] text-zinc-400 font-medium">9:41</span>
          <div className="w-24 h-5 bg-zinc-900 rounded-full" />
          <div className="flex gap-1">
            <div className="w-3.5 h-2 rounded-sm bg-zinc-600" />
            <div className="w-4 h-2 rounded-sm bg-zinc-600" />
            <div className="w-6 h-2.5 rounded-sm bg-emerald-500" />
          </div>
        </div>
        {/* App Content */}
        <div className="px-5 py-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] text-zinc-500">Good morning</p>
              <h2 className="text-base font-bold">Alex</h2>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold">A</div>
          </div>
          {/* Balance Card */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 mb-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <p className="text-[10px] text-blue-200 mb-1">Total Balance</p>
            <p className="text-2xl font-bold mb-3">$24,568.50</p>
            <div className="flex gap-3">
              <div className="flex-1 py-2 rounded-xl bg-white/20 text-center text-[10px] backdrop-blur">Send</div>
              <div className="flex-1 py-2 rounded-xl bg-white/20 text-center text-[10px] backdrop-blur">Receive</div>
              <div className="flex-1 py-2 rounded-xl bg-white/20 text-center text-[10px] backdrop-blur">Scan</div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { icon: "T", label: "Transfer", color: "bg-blue-500/15 text-blue-400" },
              { icon: "$", label: "Pay Bills", color: "bg-emerald-500/15 text-emerald-400" },
              { icon: "H", label: "History", color: "bg-purple-500/15 text-purple-400" },
              { icon: "+", label: "More", color: "bg-amber-500/15 text-amber-400" },
            ].map((a) => (
              <div key={a.label} className="text-center">
                <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center mx-auto mb-1 text-xs font-bold`}>{a.icon}</div>
                <p className="text-[9px] text-zinc-500">{a.label}</p>
              </div>
            ))}
          </div>
          {/* Transactions */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold">Recent</span>
            <span className="text-[10px] text-blue-400">See All</span>
          </div>
          {[
            { name: "Spotify", desc: "Subscription", amount: "-$9.99", color: "from-green-500 to-emerald-500", type: "debit" },
            { name: "John Smith", desc: "Transfer received", amount: "+$250.00", color: "from-blue-500 to-cyan-500", type: "credit" },
            { name: "Amazon", desc: "Shopping", amount: "-$67.50", color: "from-amber-500 to-orange-500", type: "debit" },
            { name: "Salary", desc: "Monthly deposit", amount: "+$5,200", color: "from-purple-500 to-pink-500", type: "credit" },
          ].map((t) => (
            <div key={t.name} className="flex items-center gap-3 py-2.5">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-[10px] font-bold`}>{t.name[0]}</div>
              <div className="flex-1">
                <p className="text-xs font-medium">{t.name}</p>
                <p className="text-[10px] text-zinc-600">{t.desc}</p>
              </div>
              <span className={`text-xs font-semibold ${t.type === "credit" ? "text-emerald-400" : "text-zinc-300"}`}>{t.amount}</span>
            </div>
          ))}
        </div>
        {/* Bottom Nav */}
        <div className="flex items-center justify-around px-6 py-3 border-t border-white/5 bg-[#0a0a12]">
          {["Home", "Cards", "Stats", "Profile"].map((tab, i) => (
            <div key={tab} className="text-center">
              <div className={`w-5 h-5 rounded mx-auto mb-0.5 ${i === 0 ? "bg-blue-500/20" : "bg-white/5"}`} />
              <span className={`text-[9px] ${i === 0 ? "text-blue-400" : "text-zinc-600"}`}>{tab}</span>
            </div>
          ))}
        </div>
        {/* Home Indicator */}
        <div className="flex justify-center py-2">
          <div className="w-28 h-1 bg-zinc-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
