# Postly — Project Context

> **Postly** is an AI-powered, multi-platform social media management SaaS. It lets individuals, creators, and agencies connect their social accounts, generate content using an in-app AI chat, schedule posts across platforms, and view unified analytics — all from a single dashboard.

---

## 1. Application Name

**Postly**

Clean, memorable, verb-rooted. Implies posting + productivity. Easy to brand.

---

## 2. Vision Statement

Give creators and marketers one place to think, write, schedule, and measure — powered by AI at every step.

---

## 3. Scope of the Application

### 3.1 Core Features

| Feature | Description |
|---|---|
| **Account Management** | Connect, manage, and disconnect social media accounts via Zernio OAuth |
| **AI Content Chat** | ChatGPT-style window powered by Gemini API. Users describe what they want; AI generates caption, hashtags, and optionally an image prompt |
| **Post Composer** | Rich post editor with per-platform previews (how the post looks on Instagram vs LinkedIn vs X) |
| **Post Scheduler** | Calendar + queue view. Schedule posts immediately or at a future date/time with timezone support |
| **Analytics Dashboard** | Unified view of post performance (impressions, likes, comments, shares, reach) and account-level stats (followers, follower growth, profile views) |

### 3.2 Supported Platforms (via Zernio)

- Instagram (Business/Creator)
- LinkedIn
- X / Twitter
- Facebook
- TikTok
- Threads
- Pinterest
- YouTube (basic)

### 3.3 Out of Scope (v1)

- Mobile app (web-only)
- Paid ads management
- Team collaboration / multi-user workspaces
- White-labelling
- Direct messaging / inbox management

---

## 4. Tech Stack

### Frontend
| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR, API routes, file-based routing |
| Styling | Tailwind CSS + Shadcn/ui | Base utility layer; extended with neobrutalism tokens |
| Design System | Neobrutalism | Bold borders, flat shadows, high-contrast palette throughout all UI |
| Animations | GSAP (GreenSock) | Landing page animations: scroll-triggered reveals, staggered text, hero transitions |
| State | Zustand | Lightweight global state |
| Data fetching | TanStack Query (React Query) | Server state, caching, invalidation |
| Forms | React Hook Form + Zod | Type-safe form validation |
| Charts | Recharts | Analytics dashboard visualisations |
| Calendar | FullCalendar (React) | Post scheduling calendar view |

### Backend
| Layer | Choice | Reason |
|---|---|---|
| Runtime | Node.js (Express) | Custom REST API, full control |
| Language | TypeScript | End-to-end type safety |
| ORM | Prisma | Type-safe DB queries, migrations |
| Database | Supabase (PostgreSQL) | Single database; handles relational data + real-time subscriptions + file storage |
| Auth | Supabase Auth | Native JWT + RLS integration; OAuth providers built-in; no separate service |
| Job Scheduler | Trigger.dev | Cron jobs to fire scheduled posts |
| File Storage | Cloudflare R2 | Media uploads (images/videos) |

### Integrations
| Integration | Purpose |
|---|---|
| Zernio API | Unified social media posting, scheduling, and analytics |
| Gemini API (Google) | In-app AI chat for content generation |
| Cloudflare R2 | Image/video storage |

---

## 5. Architecture — Domain-Driven Design (DDD)

Postly follows DDD principles. The application is split into bounded contexts, each with its own domain logic, repository, and service layer. The Express backend exposes REST endpoints that orchestrate domain services.

### 5.1 Bounded Contexts

```
postly/
├── apps/
│   ├── web/                        # Next.js 14 frontend
│   └── api/                        # Express backend
│
├── packages/
│   ├── shared/                     # Shared types, Zod schemas, constants
│   └── config/                     # Shared ESLint, TS configs
```

### 5.2 Backend Domain Structure (`apps/api/src/`)

