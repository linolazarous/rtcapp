# Right Tech Centre - AI-Powered LMS

## Original Problem Statement
Build an AI-powered Learning Management System (LMS) for Right Tech Centre with:
- Dark theme with yellow-green gradient (derived from logo)
- Platform Name: Right Tech Centre
- Tagline: AI-Powered Tech Education Platform
- 57 programs across Diploma, Bachelor, and Certification categories
- AI Tutor powered by OpenAI GPT-5.2
- Stripe payment integration
- Certificate generation and verification

## User Personas
1. **Students** - Entering tech industry seeking education and certifications
2. **Working Professionals** - Seeking to upskill/reskill in emerging technologies
3. **Organizations** - Requiring workforce technology training

## Core Requirements (Static)
- ✅ Dark theme with #050505 background
- ✅ Yellow-green gradient accents (#CCFF00 to #00FF66)
- ✅ Unbounded font for headings, Manrope for body
- ✅ Video hero section on landing page
- ✅ 57 programs (26 Diploma, 16 Bachelor, 15 Certification)
- ✅ JWT-based authentication
- ✅ Role-based access (Student, Instructor, Admin)
- ✅ Stripe payment integration
- ✅ AI Tutor with GPT-5.2
- ✅ Certificate generation and verification

## What's Been Implemented (Feb 9, 2025)

### Backend (FastAPI + MongoDB)
- Authentication (register, login, JWT tokens)
- Course management CRUD
- Enrollment system
- Payment processing with Stripe
- AI Tutor chat integration
- Certificate generation and verification
- Admin analytics

### Frontend (React)
- Landing page with video hero
- Course catalog with filtering
- Course detail pages with enrollment
- Programs overview page
- Student dashboard
- Admin dashboard
- AI Tutor chat interface
- Login/Register flows
- Certificate verification page
- About page

### Seeded Data
- 57 courses across 3 program types
- Admin user: admin@righttechcentre.com / admin123

## Prioritized Backlog

### P0 (Critical - Not Implemented)
- [x] Core LMS functionality
- [x] Payment integration

### P1 (High Priority - Pending)
- [ ] Video lesson player with Vimeo integration
- [ ] Quiz/Assessment system with AI grading
- [ ] SendGrid email notifications
- [ ] Course module progress tracking
- [ ] Learning interface with video lessons

### P2 (Medium Priority)
- [ ] Instructor dashboard for course management
- [ ] Course creation wizard for admin
- [ ] Capstone project submissions
- [ ] Student progress analytics
- [ ] Push notifications

### P3 (Nice to Have)
- [ ] Social learning features
- [ ] Discussion forums
- [ ] Live sessions integration
- [ ] Mobile app

## Next Tasks
1. Add video player with Vimeo integration (placeholder ready)
2. Implement quiz system with AI-generated questions
3. Add progress tracking for enrolled courses
4. Connect SendGrid for email notifications
5. Build learning interface for enrolled students
