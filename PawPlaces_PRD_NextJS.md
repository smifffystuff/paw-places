
# PawPlaces – Product Requirements Document (PRD)
**Version:** Web-first (Mobile-First UX) • **Framework:** Next.js 14+ (App Router) • **Hosting:** Vercel • **Auth:** Clerk • **DB:** MongoDB • **LLM:** OpenAI/Ollama (local dev)

---

## Overview
**PawPlaces** is a social, mobile-first web app where people discover, review, and share **pet‑friendly places** (cafés, pubs, parks, beaches, hotels, shops). Users can add new places, post pet photos tied to locations, and follow friends. The app will be built with **Next.js (App Router)** using **Route Handlers** and **Server Actions** for backend logic, deployed on **Vercel** for global performance.

---

## Goals
- Make it effortless to **find and add** pet-friendly places in any city.
- Build an engaging **social feed** around pets at places (photos, captions, likes, comments).
- Leverage **LLMs** to auto-suggest place descriptions and summarize reviews.
- Ship a fast, SEO-friendly PWA that feels native on mobile.

---

## Target Users
- Pet owners looking for dog/cat-friendly spots nearby.
- Travellers seeking pet-friendly cafés, parks, hotels.
- Local pet communities who like sharing and discovering places.

---

## Scope & Non-Goals (MVP)
**In scope (MVP):**
- Mobile-first responsive web app with PWA install.
- Map + list discovery, add place, reviews, posts with photos, likes & comments.
- Basic gamification (points & badges).
- LLM-assisted descriptions and review summaries.
- Authentication and organization-lite (optional) via Clerk.

**Out of scope (MVP):**
- DMs, events, advanced moderation tooling (beyond basic reporting).
- Complex offline data sync (basic PWA cache only).
- Native mobile apps.

---

## Architecture Decision: Server Functions vs Separate API
**Decision:** Start with **Next.js Route Handlers + Server Actions**; no separate API service for MVP.

**Why this works now**
- Fewer moving parts, faster shipping.
- Great DX with shared types, co-located data fetching, and RSC.
- Vercel provides global edge caching, image optimization, ISR.
- Clerk integrates directly with Next.js middleware and server components.

**Caveats & When to split later**
- **Long-running jobs** (LLM pipelines, image processing): move to **Vercel Queues/Crons** or a worker (Inngest/Trigger.dev/Upstash QStash/Bull on a worker dyno).
- **WebSockets** (live chat): use Pusher/Ably/Supabase Realtime or a separate Node service.
- **Vendor limits**: Vercel serverless timeouts (generally 10–60s). For heavy tasks, offload to a queue and return 202.
- **Multi-team APIs** or external consumers: expose a separate versioned API later.

---

## Functional Requirements (MVP)
### Authentication & Onboarding
- Clerk-based auth (email/OTP, Google, Apple).
- Profile setup: username, avatar, short bio.
- Optional **Pet Profiles**: name, species, breed, photo.

### Explore (Places)
- Map (Mapbox/MapLibre) + list view, mobile-first.
- Filters: category (café, park, hotel, pub, shop) & tags (dog-friendly, cat-friendly, water bowls, outdoor seating).
- Sort by distance, rating, recency.

### Place Details
- Photos, description, tags, open hours (if provided).
- **LLM summary** of reviews (badges like "🐾 Very dog-friendly").
- Reviews list and rating.

### Add a Place
- Name, category, address search or GPS pin, tags, description.
- Photo upload (drag & drop / mobile picker).
- **LLM auto-suggested description** (editable before save).

### Reviews & Ratings
- Text + photos, 1–5 stars.
- Anti-spam: min account age or past activity threshold; rate limiting.

### Social Feed
- Posts (photo + caption + optional place).
- Likes & comments.
- Follow users; see friends’ activity.

### Profiles
- User profile with posts, reviews, places added.
- Pet profiles listed on the user page.
- Badges & points visible.

### Gamification
- Points for adding places/reviews/photos.
- Badges (Trailblazer, Reviewer, Top Dog Walker, Weekly Explorer).
- Local leaderboard (by city/region).

### Moderation
- Report content (place, post, review).
- Admin dashboard (rudimentary) for reviewing reports & hiding content.

---

## Non-Functional Requirements
- **Performance:** Core Web Vitals green; image optimization via next/image.
- **SEO:** ISR for place pages; structured data (LocalBusiness); OG images.
- **Security:** Clerk session validation on server; input validation with Zod.
- **Accessibility:** WCAG AA; keyboard and screen reader support.
- **Analytics & Telemetry:** Vercel Analytics, PostHog (events), logs via Vercel + Sentry.
- **Privacy:** GDPR-ready; clear photo/location consent in onboarding.
- **Internationalization:** en-GB initially; framework ready for i18n.

---

## Tech Stack
- **Web:** Next.js 14+ (App Router, RSC), TypeScript, TailwindCSS.
- **Auth:** Clerk (middleware, server components, webhooks).
- **Data:** MongoDB Atlas (Mongoose or official driver + Zod schemas).
- **Storage:** S3/Cloudinary or Vercel Blob for images; thumbnails via next/image.
- **LLM:** OpenAI/Anthropic (server-side; no keys on client), streaming text where helpful.
- **Maps:** Mapbox GL JS or MapLibre GL + MapTiler tiles.
- **Queue/Jobs:** Vercel Queues + Cron (or Inngest/Trigger.dev) for LLM summaries & heavy work.
- **Realtime:** Pusher/Ably (likes/comments updates) — optional in MVP.
- **Rate Limits:** Upstash Redis (per-IP and per-user).