```
src/
├── domains/
│   │
│   ├── auth/                        # Bounded Context: Identity & Auth
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.routes.ts
│   │
│   ├── accounts/                    # Bounded Context: Social Accounts
│   │   ├── account.entity.ts        # Domain entity
│   │   ├── account.repository.ts    # DB access via Prisma
│   │   ├── account.service.ts       # Business logic
│   │   ├── account.controller.ts    # HTTP handlers
│   │   ├── account.routes.ts
│   │   └── account.zernio.ts        # Zernio OAuth adapter
│   │
│   ├── posts/                       # Bounded Context: Post Management
│   │   ├── post.entity.ts
│   │   ├── post.repository.ts
│   │   ├── post.service.ts
│   │   ├── post.controller.ts
│   │   ├── post.routes.ts
│   │   └── post.publisher.ts        # Zernio publish adapter
│   │
│   ├── scheduler/                   # Bounded Context: Post Scheduling
│   │   ├── scheduler.service.ts     # Creates Trigger.dev jobs
│   │   ├── scheduler.controller.ts
│   │   └── scheduler.routes.ts
│   │
│   ├── ai/                          # Bounded Context: AI Content Generation
│   │   ├── ai.service.ts            # Gemini API integration
│   │   ├── ai.controller.ts
│   │   └── ai.routes.ts
│   │
│   └── analytics/                   # Bounded Context: Analytics & Insights
│       ├── analytics.service.ts     # Pulls data from Zernio + caches in DB
│       ├── analytics.repository.ts
│       ├── analytics.controller.ts
│       └── analytics.routes.ts
│
├── infrastructure/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── zernio/
│   │   └── zernio.client.ts         # Shared Zernio API client wrapper
│   ├── gemini/
│   │   └── gemini.client.ts         # Gemini API client
│   ├── r2/
│   │   └── r2.client.ts             # Cloudflare R2 upload client
│   └── trigger/
│       └── trigger.client.ts        # Trigger.dev job definitions
│
├── shared/
│   ├── middleware/
│   │   ├── auth.middleware.ts       # Clerk JWT verification
│   │   ├── error.middleware.ts      # Global error handler
│   │   └── validate.middleware.ts   # Zod request validation
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── index.ts
│
├── app.ts                           # Express app setup
└── server.ts                        # Entry point
```

### 5.3 Frontend Structure (`apps/web/src/`)

```
src/
├── app/                             # Next.js App Router
│   ├── (auth)/
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx               # Sidebar + nav shell
│   │   ├── page.tsx                 # Dashboard home (analytics overview)
│   │   ├── accounts/
│   │   │   └── page.tsx             # Connected accounts management
│   │   ├── compose/
│   │   │   └── page.tsx             # Post composer + AI chat panel
│   │   ├── schedule/
│   │   │   └── page.tsx             # Calendar + queue view
│   │   └── analytics/
│   │       └── page.tsx             # Detailed analytics
│   └── api/                         # Next.js API routes (thin — proxies to Express)
│
├── components/
│   ├── ui/                          # Shadcn/ui base components
│   ├── layout/                      # Sidebar, Topbar, PageShell
│   ├── accounts/                    # AccountCard, ConnectButton, PlatformBadge
│   ├── composer/                    # PostEditor, PlatformPreview, MediaUpload
│   ├── ai-chat/                     # ChatWindow, MessageBubble, PromptInput
│   ├── scheduler/                   # CalendarView, PostQueue, ScheduleModal
│   └── analytics/                   # StatsCard, EngagementChart, FollowerGraph
│
├── domains/                         # Frontend domain logic (mirrors backend DDD)
│   ├── accounts/
│   │   ├── accounts.api.ts          # API call functions (via TanStack Query)
│   │   └── accounts.types.ts
│   ├── posts/
│   │   ├── posts.api.ts
│   │   └── posts.types.ts
│   ├── ai/
│   │   ├── ai.api.ts
│   │   └── ai.types.ts
│   └── analytics/
│       ├── analytics.api.ts
│       └── analytics.types.ts
│
├── store/                           # Zustand global state slices
│   ├── composer.store.ts
│   └── ui.store.ts
│
├── hooks/                           # Custom React hooks
│   ├── useAccounts.ts
│   ├── usePosts.ts
│   └── useAnalytics.ts
│
└── lib/
    ├── api-client.ts                # Axios instance with auth headers
    └── utils.ts
```

