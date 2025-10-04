# PawPlaces Backend API

Node.js + Fastify + MongoDB backend for PawPlaces.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your MongoDB URI and Clerk API keys.

3. **Start MongoDB:**
   Make sure MongoDB is running locally or use a cloud instance (MongoDB Atlas).

4. **Run the server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000`

## API Endpoints

### Public Routes
- `GET /health` - Health check
- `GET /places` - Get nearby places (optional: `?near=lng,lat&category=cafe`)
- `GET /places/:id` - Get place details
- `GET /places/:id/reviews` - Get reviews for a place
- `GET /feed` - Get social feed posts
- `GET /users/:clerkId` - Get user profile

### Protected Routes (require Bearer token)
- `POST /users/profile` - Create/update user profile
- `POST /users/pets` - Add a pet
- `POST /places` - Add a new place
- `POST /places/:id/reviews` - Add a review
- `POST /posts` - Create a post
- `POST /like/:postId` - Like a post
- `DELETE /like/:postId` - Unlike a post

## Authentication

Protected routes require a Clerk session token in the Authorization header:
```
Authorization: Bearer <clerk_session_token>
```
