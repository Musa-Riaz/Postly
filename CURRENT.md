# Postly: Social Media Scheduling Platform

Postly is a modern, full-stack social media scheduling platform designed to simplify multi-platform content management. It features a unique Neo-brutalism design and a robust, profile-centric architecture.

## 🚀 Accomplishments So Far

### 1. Core Platform Architecture
- **Full-Stack Foundation**: Established a robust monorepo-style structure with a Next.js (App Router) frontend and an Express.js/TypeScript backend.
- **Modern UI/UX**: Implemented a "Neo-brutalism" design system using Tailwind CSS, featuring bold borders, high-contrast colors, and sharp interactive components.
- **Database Layer**: Configured Prisma ORM with PostgreSQL (Supabase) for structured data management, including models for Users, Social Accounts, and Posts.

### 2. Zernio API Integration
We have implemented a seamless, unified integration for 15+ social platforms via the Zernio SDK.
- **Just-in-Time (JIT) Provisioning**: Automatic creation of Zernio profiles for users when they first connect an account, minimizing infrastructure overhead.
- **Idempotent Sync Flow**: A robust callback system that fetches and synchronizes all connected social accounts, ensuring data consistency and preventing duplicates.
- **Custom SDK Wrapper**: A specialized `ZernioClient` infrastructure layer that abstracts SDK complexities and provides a clean interface for the domain logic.

### 3. Account Management
- **Unified Connection Interface**: A single flow to connect accounts from LinkedIn, Instagram, Facebook, Twitter, and more.
- **Account Synchronizer**: Backend logic that maps Zernio's platform-agnostic account data into Postly's local entities (id, handle, avatar, status).
- **Dashboard Integration**: A fully functional accounts management dashboard for viewing and disconnecting social profiles.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [GSAP](https://greensock.com/gsap/)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Design Style**: Neo-brutalism

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via Supabase)
- **Integrations**: [@zernio/node](https://zernio.com) (Official SDK)

---

## 📂 Project Structure

```text
postly/
├── client/           # Next.js Application
│   ├── app/          # App Router (Routes & Pages)
│   ├── components/   # React Components
│   └── src/hooks/    # Custom React Query hooks
├── server/           # Express API
│   ├── src/
│   │   ├── domains/        # Feature modules (accounts, posts, etc.)
│   │   ├── infrastructure/ # External SDKs & Database clients
│   │   └── shared/         # Common utilities & Middlewares
│   └── prisma/             # Schema & Migrations
└── README.md         # You are here
```

---

## ⚙️ Environment Setup

To run the project locally, ensure the following keys are set in your `.env` files:

### Backend (`server/.env`)
```env
DATABASE_URL=
DIRECT_DATABASE_URL=
ZERNIO_API_KEY=
SUPABASE_JWT_SECRET=
```

### Frontend (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🔮 Roadmap
- [ ] **Content Composer**: Rich text and media editor for multi-platform posts.
- [ ] **Post Scheduling**: Integration with Trigger.dev for reliable delivery.
- [ ] **Unified Analytics**: Aggregated engagement data across all connected platforms.
- [ ] **AI Assistance**: Automated caption generation and optimal timing suggestions.
