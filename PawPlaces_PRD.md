# PawPlaces – Product Requirements Document (PRD)

## Overview
**PawPlaces** is a mobile-first social app for discovering, sharing, and reviewing **pet‑friendly places** (cafés, pubs, parks, hotels, shops).  
Built with React Native + Expo, backed by a Node.js API with MongoDB, and authentication via Clerk.

The app combines **social features** (pet profiles, posts, likes, comments) with **local discovery** (map, list view, user-submitted places).

---

## Goals
- Help pet owners easily find and share pet-friendly locations.
- Build a social community around pets, places, and experiences.
- Encourage user-generated content to drive organic growth.

---

## Target Users
- Pet owners looking for dog/cat-friendly spots nearby.
- Travelers seeking pet-friendly accommodation or cafés.
- Communities of pet lovers who enjoy sharing their pets’ experiences.

---

## Core Features (MVP)
### Authentication & Onboarding
- Clerk integration (email, Google, Apple login).
- User profile setup with option to add **pet profiles** (name, species, breed, photo).

### Explore (Places)
- Map view (Expo Maps) + list view.
- Filters: categories (café, park, hotel, pub, shop).  
- Tags: “Dog-friendly”, “Cat-friendly”, “Water bowls”, “Outdoor seating”.

### Add a Place
- Add place name, category, description (auto-suggested by LLM).
- Upload photos.  
- GPS location or search by address.

### Reviews & Ratings
- Leave text reviews with photos.  
- Star rating (1–5).  
- LLM-generated summary badges (e.g., “🐾 Very dog-friendly”).

### Social Feed
- Posts by users (photo + caption + location).  
- Likes and comments.  
- Follow friends / see their activity.

### User & Pet Profiles
- Bio, avatar, pets listed.  
- Contributions: added places, reviews, posts.  
- Badges for milestones (e.g., “First Place Added”).

### Gamification
- Points system: add places, reviews, photos.  
- Badges: Trailblazer (first to add a place), Reviewer, Top Dog Walker.  
- Leaderboard for local communities.

---

## Nice-to-Haves (Phase 2)
- Offline mode (download nearby places).  
- Event creation (pet meetups, dog walks).  
- Direct messaging.  
- Premium tier: remove ads, priority place suggestions, exclusive badges.  
- Business sponsorship: promote pet-friendly hotels, cafés, shops.

---

## Tech Stack
**Frontend:** React Native (Expo), Expo Router, Expo Maps, NativeWind for styling.  
**Backend:** Node.js (Fastify), MongoDB, Clerk for auth, BullMQ + Redis for job queues.  
**Storage:** S3/Cloudinary for media uploads.  
**LLM Integration:** OpenAI/Anthropic to generate place descriptions and review summaries.

---

## Data Model (MongoDB)
```js
User: { _id, clerkId, name, avatarUrl, bio, pets: [petId] }
Pet: { _id, userId, name, species, breed, photoUrl }
Place: { _id, name, category, geo: { lat, lng }, tags: [], photos: [], addedBy }
Review: { _id, placeId, userId, text, rating, photos: [], createdAt }
Post: { _id, userId, placeId, photoUrl, caption, createdAt }
Like: { _id, postId, userId }
```

---

## API Endpoints
```
POST   /auth/clerk/verify         // verify Clerk JWT
POST   /places                    // add new place
GET    /places?near=lat,lng       // discover nearby places
POST   /places/:id/reviews        // add review
GET    /places/:id/reviews        // get reviews
POST   /posts                     // create a social post
GET    /feed                      // get posts from friends/nearby
POST   /like/:postId              // like a post
```

---

## Monetisation
- **Free Tier**: ads, standard features.  
- **Premium Subscription**: ad-free, save places offline, early access to features.  
- **Sponsored Listings**: pet-friendly businesses can promote themselves.  

---

## Success Metrics
- # of active users per week.  
- # of places added and reviewed.  
- Engagement rate (likes/comments per post).  
- Retention after 1 month.  

---

## Roadmap (MVP → Growth)
1. **MVP** (3 months): Auth, profiles, map/list explore, add place, reviews, feed, posts.  
2. **Phase 2**: Offline mode, gamification, badges, LLM summaries.  
3. **Phase 3**: Events, messaging, premium subscriptions, sponsored listings.

---

## Risks & Mitigation
- **Low initial data density**: Seed database with known pet-friendly locations.  
- **Spam/abuse**: Require verified login, report + moderation tools.  
- **Scaling**: Use CDN + caching for images, optimize Mongo queries with indexes.

---

## Summary
PawPlaces blends **social sharing** with **local discovery** to create the go-to community app for pet lovers.  
By leveraging Clerk for auth, MongoDB for flexible data storage, and LLMs for auto‑generated descriptions, it can deliver a delightful user experience while scaling globally.
