# Repository Guidelines

## Project Structure & Module Organization
PawPlaces uses the Next.js App Router. User-facing routes reside in `app/`, with segment folders (e.g., `app/my-places/page.tsx`) providing screens and `layout.tsx` wrappers. API route handlers live under `app/api/*/route.ts` and share data access helpers from `lib/`. Reusable UI belongs in `app/components/`, while cross-cutting styling stays in `app/globals.css`. Keep shared utilities in `lib/` and prefer server-side logic in route handlers or server components rather than component files.

## Build, Test, and Development Commands
Run `npm run dev` to boot the development server at `http://localhost:3000`. Use `npm run build` to create the production bundle and surface type errors. Start the optimized server locally with `npm run start` after building. Enforce lint and type rules with `npm run lint`; run it before every PR.

## Coding Style & Naming Conventions
TypeScript is required (`strict` mode is on) and JSX files should stay in `.tsx`. Follow the default Next.js lint rules (`next/core-web-vitals`) and resolve imports via the `@/` alias for workspace-root modules. Prefer PascalCase for components (`TopNav`), camelCase for functions and variables, and kebab-case for route segment folders (`my-places`). CSS classes follow the BEM-influenced pattern already in `globals.css` (e.g., `hero__title`); extend that so naming stays predictable.

## Testing Guidelines
Automated tests are not yet committed. When adding features, include at least a targeted plan in the PR description covering manual or automated checks you ran. If you introduce a test runner, colocate component specs beside the feature (`app/my-places/__tests__/list.spec.tsx`) and add an npm script (e.g., `npm run test`) so contributors can reproduce locally. Document any new environment fixtures needed for test data.

## Commit & Pull Request Guidelines
Commits in this repo use short, imperative subject lines (`Fix MongoDB insert typing`). Group related changes together rather than batching unrelated work. PRs should describe the problem, the solution, and verification steps; link GitHub issues with `Fixes #123` when relevant. Include screenshots or request/response samples for UI or API changes, and call out any new environment variables in the description.

## Security & Configuration Tips
Copy `.env.example` to `.env.local` and fill in Clerk keys plus `MONGODB_URI`; never commit secrets. Double-check that features relying on MongoDB degrade gracefully when the URI is absent, and note any new secrets in PR docs so ops can update deployment configs.
