# CursorCode AI - Product Requirements Document

## Original Problem Statement
Build an autonomous AI software engineering platform called "CursorCode AI" that takes natural language prompts to design, build, deploy, and maintain full-stack applications. Powered by xAI's Grok models.

## Tech Stack
- **Frontend:** React, Tailwind CSS, Shadcn/UI, Framer Motion, React Router, Monaco Editor
- **Backend:** FastAPI, MongoDB (Motor), JWT Authentication, httpx (xAI API)
- **AI:** xAI Grok (grok-4-latest, grok-4-1-fast-reasoning, grok-4-1-fast-non-reasoning)
- **3rd Party:** Stripe (billing), SendGrid (email), GitHub OAuth, Emergent Google Auth

## Architecture
```
/app/
├── backend/
│   ├── server.py             # Main FastAPI entry (all routes, AI endpoints, SSE streaming)
│   ├── ai_agents.py          # Multi-agent helper (direct Grok calls)
│   ├── auth_modules/         # Auth helpers
│   ├── db/                   # MongoDB connection (Motor)
│   ├── models/               # Pydantic models
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main routing
│   │   ├── components/       # TwoFactorSetup, CreditMeter, OnboardingWizard, Sidebar, Logo, DemoVideoModal
│   │   ├── context/          # AuthContext
│   │   ├── lib/              # API client (axios)
│   │   ├── pages/            # All pages (ProjectPage with AI workspace)
│   │   └── mockups/          # Template previews
│   └── package.json
```

## All Completed Features (Tested - 100% Pass)
1. User authentication (signup, login, JWT, refresh tokens)
2. GitHub OAuth + Emergent Google Auth
3. User/Admin dashboards with project CRUD
4. Project Templates Gallery with filterable categories
5. Template Preview Mode with interactive mockups
6. Pricing page with Stripe checkout integration
7. Settings page (profile, billing, API keys, security)
8. Demo Video Modal on landing page
9. Email verification flow
10. **Two-Factor Authentication (2FA/TOTP)** - Enable, verify, disable, login with 2FA
11. **Password Reset Flow** - Email-based reset with token expiration + password strength meter
12. **Enhanced Landing Page** - Architecture Graph (7 agents), Deploy Terminal animation, Enterprise Compliance
13. **Credit Meter Component** - Visual credit tracking on Dashboard & Project headers
14. **Security Tab in Settings** - Full 2FA management UI
15. **Guided Onboarding Wizard** - 4-step wizard for new users
16. **Real AI Code Generation** - xAI Grok integration with:
    - Single-agent Quick mode (POST /api/ai/generate)
    - Multi-agent SSE streaming (GET /api/ai/generate-stream) with 6 specialized agents
    - Architect, Frontend, Backend, Security, QA, DevOps agents
    - Real-time streaming with live agent status in UI
    - Automatic file parsing and project file updates
    - Quick/Multi-Agent mode toggle in Project workspace
    - 3 Grok model tiers with credit-based metering

## Key API Endpoints
- `/api/auth/signup`, `/api/auth/login`, `/api/auth/login-2fa`
- `/api/auth/2fa/enable`, `/api/auth/2fa/verify`, `/api/auth/2fa/disable`
- `/api/auth/reset-password/request`, `/api/auth/reset-password/confirm`
- `/api/users/me` (GET/PUT), `/api/users/me/complete-onboarding`
- `/api/projects` (CRUD), `/api/projects/:id/files`
- `/api/ai/generate` (POST - single agent), `/api/ai/generate-stream` (GET - SSE multi-agent)
- `/api/ai/models`, `/api/deploy/:id`
- `/api/stripe/create-checkout-session`, `/api/stripe/webhook` (stub)
- `/api/templates`, `/api/admin/stats`

## Pending Tasks
### P1
- Stripe Webhook - full implementation for checkout.session.completed

### P2
- Real file hosting for deployments (object storage)
- Email verification enforcement
- Community templates

### Mocked/Simulated
- Project deployment (simulation with fake preview URLs)
- Stripe webhook (stub)
- AI returns demo code when XAI_API_KEY is empty (pipeline works, just placeholder content)
