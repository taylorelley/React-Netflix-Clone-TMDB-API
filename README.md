# Cinetrail (React Netflix Clone, TMDB API)

A Netflix-style movie browser built with **Next.js 16 (App Router)**, **React 19**, and **TypeScript 5**, powered by the TMDB API. The TMDB API key is kept server-side via a Next.js Route Handler with `use cache`; the client never sees it.

## Test coverage

| Metric     | Coverage   |
| ---------- | ---------- |
| Statements | **99.01%** |
| Branches   | **86.16%** |
| Functions  | **100%**   |
| Lines      | **99.01%** |

`npm run test:coverage` (Vitest + v8) — 23 test files, 135 tests. All `src/hooks/*` and `src/lib/tmdb.ts` at 100%; remaining gap is `src/types/` (type-only files, no runtime).

E2E (Playwright, 15 tests) and the production build (`npx next build`) are also part of CI — see `.github/workflows/ci.yml`.

## Stack

- **Framework**: Next.js 16.2 (App Router, Turbopack, Cache Components)
- **Runtime**: React 19.2
- **Language**: TypeScript 5 (strict, `noUncheckedIndexedAccess`)
- **Styling**: CSS Modules
- **Data**: TMDB API proxied through `/api/tmdb/[...path]` route handler
- **Tests**: Vitest + React Testing Library + Playwright
- **Lint**: ESLint 9 (flat config) + `eslint-config-next` + `typescript-eslint`
- **CI**: GitHub Actions — lint → typecheck → unit → e2e → build, Node 20.9

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set the TMDB key (server-side only):

   ```bash
   cp .env.example .env.local
   # then edit .env.local to set TMDB_API_KEY=...
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## Scripts

| Script                  | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start the Next.js dev server (Turbopack) |
| `npm run build`         | Production build (Turbopack)             |
| `npm start`             | Run the production build                 |
| `npm run lint` | ESLint (Next.js + React + TS rules) |
| `npm run format` | Prettier write all `*.{ts,tsx,js,jsx,json,css,md,yml}` |
| `npm run format:check` | Prettier verify (used in CI) |
| `npm run typecheck` | `tsc --noEmit` for app + test configs |
| `npm run test:run` | Vitest unit tests (single run) |
| `npm run test:coverage` | Vitest with v8 coverage report |
| `npm run test` | Vitest watch mode |
| `npm run e2e` | Playwright end-to-end tests |

## Routes

| Path                      | Source                                                          |
| ------------------------- | --------------------------------------------------------------- |
| `/`                       | `src/app/page.tsx` → `src/views/HomePage/HomePage.tsx`          |
| `/moviedetails/[movieid]` | `src/app/moviedetails/[movieid]/page.tsx`                       |
| `/signin`                 | `src/app/signin/page.tsx`                                       |
| `/signup`                 | `src/app/signup/page.tsx`                                       |
| `/myfavorites`            | `src/app/myfavorites/page.tsx`                                  |
| `/api/tmdb/[...path]`     | `src/app/api/tmdb/[...path]/route.ts` (TMDB proxy, `use cache`) |

## Project layout

```
src/
  app/                      Next.js App Router (pages + route handlers)
  components/               Shared UI components (Header, MovieCard, ...)
  context/                  React context providers (theme, user)
  hooks/                    Data-fetching hooks (usePopularMovies, ...)
  views/                    Page-level components (one per route)
  lib/                      Pure modules (TMDB client)
  types/                    TypeScript interfaces (Movie, Review, ...)
  assets/                   Static assets (avatar, no-image fallback)
tests/                      Vitest unit + integration tests
e2e/                        Playwright E2E specs
```

## Notes

- Dev server requires **Node.js 20.9+** (Next.js 16 hard minimum).
- The app uses Next.js 16 Cache Components (`cacheComponents: true`). Layout children are wrapped in `<Suspense>` to allow client components to mount cleanly.
- All client components carry the `'use client'` directive. Server-only code (the TMDB proxy) lives in `src/app/api/...`.
- The exposed TMDB key `8ff72cfe0871eca79c1016ea37ac82c0` was published in git history; rotate it before going to production.
