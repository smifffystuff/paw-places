# 🚀 Quick Start Guide

## Prerequisites Checklist

Before you begin, make sure you have:

- [ ] **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- [ ] **MongoDB** - Either:
  - Local: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas Free Tier](https://www.mongodb.com/cloud/atlas/register)
- [ ] **Clerk Account** - [Sign up free](https://clerk.com/)
- [ ] **Expo Go App** on your phone (iOS/Android) for testing

## Step-by-Step Setup

### 1. Clone & Install

Open PowerShell in the project directory and run:

```powershell
npm run setup
```

This will install dependencies for both backend and mobile.

### 2. Configure Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your **Publishable Key** and **Secret Key**

### 3. Configure Backend

Edit `backend/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/pawplaces
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NODE_ENV=development
```

**For MongoDB Atlas:**
Replace `MONGODB_URI` with your connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/pawplaces
```

### 4. Configure Mobile

Edit `mobile/.env`:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### 5. Start MongoDB (if running locally)

```powershell
# Windows - if MongoDB is installed as a service, it should already be running
# Otherwise, start it with:
mongod
```

### 6. Start the Backend

Open a new PowerShell terminal:

```powershell
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

Test it: Open http://localhost:3000/health in your browser

### 7. Start the Mobile App

Open another PowerShell terminal:

```powershell
cd mobile
npm start
```

This will open Expo Dev Tools. You can:
- Press `a` for Android emulator
- Press `i` for iOS simulator (Mac only)
- Scan QR code with Expo Go app on your phone

## First Time Using the App

1. **Welcome Screen** - Click "Get Started"
2. **Explore Tab** - Browse places (empty at first)
3. **Add Tab** - Add your first pet-friendly place
4. **Feed Tab** - See social posts (empty at first)
5. **Profile Tab** - View your profile

## Troubleshooting

### Backend won't start

**MongoDB connection error:**
- Check MongoDB is running: `mongosh` in terminal
- Verify connection string in `backend/.env`
- For Atlas: Check IP whitelist (allow 0.0.0.0/0 for testing)

**Port already in use:**
- Change `PORT=3001` in `backend/.env`
- Update mobile `.env` to match: `EXPO_PUBLIC_API_URL=http://localhost:3001`

### Mobile app won't connect to backend

**On physical device:**
- Replace `localhost` with your computer's IP address
- Find IP: Run `ipconfig` in PowerShell, look for IPv4 Address
- Update mobile `.env`: `EXPO_PUBLIC_API_URL=http://192.168.x.x:3000`

**Firewall blocking:**
- Allow Node.js through Windows Firewall
- Temporarily disable firewall for testing

### Clerk authentication issues

- Verify keys in both `.env` files match Clerk dashboard
- Check Clerk app is in "Development" mode
- Clear Expo cache: `npx expo start -c`

## Testing the API

Use PowerShell or a tool like Postman:

```powershell
# Health check
curl http://localhost:3000/health

# Get places
curl http://localhost:3000/places

# Get feed
curl http://localhost:3000/feed
```

## Next Steps

1. **Seed some data:**
   - Use the mobile app to add a few places
   - Create some test reviews
   
2. **Explore the code:**
   - Backend routes: `backend/src/routes/`
   - Mobile screens: `mobile/app/(tabs)/`

3. **Add features:**
   - Implement map view
   - Add image uploads
   - Create pet profiles
   - Build reviews UI

## Useful Commands

```powershell
# Backend
cd backend
npm run dev          # Start development server
npm start           # Start production server

# Mobile
cd mobile
npm start           # Start Expo dev server
npm run android     # Open on Android
npm run ios         # Open on iOS (Mac only)

# Root
npm run backend     # Start backend from root
npm run mobile      # Start mobile from root
```

## Development Workflow

1. **Make changes to backend:**
   - Server auto-restarts (using `--watch` flag)
   - Check terminal for errors

2. **Make changes to mobile:**
   - Expo hot-reloads automatically
   - Shake device and select "Reload" if needed

3. **Test API changes:**
   - Use curl, Postman, or the mobile app
   - Check backend logs for debugging

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Fastify Documentation](https://www.fastify.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Clerk Documentation](https://clerk.com/docs)
- [NativeWind](https://www.nativewind.dev/)

## Getting Help

If you encounter issues:

1. Check the error message carefully
2. Review this guide and README.md
3. Check backend logs for API errors
4. Try clearing caches and reinstalling dependencies
5. Google the specific error message

Happy coding! 🐾
