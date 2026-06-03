# Milestone 3 Breakdown: Post Scheduling & Publishing (Zernio-First)

Milestone 3 focuses on the core value proposition of Postly: the ability to schedule posts for future delivery across multiple social platforms using Zernio's native scheduling capabilities.

## 1. Scheduling Logic (Backend)
- **Zernio Native Scheduling**: Leverages Zernio's `scheduledFor` property in the `createPost` API call.
- **Schedule Endpoint**: `POST /api/posts/:id/schedule`
  - Validates the scheduled date.
  - Updates post status to `SCHEDULED`.
  - Calls Zernio `posts.createPost` with `scheduledFor` timestamp.
- **Publish Endpoint**: `POST /api/posts/:id/publish`
  - Publishes the post immediately via Zernio SDK (omitting `scheduledFor`).
  - Updates post status to `PUBLISHED` or `FAILED`.

## 2. Webhook Integration
- **Status Sync**: Implement a webhook receiver to handle Zernio events:
  - `post.published`: Update local post status to `PUBLISHED`.
  - `post.failed`: Update local post status to `FAILED`.
- **Security**: Verify Zernio webhook signatures to ensure authenticity.

## 3. Scheduling UI (Frontend)
- **Schedule Modal**:
  - Integration with a date/time picker (shadcn/ui calendar + time input).
  - Timezone selection support (local by default).
- **Composer Integration**: "Schedule" button that opens the modal and calls the schedule API.

## 4. Post Management Views
- **Calendar View**:
  - Uses `FullCalendar` to display all scheduled posts.
  - Users can click on a post to see details or reschedule.
- **Queue View**:
  - A chronological list of upcoming posts.
  - Quick actions to edit, reschedule, or delete.

## 5. Post Lifecycle & Status
- **Status Transitions**: `DRAFT` -> `SCHEDULED` -> `PUBLISHED` / `FAILED`.
- **Real-time Updates**: Use Supabase Realtime to update the UI when a post is published via a webhook trigger.

---

## Technical Tasks

### Backend
- [ ] Add `publishPost` (with scheduling support) to `ZernioClient`.
- [ ] Create `server/src/domains/posts/post.publisher.ts` to coordinate Zernio calls.
- [ ] Implement `POST /api/posts/:id/schedule` and `POST /api/posts/:id/publish` routes.
- [ ] Setup `POST /api/webhooks/zernio` endpoint for status synchronization.

### Frontend
- [ ] Install `@fullcalendar/react`, `@fullcalendar/daygrid`, `@fullcalendar/timegrid`, `@fullcalendar/interaction`.
- [ ] Build the `ScheduleModal` component in the Composer.
- [ ] Build the `CalendarView` page in `app/(auth)/dashboard/schedule/page.tsx`.
- [ ] Build the `QueueView` component for upcoming posts.
