import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Zap,
  Star,
  Code2,
  Layers,
  Shield,
  Rocket,
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Server,
  Briefcase,
  MessageCircle,
  Bot,
  Smartphone,
  Monitor,
} from "lucide-react";

// Mockup imports
import SaaSMockup from "../components/mockups/SaaSMockup";
import EcommerceMockup from "../components/mockups/EcommerceMockup";
import BlogMockup from "../components/mockups/BlogMockup";
import ApiMockup from "../components/mockups/ApiMockup";
import PortfolioMockup from "../components/mockups/PortfolioMockup";
import ChatMockup from "../components/mockups/ChatMockup";
import AiMockup from "../components/mockups/AiMockup";
import MobileMockup from "../components/mockups/MobileMockup";

const MOCKUP_MAP = {
  "saas-dashboard": SaaSMockup,
  "ecommerce-store": EcommerceMockup,
  "blog-platform": BlogMockup,
  "api-backend": ApiMockup,
  "portfolio-site": PortfolioMockup,
  "realtime-chat": ChatMockup,
  "ai-assistant": AiMockup,
  "mobile-app": MobileMockup,
};

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

const COMPLEXITY_COLORS = {
  beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  advanced: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

export default function TemplatePreviewPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeView, setActiveView] = useState("desktop");

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      const res = await api.get(`/templates/${templateId}`);
      setTemplate(res.data);
    } catch {
      toast.error("Template not found");
      navigate("/templates");
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async () => {
    setCreating(true);
    try {
      const res = await api.post(`/templates/${templateId}/create`);
      toast.success(`Project "${template.name}" created!`);
      navigate(`/project/${res.data.id}`);
    } catch {
      toast.error("Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-electric animate-spin" />
      </div>
    );
  }

  if (!template) return null;

  const MockupComponent = MOCKUP_MAP[templateId];
  const Icon = ICON_MAP[template.icon] || Zap;

  return (
    <div className="min-h-screen bg-void" data-testid="template-preview-page">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-void/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/templates")}
              className="text-zinc-400 hover:text-white"
              data-testid="preview-back-btn"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <div className="h-5 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg bg-gradient-to-br ${template.gradient} flex items-center justify-center`}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="font-outfit font-semibold text-white text-sm">
                {template.name}
              </span>
              {template.popular && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs">
                  <Star className="w-3 h-3 fill-current" />
                  Popular
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Viewport Toggle */}
            <div className="flex items-center bg-white/5 rounded-lg p-0.5">
              <button
                onClick={() => setActiveView("desktop")}
                className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                  activeView === "desktop"
                    ? "bg-electric text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
                data-testid="view-desktop"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveView("mobile")}
                className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                  activeView === "mobile"
                    ? "bg-electric text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
                data-testid="view-mobile"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <Button
              onClick={handleUseTemplate}
              disabled={creating}
              className="bg-electric hover:bg-electric/90 text-white shadow-glow text-sm h-9"
              data-testid="preview-use-template-btn"
            >
              {creating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Rocket className="w-4 h-4 mr-2" />
              )}
              Use Template
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto flex gap-0 min-h-[calc(100vh-57px)]">
        {/* Mockup Area */}
        <div className="flex-1 p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mx-auto rounded-xl border border-white/10 bg-[#0a0a0f] overflow-hidden shadow-2xl transition-all duration-500 ${
              activeView === "mobile" ? "max-w-[400px]" : "w-full"
            }`}
            style={{ height: "calc(100vh - 120px)" }}
            data-testid="mockup-container"
          >
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#12121a] border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white/5 rounded-md px-3 py-1 text-xs text-zinc-500 text-center">
                  {template.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}.cursorcode.app
                </div>
              </div>
            </div>

            {/* Mockup Content */}
            <div className="overflow-y-auto" style={{ height: "calc(100% - 40px)" }}>
              {MockupComponent ? (
                <MockupComponent />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-500">
                  Preview not available
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Details Sidebar */}
        <aside className="w-80 border-l border-white/5 bg-void-paper/50 p-6 space-y-6 overflow-y-auto flex-shrink-0">
          {/* Template Info */}
          <div>
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center mb-4`}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-outfit font-bold text-xl text-white mb-2">
              {template.name}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {template.description}
            </p>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                COMPLEXITY_COLORS[template.complexity]
              }`}
            >
              {template.complexity}
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-electric/10 text-electric border border-electric/20">
              <Zap className="w-3 h-3" />~{template.estimated_credits} credits
            </span>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Tech Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {template.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md text-xs bg-white/5 text-zinc-300 border border-white/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> What you get
            </h3>
            <ul className="space-y-2">
              {[
                "Full source code & architecture",
                "Production-ready components",
                "Authentication & authorization",
                "Database models & migrations",
                "API documentation",
                "Deployment configuration",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-zinc-400"
                >
                  <Shield className="w-3.5 h-3.5 text-electric mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="pt-4 border-t border-white/5 space-y-3">
            <Button
              onClick={handleUseTemplate}
              disabled={creating}
              className="w-full bg-electric hover:bg-electric/90 text-white shadow-glow"
              data-testid="sidebar-use-template-btn"
            >
              {creating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              Use This Template
            </Button>
            <p className="text-center text-xs text-zinc-500">
              Creates a new project with pre-filled AI prompt
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
