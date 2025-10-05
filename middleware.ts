import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/sign-in(.*)", "/sign-up(.*)"];
const isClerkConfigured = Boolean(process.env.CLERK_SECRET_KEY);

const clerkAuth = authMiddleware({
  publicRoutes,
});

export default function middleware(...args: Parameters<typeof clerkAuth>) {
  if (!isClerkConfigured) {
    return NextResponse.next();
  }

  return clerkAuth(...args);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