---

## 6. Database Schema (Prisma — High Level)

```prisma
model User {
  id            String          @id               // Clerk user ID
  email         String          @unique
  accounts      SocialAccount[]
  posts         Post[]
  createdAt     DateTime        @default(now())
}

model SocialAccount {
  id            String    @id   @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  platform      String                             // instagram | linkedin | twitter | ...
  zernioId      String                             // Zernio connected account ID
  handle        String
  displayName   String
  avatarUrl     String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  posts         Post[]
  analytics     AccountAnalytics[]
}

model Post {
  id              String        @id @default(cuid())
  userId          String
  user            User          @relation(fields: [userId], references: [id])
  accounts        SocialAccount[]
  content         String
  mediaUrls       String[]
  status          PostStatus    @default(DRAFT)    // DRAFT | SCHEDULED | PUBLISHED | FAILED
  scheduledAt     DateTime?
  publishedAt     DateTime?
  zernioPostId    String?                          // Returned by Zernio after publish
  triggerJobId    String?                          // Trigger.dev job reference
  analytics       PostAnalytics?
  createdAt       DateTime      @default(now())
}

model PostAnalytics {
  id            String    @id @default(cuid())
  postId        String    @unique
  post          Post      @relation(fields: [postId], references: [id])
  impressions   Int       @default(0)
  likes         Int       @default(0)
  comments      Int       @default(0)
  shares        Int       @default(0)
  reach         Int       @default(0)
  lastFetchedAt DateTime  @default(now())
}

model AccountAnalytics {
  id              String        @id @default(cuid())
  accountId       String
  account         SocialAccount @relation(fields: [accountId], references: [id])
  followers       Int
  followingCount  Int
  profileViews    Int
  recordedAt      DateTime      @default(now())
}
```

---

## 7. API Routes (Express)

```
Auth
  POST   /api/auth/callback              # Supabase Auth callback — handle OAuth redirects

Social Accounts
  GET    /api/accounts                  # List connected accounts
  POST   /api/accounts/connect          # Initiate Zernio OAuth
  DELETE /api/accounts/:id              # Disconnect account

Posts
  GET    /api/posts                     # List posts (with filters: status, platform)
  POST   /api/posts                     # Create draft post
  PUT    /api/posts/:id                 # Update post
  DELETE /api/posts/:id                 # Delete post
  POST   /api/posts/:id/publish         # Publish immediately via Zernio
  POST   /api/posts/:id/schedule        # Schedule post (creates Trigger.dev job)

AI
  POST   /api/ai/chat                   # Stream Gemini response for content generation
  POST   /api/ai/generate-image-prompt  # Generate image description from post content

Analytics
  GET    /api/analytics/posts           # Post-level analytics (all posts)
  GET    /api/analytics/posts/:id       # Single post analytics
  GET    /api/analytics/accounts        # Account-level stats for all connected accounts
  POST   /api/analytics/sync            # Manually trigger analytics pull from Zernio
```

---

## 8. Milestones

### Milestone 0 — Project Setup & Infrastructure
- Monorepo setup (Turborepo)
- Next.js 14 app scaffolded with Tailwind + Shadcn/ui
- Express API scaffolded with TypeScript
- Prisma + Neon PostgreSQL connected and initial schema migrated
- Supabase Auth configured (email/password + Google OAuth provider)
- Supabase Auth middleware in Next.js (`middleware.ts`) protecting dashboard routes
- Express JWT middleware verifying Supabase access tokens via `SUPABASE_JWT_SECRET`
- RLS policies created on all tables (`user_id = auth.uid()`)
- Zernio API client wrapper created
- Gemini API client created
- Cloudflare R2 client created
- Trigger.dev project initialised
- Environment variables documented (.env.example)
- CI: ESLint + TypeScript checks passing

---

