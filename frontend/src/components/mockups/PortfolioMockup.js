export default function PortfolioMockup() {
  const projects = [
    { name: "AI Dashboard", desc: "Real-time ML analytics", color: "from-blue-600 to-cyan-400", tag: "React" },
    { name: "E-Commerce App", desc: "Full-stack store", color: "from-purple-600 to-pink-400", tag: "Next.js" },
    { name: "Design System", desc: "Component library", color: "from-emerald-600 to-teal-400", tag: "Storybook" },
    { name: "Mobile Banking", desc: "Fintech app", color: "from-amber-600 to-orange-400", tag: "React Native" },
  ];
  const skills = [
    { name: "React", pct: 95 }, { name: "TypeScript", pct: 90 }, { name: "Python", pct: 85 },
    { name: "Node.js", pct: 88 }, { name: "AWS", pct: 75 }, { name: "Docker", pct: 80 },
  ];
  return (
    <div className="bg-[#0c0c14] text-white min-h-[600px]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5">
        <span className="font-bold text-sm">Alex.dev</span>
        <div className="flex gap-6 text-xs text-zinc-500">
          {["About", "Projects", "Skills", "Blog", "Contact"].map((l) => <span key={l} className="hover:text-white cursor-pointer">{l}</span>)}
        </div>
        <div className="flex gap-2">
          <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px]">GH</div>
          <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px]">LI</div>
        </div>
      </nav>
      {/* Hero */}
      <div className="px-8 py-12 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(59,130,246,0.08),transparent_60%)]" />
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto mb-4 flex items-center justify-center text-2xl font-bold">A</div>
          <h1 className="text-2xl font-bold mb-2">Alex Rivera</h1>
          <p className="text-sm text-zinc-400 mb-1">Full-Stack Engineer & Designer</p>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">Building beautiful, performant web experiences. 5+ years of shipping products at scale.</p>
          <div className="flex gap-3 justify-center mt-4">
            <div className="px-4 py-1.5 rounded-lg bg-blue-600 text-xs">View Projects</div>
            <div className="px-4 py-1.5 rounded-lg bg-white/5 text-xs text-zinc-400">Contact Me</div>
          </div>
        </div>
      </div>
      {/* Projects */}
      <div className="px-8 pb-8">
        <h3 className="text-sm font-semibold mb-4">Featured Projects</h3>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {projects.map((p) => (
            <div key={p.name} className="rounded-xl overflow-hidden bg-white/[0.02] border border-white/5 hover:border-white/10 cursor-pointer transition-all">
              <div className={`h-28 bg-gradient-to-br ${p.color} relative`}>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/30 text-[10px] backdrop-blur">{p.tag}</span>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold">{p.name}</p>
                <p className="text-[10px] text-zinc-500">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Skills */}
        <h3 className="text-sm font-semibold mb-4">Skills</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {skills.map((s) => (
            <div key={s.name}>
              <div className="flex justify-between text-xs mb-1"><span className="text-zinc-300">{s.name}</span><span className="text-zinc-500">{s.pct}%</span></div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.pct}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
