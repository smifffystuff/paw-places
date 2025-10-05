"use client";

import { SignUp } from "@clerk/nextjs";

const isClerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

export default function SignUpPage() {
  if (!isClerkConfigured) {
    return (
      <main className="auth-page" aria-label="Create an account">
        <div className="auth-page__notice">
          <p>Clerk is not configured yet.</p>
          <p>
            Add your publishable and secret keys to <code>.env.local</code> so the
            hosted sign-up experience can load.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page" aria-label="Create an account">
      <SignUp
        afterSignUpUrl="/"
        signInUrl="/sign-in"
        appearance={{
          variables: {
            colorPrimary: "#2563eb",
            colorText: "#0f172a",
            fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          },
          elements: {
            footer: "auth-page__footer",
          },
        }}
      />
    </main>
  );
}
