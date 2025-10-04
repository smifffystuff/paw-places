# PawPlaces Mobile App

React Native + Expo mobile app for PawPlaces.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Clerk publishable key and API URL.

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on device/simulator:**
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app

## Features

### Current (MVP)
- ✅ Welcome screen
- ✅ Bottom tab navigation (Explore, Feed, Add, Profile)
- ✅ Explore places (list view with category filters)
- ✅ Social feed
- ✅ Add new places
- ✅ User profile
- ✅ API integration ready

### Coming Soon
- 🔄 Map view for places
- 🔄 Place details screen
- 🔄 Reviews and ratings
- 🔄 Image uploads
- 🔄 Pet profiles
- 🔄 Authentication flow (Clerk)
- 🔄 Location services

## Project Structure

```
app/
  _layout.js          # Root layout with Clerk provider
  index.js            # Welcome screen
  (tabs)/
    _layout.js        # Tab navigation
    explore.js        # Explore places
    feed.js           # Social feed
    add.js            # Add new place
    profile.js        # User profile
lib/
  api.js              # API client and endpoints
```

## Tech Stack

- **Framework:** React Native with Expo
- **Routing:** Expo Router
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Auth:** Clerk
- **HTTP Client:** Axios
