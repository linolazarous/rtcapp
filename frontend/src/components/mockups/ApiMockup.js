export default function ApiMockup() {
  const endpoints = [
    { method: "GET", path: "/api/users", desc: "List all users", status: "200" },
    { method: "POST", path: "/api/users", desc: "Create a user", status: "201" },
    { method: "GET", path: "/api/users/{id}", desc: "Get user by ID", status: "200" },
    { method: "PUT", path: "/api/users/{id}", desc: "Update user", status: "200" },
    { method: "DELETE", path: "/api/users/{id}", desc: "Delete user", status: "204" },
    { method: "POST", path: "/api/auth/login", desc: "Authenticate user", status: "200" },
    { method: "POST", path: "/api/auth/refresh", desc: "Refresh token", status: "200" },
    { method: "GET", path: "/api/products", desc: "List products", status: "200" },
  ];
  const methodColors = { GET: "bg-emerald-500/15 text-emerald-400", POST: "bg-blue-500/15 text-blue-400", PUT: "bg-amber-500/15 text-amber-400", DELETE: "bg-red-500/15 text-red-400" };
  return (
    <div className="bg-[#0c0c14] text-white min-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0f0f1a]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-orange-600 flex items-center justify-center text-[10px] font-bold">{"/>"}</div>
          <span className="font-semibold text-sm">API Docs</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">v2.0</span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-white/5 text-zinc-400">Base URL: https://api.example.com</span>
          <span className="px-3 py-1.5 rounded-lg bg-orange-600">Try it out</span>
        </div>
      </div>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-48 p-4 border-r border-white/5 bg-[#0a0a12]">
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Endpoints</p>
          {["Authentication", "Users", "Products", "Orders", "Webhooks"].map((s, i) => (
            <div key={s} className={`text-xs py-2 px-2 rounded cursor-pointer ${i === 1 ? "bg-white/5 text-white" : "text-zinc-500"}`}>{s}</div>
          ))}
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2 mt-4">Models</p>
          {["User", "Product", "Order", "Payment"].map((s) => (
            <div key={s} className="text-xs py-2 px-2 text-zinc-500">{s}</div>
          ))}
        </div>
        {/* Main */}
        <div className="flex-1 p-6">
          <h2 className="text-lg font-bold mb-1">Users API</h2>
          <p className="text-xs text-zinc-500 mb-6">Manage user accounts, profiles, and authentication.</p>
          {/* Endpoints */}
          <div className="space-y-2 mb-6">
            {endpoints.map((e) => (
              <div key={e.method + e.path} className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 cursor-pointer transition-all">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold min-w-[52px] text-center ${methodColors[e.method]}`}>{e.method}</span>
                <code className="text-xs text-zinc-300 font-mono flex-1">{e.path}</code>
                <span className="text-[10px] text-zinc-500">{e.desc}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">{e.status}</span>
              </div>
            ))}
          </div>
          {/* Code example */}
          <div className="rounded-xl bg-[#0a0a12] border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
              <span className="text-[10px] text-zinc-500">Example Request</span>
              <div className="flex gap-2">
                {["cURL", "Python", "JS"].map((l, i) => (
                  <span key={l} className={`text-[10px] px-2 py-0.5 rounded cursor-pointer ${i === 0 ? "bg-white/10 text-white" : "text-zinc-500"}`}>{l}</span>
                ))}
              </div>
            </div>
            <pre className="p-4 text-[11px] text-zinc-400 font-mono leading-relaxed">
{`curl -X GET https://api.example.com/api/users \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json"

# Response: 200 OK
{
  "users": [
    { "id": 1, "name": "John Doe", "email": "john@example.com" },
    { "id": 2, "name": "Jane Smith", "email": "jane@example.com" }
  ],
  "total": 2,
  "page": 1
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
