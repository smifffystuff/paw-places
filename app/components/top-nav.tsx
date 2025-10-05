"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const isClerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

export function TopNav() {
  return (
    <header className="top-nav" aria-label="Primary navigation">
      <a className="top-nav__brand" href="#hero">
        <span aria-hidden>🐾</span>
        <span>PawPlaces</span>
        <span className="top-nav__badge">MVP in progress</span>
      </a>

      <div className="top-nav__actions">
        {isClerkConfigured ? (
          <>
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="top-nav__cta" type="button">
                  Create an account
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="top-nav__link" type="button">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "top-nav__avatar",
                    userButtonPopoverCard: "top-nav__popover",
                  },
                }}
              />
            </SignedIn>
          </>
        ) : (
          <a
            className="top-nav__link"
            href="https://dashboard.clerk.com/last-active?path=api-keys"
            target="_blank"
            rel="noreferrer"
          >
            Configure Clerk
          </a>
        )}
      </div>
    </header>
  );
}