### Milestone 1 — Social Account Connection
- Zernio OAuth flow: connect account → store `zernioId` in DB
- `/api/accounts` CRUD endpoints
- Accounts page UI: list connected accounts with platform icon, handle, and status
- Connect button per platform (Instagram, LinkedIn, X, Facebook, TikTok)
- Disconnect with confirmation modal
- Error handling for failed OAuth

---

### Milestone 2 — AI Chat & Post Composer
- Gemini streaming chat endpoint (`/api/ai/chat`)
- AI Chat window component: message history, streaming responses, prompt input
- System prompt engineering: Gemini acts as a social media content expert
- User can describe a post → AI returns caption + hashtags
- Post Composer: rich text editor, platform selector (multi-select), media upload to R2
- Per-platform character limit enforcement (280 X, 3000 LinkedIn, etc.)
- Per-platform preview panel (live preview as user types)
- Save as Draft

---

### Milestone 3 — Post Scheduling & Publishing
- Schedule modal: date/time picker with timezone support
- `POST /api/posts/:id/schedule` → creates Trigger.dev delayed job
- Trigger.dev job fires at scheduled time → calls Zernio publish endpoint
- `POST /api/posts/:id/publish` → publishes immediately via Zernio
- Post status lifecycle: DRAFT → SCHEDULED → PUBLISHED / FAILED
- Calendar view (FullCalendar): all scheduled posts visualised
- Queue list view: upcoming posts ordered by scheduled time
- Reschedule and cancel from calendar/queue
- Retry on failed posts

---

### Milestone 4 — Analytics Dashboard
- Zernio analytics pull: post impressions, likes, comments, shares, reach
- Account-level stats pull: followers, following, profile views
- Cron job (Trigger.dev): pull and cache analytics every 6 hours
- Dashboard home: summary cards (total posts, total reach, total engagement)
- Post analytics table: sortable by platform, date, engagement
- Follower growth chart (Recharts line chart) — per account over time
- Engagement breakdown chart (bar chart) — likes / comments / shares per post
- Per-account stats panel on Accounts page
- Manual "Refresh Analytics" button

---

### Milestone 5 — Polish & Launch Readiness
- Responsive layout (mobile-friendly)
- Empty states for all pages (no accounts, no posts, no data)
- Loading skeletons throughout
- Global error boundary + toast notifications
- Onboarding flow for new users (connect first account → create first post)
- Rate limit handling + retry logic for Zernio and Gemini
- README with setup instructions, architecture overview, and screenshots
- Deploy: Vercel (Next.js) + Railway or Render (Express API) + Neon (DB)

---

## 9. Environment Variables

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Database + Auth (Supabase)
DATABASE_URL=                          # Supabase PostgreSQL pooled connection (port 6543) — Prisma runtime
DIRECT_DATABASE_URL=                   # Supabase PostgreSQL direct connection (port 5432) — Prisma migrations
NEXT_PUBLIC_SUPABASE_URL=              # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=         # Supabase anon key (client-safe, auth + realtime)
SUPABASE_SERVICE_ROLE_KEY=             # Supabase service role key (server only — bypasses RLS)

# Zernio
ZERNIO_API_KEY=

# Gemini
GEMINI_API_KEY=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# Trigger.dev
TRIGGER_API_KEY=
TRIGGER_API_URL=

# App
NEXT_PUBLIC_API_URL=                   # Express API base URL
NODE_ENV=development
```

---

## 10. SOLID Principles — Applied to Postly

Every bounded context in the backend must adhere to SOLID. Below is how each principle maps concretely to the codebase.

### S — Single Responsibility Principle
Each class/module does exactly one thing. The layers within each domain enforce this:

```
account.entity.ts       → defines shape and rules of a SocialAccount (nothing else)
account.repository.ts   → only talks to the database
account.service.ts      → only contains business logic, calls repository
account.controller.ts   → only handles HTTP req/res, calls service
account.zernio.ts       → only wraps Zernio API calls for accounts
```

No service touches the DB directly. No controller contains business logic.

### O — Open/Closed Principle
Extend behaviour without modifying existing code. The publisher and analytics systems use a strategy pattern so new platforms can be added without touching existing code:

```typescript
// post.publisher.ts
interface IPublisher {
  publish(post: Post, account: SocialAccount): Promise<string>
}

