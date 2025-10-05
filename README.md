# PawPlaces

This repository contains the PawPlaces web application, built with Next.js 14 (App Router). The project now includes Clerk
authentication so pet parents can sign up or sign in with email or Google.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Authentication setup

1. Create a `.env.local` file based on `.env.example` and supply your Clerk publishable and secret keys.
2. Add your MongoDB connection string to the `MONGODB_URI` variable. MongoDB Atlas users can copy the SRV connection string from their cluster overview page.
3. In the Clerk dashboard, enable the **Email code** and **Google** sign-in methods for your application.
4. Add `http://localhost:3000` to the list of allowed redirect URLs in Clerk so the in-app modals can complete the OAuth
   flow locally.

After restarting the dev server, you can use the navigation bar to launch Clerk&apos;s sign-up or sign-in modals, or browse to
`/sign-in` and `/sign-up` directly.

## Scripts

- `npm run dev` – Start the development server.
- `npm run build` – Build the production bundle.
- `npm run start` – Run the production server.
- `npm run lint` – Lint the project using Next.js defaults.
