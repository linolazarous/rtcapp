export default function EcommerceMockup() {
  const products = [
    { name: "Wireless Headphones", price: "$89.99", rating: 4.8, img: "from-violet-600 to-purple-400" },
    { name: "Smart Watch Pro", price: "$249.00", rating: 4.9, img: "from-sky-600 to-cyan-400" },
    { name: "Leather Backpack", price: "$129.00", rating: 4.7, img: "from-amber-700 to-orange-500" },
    { name: "Minimalist Desk Lamp", price: "$59.99", rating: 4.6, img: "from-emerald-600 to-green-400" },
    { name: "Portable Speaker", price: "$149.00", rating: 4.5, img: "from-rose-600 to-pink-400" },
    { name: "Running Shoes", price: "$179.00", rating: 4.8, img: "from-blue-600 to-indigo-400" },
  ];
  return (
    <div className="bg-[#0c0c14] text-white min-h-[600px]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0f0f1a]">
        <div className="flex items-center gap-6">
          <span className="font-bold text-sm">ShopAI</span>
          {["All", "Electronics", "Fashion", "Home", "Sports"].map((c, i) => (
            <span key={c} className={`text-xs cursor-pointer ${i === 0 ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}>{c}</span>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-zinc-500 w-48">Search products...</div>
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs">B</div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-[9px] flex items-center justify-center">3</div>
          </div>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-rose-500" />
        </div>
      </nav>
      {/* Hero Banner */}
      <div className="mx-6 mt-4 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/5 p-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-blue-400 mb-1">NEW COLLECTION</p>
          <h2 className="text-xl font-bold mb-1">Spring Sale 2026</h2>
          <p className="text-xs text-zinc-400 mb-3">Up to 40% off on selected items</p>
          <div className="px-4 py-1.5 rounded-lg bg-blue-600 text-xs inline-block cursor-pointer">Shop Now</div>
        </div>
        <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center text-3xl">
          <span className="opacity-50">S</span>
        </div>
      </div>
      {/* Products */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Trending Products</h3>
          <span className="text-xs text-blue-400 cursor-pointer">View All</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.name} className="rounded-xl bg-white/[0.03] border border-white/5 overflow-hidden group cursor-pointer hover:border-white/10 transition-all">
              <div className={`h-32 bg-gradient-to-br ${p.img} relative`}>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/40 text-[10px] backdrop-blur">New</div>
              </div>
              <div className="p-3">
                <p className="text-xs text-white font-medium mb-1">{p.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-400">{p.price}</span>
                  <span className="text-[10px] text-amber-400">{"*".repeat(5)} {p.rating}</span>
                </div>
                <div className="mt-2 py-1.5 rounded-lg bg-white/5 text-center text-[10px] text-zinc-400 hover:bg-blue-600/20 hover:text-blue-400 transition-colors">Add to Cart</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
