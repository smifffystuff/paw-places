# 🐾 PawPlaces

A mobile-first social app for discovering, sharing, and reviewing pet-friendly places.

## Project Overview

PawPlaces helps pet owners easily find and share pet-friendly locations (cafés, pubs, parks, hotels, shops) while building a social community around pets, places, and experiences.

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn
- Expo CLI (for mobile development)
- Clerk account (for authentication)

### Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd PawPlaces
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and Clerk keys
   npm run dev
   ```

3. **Mobile Setup:**
   ```bash
   cd mobile
   npm install
   cp .env.example .env
   # Edit .env with your Clerk key and API URL
   npm start
   ```

## Project Structure

```
PawPlaces/
├── backend/              # Node.js + Fastify API
│   ├── src/
│   │   ├── db.js        # MongoDB connection
│   │   ├── index.js     # Server entry point
│   │   ├── middleware/  # Auth middleware
│   │   └── routes/      # API routes
│   └── package.json
├── mobile/              # React Native + Expo app
│   ├── app/            # Screens (Expo Router)
│   ├── lib/            # API client
│   └── package.json
└── PawPlaces_PRD.md    # Product Requirements Document
```

## Features (MVP)

### ✅ Implemented
- **Backend API:**
  - User profiles and pet management
  - Places CRUD with geospatial queries
  - Reviews and ratings
  - Social feed (posts, likes)
  - Clerk authentication

- **Mobile App:**
  - Welcome screen
  - Tab navigation (Explore, Feed, Add, Profile)
  - Browse places with category filters
  - Add new places
  - View social feed
  - User profile

### 🔄 Coming Soon
- Map view integration
- Image uploads (S3/Cloudinary)
- Place details and reviews UI
- Pet profile management
- Complete authentication flow
- Geolocation services
- LLM-generated descriptions

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Fastify
- **Database:** MongoDB with geospatial indexes
- **Auth:** Clerk
- **API:** RESTful

### Mobile
- **Framework:** React Native (Expo)
- **Routing:** Expo Router
- **Styling:** NativeWind (Tailwind CSS)
- **Auth:** Clerk Expo SDK
- **HTTP:** Axios

## API Endpoints

### Public
- `GET /health` - Health check
- `GET /places` - Get places (with filters)
- `GET /places/:id` - Get place details
- `GET /feed` - Get social feed

### Protected (requires auth)
- `POST /users/profile` - Update profile
- `POST /users/pets` - Add pet
- `POST /places` - Add place
- `POST /places/:id/reviews` - Add review
- `POST /posts` - Create post
- `POST /like/:postId` - Like post

## Development Workflow

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on `http://localhost:3000`

2. **Start Mobile:**
   ```bash
   cd mobile
   npm start
   ```
   Choose platform (iOS/Android) or scan QR with Expo Go

3. **Test API:**
   Use the health check endpoint:
   ```bash
   curl http://localhost:3000/health
   ```

## Environment Variables

### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/pawplaces
CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

### Mobile (.env)
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## Next Steps

1. **Database Setup:**
   - Create MongoDB indexes for geospatial queries
   - Seed with initial pet-friendly places

2. **Authentication:**
   - Configure Clerk dashboard
   - Implement sign-in/sign-up flows in mobile app

3. **Features:**
   - Add map view (Expo Maps)
   - Implement image uploads
   - Add reviews UI
   - Create pet profile screens

4. **Testing:**
   - Add unit tests
   - Integration tests for API
   - E2E tests for mobile

## Contributing

This is a learning/portfolio project. Feel free to:
- Report issues
- Suggest features
- Submit pull requests

## License

MIT

---

Built with ❤️ for pet lovers everywhere 🐾
