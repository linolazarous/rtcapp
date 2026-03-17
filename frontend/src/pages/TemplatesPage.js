import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { toast } from "sonner";
import Sidebar from "../components/Sidebar";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Server,
  Briefcase,
  MessageCircle,
  Bot,
  Smartphone,
  Search,
  Loader2,
  ArrowRight,
  Zap,
  Star,
  Filter,
} from "lucide-react";

const ICON_MAP = {
  "layout-dashboard": LayoutDashboard,
  "shopping-cart": ShoppingCart,
  "file-text": FileText,
  server: Server,
  briefcase: Briefcase,
  "message-circle": MessageCircle,
  bot: Bot,
  smartphone: Smartphone,
};

const CATEGORY_LABELS = {
  all: "All Templates",
  saas: "SaaS",
  ecommerce: "E-Commerce",
  content: "Content",
  backend: "Backend",
  website: "Website",
  realtime: "Real-Time",
  ai: "AI / ML",
  mobile: "Mobile",
};

const COMPLEXITY_COLORS = {
  beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  advanced: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

export default function TemplatesPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await api.get("/templates");
      setTemplates(res.data.templates);
      setCategories(res.data.categories);
    } catch {
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async (template) => {
    setCreating(template.id);
    try {
      const res = await api.post(`/templates/${template.id}/create`);
      toast.success(`Project "${template.name}" created!`);
      navigate(`/project/${res.data.id}`);
    } catch {
      toast.error("Failed to create project from template");
    } finally {
      setCreating(null);
    }
  };

  const filtered = templates.filter((t) => {
    const matchCategory =
      activeCategory === "all" || t.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tech_stack.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchCategory && matchSearch;
  });

  const creditsRemaining = user ? user.credits - user.credits_used : 0;
  const creditsPercentage = user
    ? ((user.credits - user.credits_used) / user.credits) * 100
    : 0;

  return (
    <div className="min-h-screen bg-void flex">
      <Sidebar
        user={user}
        logout={logout}
        creditsRemaining={creditsRemaining}
        creditsPercentage={creditsPercentage}
        onUpgrade={() => navigate("/pricing")}
        onConnectGitHub={() => {}}
        onImportGitHub={() => {}}
        githubLoading={false}
      />

      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-void/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1
                className="font-outfit font-bold text-2xl text-white"
                data-testid="templates-title"
              >
                Templates
              </h1>
              <p className="text-sm text-zinc-400">
                Start faster with pre-built project blueprints
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-void-subtle border-white/10 text-white placeholder:text-zinc-500 h-10"
                data-testid="templates-search"
              />
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Category Filter */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-zinc-500 flex-shrink-0" />
            {["all", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-testid={`filter-${cat}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-electric text-white shadow-glow"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-electric animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="font-outfit text-xl text-white mb-2">
                No templates found
              </h3>
              <p className="text-zinc-400">
                Try a different search or category
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((template, i) => {
                  const Icon = ICON_MAP[template.icon] || Zap;
                  return (
                    <motion.div
                      key={template.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04 }}
                      className="group relative rounded-xl border border-white/5 bg-void-paper overflow-hidden hover:border-white/15 transition-all"
                      data-testid={`template-card-${template.id}`}
                    >
                      {/* Gradient Header */}
                      <div
                        className={`relative h-36 bg-gradient-to-br ${template.gradient} p-6 flex items-end`}
                      >
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          {template.popular && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-white text-xs font-medium">
                              <Star className="w-3 h-3 fill-current" />
                              Popular
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                              COMPLEXITY_COLORS[template.complexity]
                            }`}
                          >
                            {template.complexity}
                          </span>
                        </div>
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-outfit font-bold text-lg text-white leading-tight">
                              {template.name}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5 space-y-4">
                        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
                          {template.description}
                        </p>

                        {/* Tech Stack Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {template.tech_stack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded text-xs bg-white/5 text-zinc-300 border border-white/5"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <div className="flex items-center gap-1 text-xs text-zinc-500">
                            <Zap className="w-3 h-3 text-electric" />
                            ~{template.estimated_credits} credits
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleUseTemplate(template)}
                            disabled={creating === template.id}
                            className="bg-electric hover:bg-electric/90 text-white text-xs h-8 px-4 shadow-glow"
                            data-testid={`use-template-${template.id}`}
                          >
                            {creating === template.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                Use Template
                                <ArrowRight className="w-3 h-3 ml-1" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
