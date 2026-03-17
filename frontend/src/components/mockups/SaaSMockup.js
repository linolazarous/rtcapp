export default function SaaSMockup() {
  const stats = [
    { label: "Revenue", value: "$48,200", change: "+12.5%", color: "text-emerald-400" },
    { label: "Users", value: "2,847", change: "+8.2%", color: "text-blue-400" },
    { label: "Churn", value: "1.2%", change: "-0.3%", color: "text-emerald-400" },
    { label: "MRR", value: "$12,450", change: "+15.7%", color: "text-emerald-400" },
  ];
  const rows = [
    { name: "Sarah Chen", email: "sarah@acme.co", plan: "Pro", mrr: "$59", status: "Active" },
    { name: "James Wilson", email: "james@startup.io", plan: "Enterprise", mrr: "$199", status: "Active" },
    { name: "Maria Garcia", email: "maria@design.co", plan: "Starter", mrr: "$29", status: "Trial" },
    { name: "Alex Kim", email: "alex@tech.dev", plan: "Pro", mrr: "$59", status: "Active" },
    { name: "Lisa Park", email: "lisa@corp.com", plan: "Enterprise", mrr: "$199", status: "Churned" },
  ];
  return (
    <div className="flex h-full min-h-[600px] bg-[#0c0c14] text-white">
      {/* Sidebar */}
      <div className="w-52 bg-[#0f0f1a] border-r border-white/5 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold">S</div>
          <span className="font-semibold text-sm">SaaSKit</span>
        </div>
        {["Dashboard", "Analytics", "Customers", "Billing", "Settings"].map((item, i) => (
          <div key={item} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs mb-0.5 ${i === 0 ? "bg-blue-600/15 text-blue-400" : "text-zinc-500 hover:text-zinc-300"}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-blue-400" : "bg-zinc-700"}`} />
            {item}
          </div>
        ))}
        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 px-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
            <div><p className="text-xs text-white">Admin</p><p className="text-[10px] text-zinc-500">admin@saas.co</p></div>
          </div>
        </div>
      </div>
      {/* Main */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-lg font-bold">Dashboard</h1><p className="text-xs text-zinc-500">Welcome back, Admin</p></div>
          <div className="flex gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-zinc-400">Last 30 days</div>
            <div className="px-3 py-1.5 rounded-lg bg-blue-600 text-xs">Export</div>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-[10px] text-zinc-500 mb-1">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
              <p className={`text-xs mt-1 ${s.color}`}>{s.change}</p>
            </div>
          ))}
        </div>
        {/* Chart placeholder */}
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium">Revenue Overview</p>
            <div className="flex gap-3 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" />Revenue</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" />Profit</span>
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-32">
            {[40, 55, 35, 65, 50, 70, 45, 80, 60, 85, 75, 90].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col gap-0.5">
                <div className="rounded-t bg-blue-500/30" style={{ height: `${h}%` }} />
                <div className="rounded-t bg-emerald-500/30" style={{ height: `${h * 0.6}%` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-zinc-600">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>
        {/* Table */}
        <div className="rounded-xl bg-white/[0.03] border border-white/5 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
            <p className="text-sm font-medium">Recent Customers</p>
            <span className="text-[10px] text-blue-400 cursor-pointer">View All</span>
          </div>
          <table className="w-full text-xs">
            <thead><tr className="text-zinc-500 border-b border-white/5">
              <th className="text-left px-4 py-2 font-medium">Name</th><th className="text-left px-4 py-2 font-medium">Plan</th>
              <th className="text-left px-4 py-2 font-medium">MRR</th><th className="text-left px-4 py-2 font-medium">Status</th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.email} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="px-4 py-2.5"><p className="text-white">{r.name}</p><p className="text-zinc-600 text-[10px]">{r.email}</p></td>
                  <td className="px-4 py-2.5"><span className="px-2 py-0.5 rounded bg-white/5 text-zinc-400">{r.plan}</span></td>
                  <td className="px-4 py-2.5 text-zinc-300">{r.mrr}</td>
                  <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-[10px] ${r.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : r.status === "Trial" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