class ZernioPublisher implements IPublisher { ... }
class MockPublisher implements IPublisher { ... }   // used in tests

// Adding a new publisher never modifies IPublisher or ZernioPublisher
```

### L — Liskov Substitution Principle
Any implementation of an interface must be swappable without breaking callers. All repositories implement a base interface:

```typescript
// shared/interfaces/repository.interface.ts
interface IRepository<T> {
  findById(id: string): Promise<T | null>
  findAll(filters?: object): Promise<T[]>
  save(entity: T): Promise<T>
  delete(id: string): Promise<void>
}

class PostRepository implements IRepository<Post> { ... }
// PostRepository can be swapped for MockPostRepository in tests without changing PostService
```

### I — Interface Segregation Principle
No class is forced to implement methods it doesn't need. Interfaces are kept narrow and role-specific:

```typescript
// analytics does not implement the full repository interface
interface IAnalyticsReader {
  getPostAnalytics(postId: string): Promise<PostAnalytics>
  getAccountAnalytics(accountId: string): Promise<AccountAnalytics[]>
}

interface IAnalyticsWriter {
  savePostAnalytics(data: PostAnalytics): Promise<void>
  saveAccountAnalytics(data: AccountAnalytics): Promise<void>
}

// The sync job only depends on IAnalyticsWriter — it never needs to read
// The dashboard only depends on IAnalyticsReader — it never needs to write
```

### D — Dependency Inversion Principle
High-level modules depend on abstractions, not on concrete implementations. Services receive their dependencies via constructor injection:

```typescript
// posts/post.service.ts
class PostService {
  constructor(
    private readonly postRepo: IRepository<Post>,
    private readonly publisher: IPublisher,
    private readonly scheduler: IScheduler,
  ) {}
}

// In the composition root (app.ts), concrete classes are wired up:
const postService = new PostService(
  new PostRepository(prisma),
  new ZernioPublisher(zernioClient),
  new TriggerScheduler(triggerClient),
)
```

This makes every service independently testable by injecting mocks.

---

## 11. Design System — Neobrutalism

All UI components follow a neobrutalist aesthetic. This is enforced via a shared Tailwind config and component conventions.

### Core Visual Rules

| Property | Rule |
|---|---|
| Borders | `border-2 border-black` on all interactive elements and cards |
| Shadows | `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]` — flat, hard, offset. No blur. |
| Border Radius | `rounded-none` by default. `rounded-sm` allowed sparingly |
| Typography | Bold weights (700–900) for headings. Mono font for code/labels |
| Colors | High contrast. Primary palette: black, white, and 2–3 loud accent colors |
| Hover States | Shadow shifts: `hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]` |
| Buttons | Filled with black border + hard shadow. Active state: shadow collapses to zero |

### Postly Color Palette

```css
--color-primary:   #FFE500;   /* Electric Yellow — primary CTAs */
--color-secondary: #FF6B6B;   /* Coral Red — destructive / alerts */
--color-accent:    #4ECDC4;   /* Teal — success / connected states */
--color-black:     #0A0A0A;
--color-white:     #FAFAFA;
--color-surface:   #F5F0E8;   /* Off-white — page background */
```

### Tailwind Extension (`tailwind.config.ts`)

```typescript
extend: {
  boxShadow: {
    'neo':       '4px 4px 0px 0px #0A0A0A',
    'neo-sm':    '2px 2px 0px 0px #0A0A0A',
    'neo-lg':    '6px 6px 0px 0px #0A0A0A',
    'neo-color': '4px 4px 0px 0px #FFE500',
  },
  fontFamily: {
    sans: ['Space Grotesk', 'sans-serif'],
    mono: ['Space Mono', 'monospace'],
  }
}
```

---

## 12. GSAP — Landing Page Animation Plan

GSAP is used **exclusively on the landing page** (`app/(marketing)/page.tsx`). Dashboard and app pages use CSS transitions only (performance).

### Animation Sections

| Section | Animation |
|---|---|
| **Hero** | Staggered text reveal: headline words slide up from `y: 60` with opacity 0→1, `stagger: 0.08s`. Logo mark does a `rotation: 360` on load |
| **Feature Cards** | ScrollTrigger: cards animate in from `y: 80, opacity: 0` as user scrolls into view, staggered left to right |
| **Platform Logos** | Horizontal marquee loop using GSAP `to()` with `repeat: -1` and `ease: none` |
| **Stats Section** | Number counters: `0 → actual value` animated over 1.5s using GSAP ticker when scrolled into view |
| **AI Chat Demo** | Fake typewriter effect: messages appear character by character using GSAP `TextPlugin` |
| **CTA Section** | Background color shift on scroll using `ScrollTrigger` + `backgroundColor` tween |

### GSAP Setup (`lib/gsap.ts`)

```typescript
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin)
}

