# CursorCode AI - Product Requirements Document

## Original Problem Statement
Build an autonomous AI software engineering platform called "CursorCode AI" that takes natural language prompts to design, build, deploy, and maintain full-stack applications, powered by xAI's Grok models.

## Tech Stack
- **Frontend:** React 18, TailwindCSS, Shadcn/UI, Framer Motion, Lucide Icons, Monaco Editor
- **Backend:** FastAPI, Motor (async MongoDB), JWT Auth, bcrypt, python-jose
- **Database:** MongoDB
- **3rd Party:** xAI Grok (AI generation), Stripe (payments), SendGrid (email), GitHub OAuth

## Architecture
```
/app/backend/
  server.py              - Main FastAPI app (all routes, auth, CRUD, templates)
  ai_agents.py           - Multi-agent AI system (6 agents)
  orchestrator.py        - AI project orchestration pipeline
  ai_memory.py           - AI context memory (MongoDB-backed)
  ai_streaming.py        - SSE streaming for AI responses
  ai_metrics.py          - Usage tracking
  ai_rate_limiter.py     - Plan-based rate limiting
  ai_security.py         - Prompt validation & code sanitization
  ai_file_manager.py     - Generated project file management
  ai_repo_builder.py     - Repository construction
  ai_planner.py          - Task planning
  ai_task_graph.py       - Task dependency resolution
  code_executor.py       - Sandboxed Python/Node.js execution
  ai_code_reviewer.py    - AI code review
  ai_debugger.py         - AI debugging
  ai_autofix_engine.py   - AI auto-fix
  ai_refactor_engine.py  - AI refactoring
  ai_test_generator.py   - AI test generation
  ai_project_architect.py - AI architecture generation
  utils.py               - Utility functions
/app/frontend/src/
  pages/                 - LandingPage, LoginPage, SignupPage, DashboardPage, ProjectPage,
                           SettingsPage, PricingPage, AdminPage, TemplatesPage
  components/            - Logo, Sidebar, DemoVideoModal, ui/ (shadcn)
  context/               - AuthContext
  lib/                   - api.js (axios instance)
```

## Core Features

### Implemented (v2.0)
- [x] Landing page with hero, features, pricing, testimonials, "Watch Demo" modal
- [x] JWT authentication (signup, login, token refresh)
- [x] GitHub OAuth login/signup
- [x] User dashboard with sidebar navigation
- [x] Project CRUD (create, list, view, edit, delete)
- [x] **Project Templates Gallery** (8 templates: SaaS Dashboard, E-Commerce Store, Blog Platform, REST API Backend, Portfolio Website, Real-Time Chat, AI Assistant, Mobile App)
- [x] AI code generation workspace with Monaco editor
- [x] Multi-agent AI build pipeline (Architect -> Frontend/Backend -> Security -> QA -> DevOps)
- [x] AI build endpoint with demo mode (fallback when XAI_API_KEY not set)
- [x] SSE streaming AI generation
- [x] 5 subscription plans (Starter/Standard/Pro/Premier/Ultra)
- [x] Stripe checkout integration (demo mode when no key)
- [x] Stripe webhook handler (checkout.session.completed, subscription.deleted)
- [x] Credit system with plan-based limits
- [x] Rate limiting per plan
- [x] Simulated project deployment with preview URLs
- [x] Email verification flow (SendGrid - demo mode when no key)
- [x] Settings page (profile editing, subscription management)
- [x] Admin dashboard (stats, user management, usage analytics)
- [x] GitHub repository listing and import
- [x] User profile update endpoint
- [x] AI metrics tracking
- [x] Code execution sandbox (Python/Node.js)

### Mocked/Demo Mode
- AI generation returns demo responses (needs XAI_API_KEY)
- Stripe checkout returns demo URLs (needs STRIPE_SECRET_KEY)
- Email sending skipped (needs SENDGRID_API_KEY)
- GitHub OAuth returns error (needs GITHUB_OAUTH_CLIENT_ID/SECRET)
- Watch Demo video shows "Coming Soon" placeholder (user to upload demo-video.mp4)

## API Endpoints
- Auth: POST /api/auth/signup, /api/auth/login, /api/auth/refresh, GET /api/auth/me, /api/auth/verify-email
- GitHub: GET /api/auth/github, POST /api/auth/github/callback
- User: PUT /api/users/me
- Projects: GET/POST /api/projects, GET/PUT/DELETE /api/projects/:id, PUT /api/projects/:id/files
- **Templates: GET /api/templates, GET /api/templates/:id, POST /api/templates/:id/create**
- AI: POST /api/ai/generate, /api/ai/build, GET /api/ai/models, /api/ai/stream
- Deploy: POST /api/deploy/:id, GET /api/deployments, /api/deployments/:id, DELETE /api/deployments/:id
- Plans: GET /api/plans
- Subscriptions: POST /api/subscriptions/create-checkout, /api/subscriptions/webhook, GET /api/subscriptions/current
- Admin: GET /api/admin/stats, /api/admin/users, /api/admin/usage
- Health: GET /api/health

## Test Credentials
- email: test@cursorcode.ai, password: Test123456!

## Testing Status (March 17, 2026)
- Iteration 3: 16/16 backend, all frontend flows (core features)
- Iteration 4: 17/17 backend, all frontend flows (templates feature)
- All tests passing 100%

## Pending
- User to upload real demo-video.mp4 for Watch Demo modal
- Configure real API keys (xAI, Stripe, SendGrid, GitHub) to activate integrations
- Real file hosting for deployments (currently simulated)
