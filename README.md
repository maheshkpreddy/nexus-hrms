# NEXUS HRMS — Enterprise Multi-Company AI-Driven HRMS Platform

A next-generation **Multi-Company, Multi-Tenant, Role-Based AI-Driven Human Resource Management System** designed for enterprises, staffing agencies, and global organizations.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Features

### Core HRMS Modules (25+)
| Module | Description |
|--------|-------------|
| 🏢 **Dashboard** | Real-time KPIs, charts, AI insights, quick actions |
| 👥 **Employee Management** | Full employee lifecycle, directory, org charts |
| 🔄 **Onboarding** | Digital onboarding workflows, checklists, progress tracking |
| 🎯 **Recruitment (ATS)** | Job requisitions, candidate pipelines, AI screening |
| 🌐 **Job Portal** | LinkedIn/Naukri-style marketplace for job seekers |
| 🤖 **AI Interview** | AI-powered first-round interviews (text/voice/video/MCQ/coding) |
| ⏰ **Attendance** | Multi-method attendance (biometric, GPS, QR, RFID, mobile) |
| 📅 **Leave Management** | Multi-type leave, policy engine, AI predictions |
| 💰 **Payroll** | Multi-country payroll, tax calculations, compliance |
| 📈 **Performance** | OKR/KPI tracking, 360° reviews, AI appraisals |
| 🎓 **Learning (LMS)** | Courses, certifications, skill gap analysis |
| 💚 **Engagement** | Pulse surveys, sentiment analysis, recognition |
| ✈️ **Travel & Expense** | Travel requests, OCR bill scanning, fraud detection |
| 💻 **Asset Management** | IT asset tracking, allocation, lifecycle prediction |
| 🎧 **Helpdesk** | Ticketing, SLA management, AI auto-resolution |
| 🛡️ **Compliance** | Labor law compliance, audit trails, risk alerts |
| ⚡ **Workflow Builder** | Drag-and-drop workflow automation |
| 📊 **Analytics & BI** | Workforce, attrition, hiring, payroll, diversity analytics |
| 🤝 **Client Portal** | Client requisitions, candidate review, SLA tracking |
| 🚛 **Vendor Portal** | Vendor management, candidate submissions, scorecards |
| 🔗 **Sub-Vendor Portal** | Multi-layer recruitment ecosystem |
| 🎓 **Alumni** | Rehire workflows, referral networks |
| 🏢 **Multi-Company** | Holding company management, branch/department hierarchy |
| 🤖 **AI Chatbot** | Natural language HR assistant with context awareness |
| ⚙️ **Settings** | Profile, notifications, integrations, API keys |

### Multi-Company Architecture
- **Global Parent Tenant** — Holding company management
- **Company Tenant** — Individual company instances
- **Branch Tenant** — Location-based operations
- **Department/Team Layers** — Full organizational hierarchy
- Independent branding, policies, workflows per company
- Inter-company transfers and shared services

### Role-Based Access Control (14 Roles)
- Super Admin, HR Admin, HR Executive, Department Head
- Reporting Manager, Employee, Finance, IT Admin
- Recruiter, Vendor, Sub-Vendor, Client, Auditor, Job Seeker

### AI Capabilities
- Resume parsing & candidate ranking
- Predictive attrition analysis
- Payroll anomaly detection
- AI chatbot assistant
- AI interview system
- Sentiment analysis
- Workforce forecasting
- Skill gap analysis
- Compliance alerts

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui |
| Charts | Recharts |
| State | Zustand |
| Database | Prisma ORM (SQLite) |
| AI | z-ai-web-dev-sdk (OpenAI compatible) |
| Icons | Lucide React |
| Animation | Framer Motion |
| Auth | NextAuth.js (ready) |
| Deployment | Vercel |

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/nexus-hrms.git
cd nexus-hrms

# Install dependencies
npm install
# or
bun install

# Set up environment variables
cp .env.example .env

# Initialize the database
npx prisma db push
# or
bun run db:push

# Start the development server
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Login
The app runs in demo mode with quick-login buttons:
- **Super Admin** — Full platform access
- **HR Admin** — Company HR management
- **Employee** — Self-service portal
- **Client** — Client portal access
- **Vendor** — Vendor portal access

---

## 📁 Project Structure

```
nexus-hrms/
├── prisma/
│   └── schema.prisma          # Database schema (25+ models)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── ai-chat/       # AI chatbot API endpoint
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx           # Main entry point
│   ├── components/
│   │   ├── hrms/
│   │   │   ├── login-screen.tsx
│   │   │   ├── hrms-layout.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── recruitment.tsx
│   │   │   ├── employees.tsx
│   │   │   ├── attendance.tsx
│   │   │   ├── leave.tsx
│   │   │   ├── payroll.tsx
│   │   │   ├── performance.tsx
│   │   │   ├── learning.tsx
│   │   │   ├── engagement.tsx
│   │   │   ├── travel-expense.tsx
│   │   │   ├── assets.tsx
│   │   │   ├── helpdesk.tsx
│   │   │   ├── compliance.tsx
│   │   │   ├── workflow.tsx
│   │   │   ├── analytics.tsx
│   │   │   ├── client-portal.tsx
│   │   │   ├── vendor-portal.tsx
│   │   │   ├── sub-vendor-portal.tsx
│   │   │   ├── job-portal.tsx
│   │   │   ├── ai-interview.tsx
│   │   │   ├── ai-chatbot.tsx
│   │   │   ├── alumni.tsx
│   │   │   ├── companies.tsx
│   │   │   ├── onboarding.tsx
│   │   │   └── settings.tsx
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── types.ts           # TypeScript types & constants
│   │   ├── mock-data.ts       # Demo data
│   │   ├── utils.ts
│   │   └── db.ts
│   └── store/
│       └── app-store.ts       # Zustand global state
└── package.json
```

---

## 🌐 Deployment on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Configure environment variables:
   - `DATABASE_URL` — Your database connection string
5. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/nexus-hrms)

---

## 📋 SaaS Pricing Model

| Plan | Employees | Features |
|------|-----------|----------|
| **Starter** | Up to 100 | Basic HRMS, Attendance, Payroll, ESS |
| **Professional** | Up to 500 | + Recruitment, PMS, LMS, AI Assistant, Analytics |
| **Enterprise** | Up to 5,000 | + Multi-company, AI Workflows, API Integrations, White-label |
| **Global Enterprise** | Unlimited | + Multi-country payroll, Dedicated infra, Advanced governance |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🏢 About

Built with ❤️ using Next.js, TypeScript, and AI. NEXUS HRMS is designed to manage the complete employee lifecycle from workforce planning to alumni management, supporting organizations from 50 to 500,000+ employees.