export { gsap, ScrollTrigger }
```

All animation logic lives in custom hooks (`hooks/useHeroAnimation.ts`, `hooks/useScrollReveal.ts`) — never inline in JSX. Every animation cleans up via `gsap.context()` and `ctx.revert()` in `useEffect` return.

---

## 13. Database Architecture — Supabase

Supabase is the single database for Postly. It provides everything in one place: PostgreSQL for relational data, Realtime for WebSocket broadcasts, and Row Level Security for per-user data isolation.

### What Supabase Handles

| Capability | Usage in Postly |
|---|---|
| **Auth** | Email/password + Google OAuth. JWTs issued by Supabase, verified in Express middleware |
| **PostgreSQL** | All relational data — users, social accounts, posts, analytics snapshots |
| **Realtime** | Broadcast post status changes (`SCHEDULED → PUBLISHED`) and analytics refresh events to the frontend instantly |
| **Row Level Security (RLS)** | Enforced at the DB level — `auth.uid()` automatically scopes all queries to the logged-in user |

### Prisma Config

```prisma
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")         // Supabase pooled connection (port 6543)
  directUrl = env("DIRECT_DATABASE_URL")  // Supabase direct connection (port 5432) — used for migrations
}
```

> **Note:** Supabase requires two connection strings — the pooled URL (via PgBouncer, port 6543) for runtime queries, and the direct URL (port 5432) for Prisma migrations. Both are available in your Supabase project dashboard under Settings → Database.

### Supabase Realtime Usage (Frontend)

```typescript
// hooks/usePostStatus.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// When Trigger.dev publishes a post, the API broadcasts this event
// The frontend listens and invalidates the posts query — no polling needed
supabase
  .channel('post-status')
  .on('broadcast', { event: 'post.published' }, () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  })
  .subscribe()
```

---

## 14. Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Separate Express backend | Yes | DDD is cleaner with a dedicated API server; not constrained by Next.js API route limitations |
| Zernio for all social APIs | Yes | Eliminates 5+ individual OAuth integrations; handles rate limits and token refresh |
| Gemini for AI chat | Yes | Strong multimodal capability, generous free tier, streaming support |
| Trigger.dev for scheduling | Yes | Serverless-friendly, built-in retry/failure handling, observable job runs |
| DDD architecture | Yes | Bounded contexts keep social accounts, posts, AI, and analytics fully decoupled |
| SOLID principles | Yes | Constructor injection, interface-driven repositories, strategy pattern for publishers |
| Monorepo (Turborepo) | Yes | Shared types between frontend and backend; single repo for portfolio showcase |
| Supabase Auth over Clerk | Yes | Native JWT + RLS integration; one less paid service; OAuth built-in; sessions automatically scope DB access |
| Neobrutalism UI | Yes | Distinctive, memorable aesthetic — stands out on Upwork portfolio immediately |
| GSAP on landing only | Yes | Heavy animation library kept off the dashboard; CSS transitions used inside the app |