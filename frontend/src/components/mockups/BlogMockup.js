export default function BlogMockup() {
  const posts = [
    { title: "Building Scalable APIs with FastAPI", tag: "Backend", date: "Mar 15", read: "8 min", color: "bg-blue-500" },
    { title: "React Server Components: A Deep Dive", tag: "Frontend", date: "Mar 12", read: "12 min", color: "bg-purple-500" },
    { title: "The Future of AI in Software Engineering", tag: "AI", date: "Mar 10", read: "6 min", color: "bg-emerald-500" },
    { title: "Mastering TypeScript Generics", tag: "TypeScript", date: "Mar 8", read: "10 min", color: "bg-amber-500" },
  ];
  return (
    <div className="bg-[#0c0c14] text-white min-h-[600px]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-3 border-b border-white/5">
        <div className="flex items-center gap-6">
          <span className="font-bold text-sm">DevBlog</span>
          {["All Posts", "Frontend", "Backend", "AI", "DevOps"].map((c, i) => (
            <span key={c} className={`text-xs ${i === 0 ? "text-white" : "text-zinc-500"}`}>{c}</span>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-zinc-500 w-40">Search...</div>
          <div className="px-3 py-1.5 rounded-lg bg-blue-600 text-xs">Write Post</div>
        </div>
      </nav>
      <div className="flex">
        {/* Main */}
        <div className="flex-1 p-6">
          {/* Featured */}
          <div className="rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-white/5 p-6 mb-6">
            <span className="text-[10px] text-blue-400 uppercase tracking-wider">Featured</span>
            <h2 className="text-xl font-bold mt-2 mb-2">How We Built a Real-Time Collaboration Engine</h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">A deep dive into WebSocket architecture, conflict resolution with CRDTs, and scaling to 100K concurrent users...</p>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-blue-500" />
              <span className="text-xs text-zinc-300">Alex Rivera</span>
              <span className="text-xs text-zinc-600">Mar 16, 2026</span>
              <span className="text-xs text-zinc-600">15 min read</span>
            </div>
          </div>
          {/* Posts */}
          <div className="space-y-4">
            {posts.map((p) => (
              <div key={p.title} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 cursor-pointer transition-all">
                <div className={`w-20 h-20 rounded-lg ${p.color}/20 flex-shrink-0 flex items-center justify-center`}>
                  <div className={`w-8 h-8 rounded ${p.color}/30`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${p.color}/10 text-zinc-400`}>{p.tag}</span>
                    <span className="text-[10px] text-zinc-600">{p.date}</span>
                    <span className="text-[10px] text-zinc-600">{p.read} read</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{p.title}</h3>
                  <p className="text-xs text-zinc-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Sidebar */}
        <div className="w-56 p-6 border-l border-white/5">
          <div className="mb-6">
            <h4 className="text-xs font-medium text-zinc-400 mb-3">Categories</h4>
            {["Frontend (24)", "Backend (18)", "AI (12)", "DevOps (9)", "TypeScript (15)"].map((c) => (
              <div key={c} className="text-xs text-zinc-500 py-1.5 hover:text-white cursor-pointer">{c}</div>
            ))}
          </div>
          <div>
            <h4 className="text-xs font-medium text-zinc-400 mb-3">Popular Tags</h4>
            <div className="flex flex-wrap gap-1.5">
              {["React", "Python", "API", "Docker", "AI", "TypeScript", "CSS", "Node.js"].map((t) => (
                <span key={t} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-zinc-400">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