---

## Data Model (MongoDB)
```ts
User: { _id, clerkId, username, name, avatarUrl, bio, city, pets: [petId], points, badges: [badgeKey], createdAt }
Pet: { _id, userId, name, species, breed, photoUrl, createdAt }
Place: { _id, name, category, location: { type: 'Point', coordinates: [lng, lat] }, address, tags: [string],
         photos: [url], addedBy, ratingAvg, ratingCount, createdAt, updatedAt, slug }
Review: { _id, placeId, userId, rating, text, photos: [url], createdAt }
Post: { _id, userId, placeId?, photoUrl, caption, likeCount, commentCount, createdAt }
Comment: { _id, postId, userId, text, createdAt }
Like: { _id, postId, userId, createdAt }
Report: { _id, targetType: 'place'|'post'|'review', targetId, reporterId, reason, status, createdAt }
LLMSummary: { _id, placeId, summary, badges: [string], model, createdAt }
```
**Indexes**
- `Place.location` (2dsphere), `Place.slug`, `Review.placeId`, `Post.placeId`, `Post.userId`, `Like.postId+userId (unique)`.

---

## Routes & Server Functions
### App Pages (App Router)
- `/` – Explore (map + list), SSR with user location prompt.
- `/place/[slug]` – Place details (ISR with revalidate on review add).
- `/add-place` – Client form + server action to create.
- `/feed` – Social feed (SSR + pagination).
- `/u/[username]` – Profile (SSR/ISR).
- `/auth/*` – Clerk routes.

### Route Handlers (API-ish)
- `POST /api/place` – createPlace (Server Action friendly).
- `GET /api/place?near=lng,lat&radius=km&filters=…` – searchPlaces.
- `POST /api/review` – createReview (triggers summary job).
- `POST /api/post` – createPost (image upload finalize).
- `POST /api/like` – toggleLike.
- `POST /api/report` – reportContent.
- `POST /api/webhooks/clerk` – user created/updated.
- `POST /api/jobs/summary` – (queue worker endpoint) generate/update LLMSummary.

> **Note:** Prefer Server Actions for mutations originating from React forms; keep a thin Route Handler layer for webhooks, file uploads, queues, and public endpoints.

---

## LLM Usage
- **Place description suggestions** on create/edit.
- **Review aggregation** to summary + badges (idempotent job after new reviews).
- **Content safety**: classify NSFW/inappropriate photos/captions (heuristic + model).

**Guardrails**
- Cite counts rather than facts; avoid hallucinated policies.
- Job runs only over existing reviews for that place.
- Store model + prompt version for traceability.

---

## File Uploads
- Use **UploadThing** or **Vercel Blob** for direct-to-storage uploads.
- Validate MIME/type and dimension limits server-side.
- Generate responsive sizes; serve via next/image with remotePatterns.

---

## Gamification Logic
- Points: +5 add place, +3 review, +1 like received, caps per day.
- Badges unlocked based on thresholds; computed nightly via cron job.
- City/local leaderboards recomputed daily (cached).

---

## Security & Compliance
- All mutations require authenticated Clerk session (server-side verification).
- Zod validation for all inputs; sanitize HTML (DOMPurify) where needed.
- Rate limit sensitive endpoints (Upstash).
- Image moderation step on upload (async; content hidden until cleared if flagged).
- GDPR: data export/delete endpoints; privacy policy & TOS.

---

## Analytics & Metrics
- **Product**: DAU/WAU, new places/day, reviews/place, time-to-first-contribution, retention D30.
- **Content**: % of places with photos, avg rating distribution, abusive content rate.
- **Tech**: p95 API latency, queue times, LLM cost/use per day.

---

## SEO
- Place pages: title/description from LLM-edited copy (reviewed), schema.org `Place/LocalBusiness`, canonical URLs, OG images.
- City/category landing pages generated with ISR for crawlability.
- XML sitemap regenerated nightly.

---

## Roadmap
1. **MVP (6–8 weeks):**
   - Auth, profiles, map/list explore, add place (+LLM suggest), reviews, posts, likes, comments.
   - ISR place pages, basic badges/points, report content.
2. **Phase 2:**
   - LLM review summaries & badges, leaderboards, image moderation pipeline, simple admin.
3. **Phase 3:**
   - Events/meetups, realtime updates, premium tier (ad-free, offline lists), sponsored listings.

---

## Risks & Mitigation
- **Cold start/timeout on LLM jobs** → offload to Queue + background worker.
- **Low data density** → seed with public datasets/partner lists; city launch strategy.
- **Abuse/spam** → rate limits + moderation + require verified email/social sign-in.
- **Map costs** → use MapLibre + MapTiler tiers; cache tiles where possible.
- **SEO content quality** → human-edit prompts; avoid unreviewed auto content.

---

## Summary
We will build **PawPlaces** as a **mobile-first Next.js app** on **Vercel**, using **Route Handlers & Server Actions** (no separate API for MVP). Heavy/background tasks go through queues. This keeps architecture simple early, with a clear path to split services if/when scale or features demand it.
