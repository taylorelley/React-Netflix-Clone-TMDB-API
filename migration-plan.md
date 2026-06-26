# Migration Plan: React + Vite → TypeScript + Next.js 16

**Repo:** `taylorelley/React-Netflix-Clone-TMDB-API`  
**Stack today:** React 18 · Vite · JS/JSX · axios · react-router-dom v6 · CSS modules (flat files) · no tests · no CI · fetch logic inline in components

---

## Inventory

| File                       | Purpose                                | Risks                                                                    |
| -------------------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| `App.jsx`                  | Router root, API key hardcoded         | Key in source — must move to env                                         |
| `context/ThemeContext.jsx` | Dark/light mode via localStorage       | SSR hydration mismatch                                                   |
| `context/UserContext.jsx`  | Auth token via localStorage            | SSR hydration mismatch                                                   |
| `context/index.jsx`        | Combined provider                      | Trivial                                                                  |
| `components/Header`        | Search, theme toggle, auth nav         | Inline axios call, no debounce                                           |
| `components/MovieCard`     | Reusable card + click nav              | Inline style object, no fallback image type                              |
| `components/Slider`        | Hero carousel for upcoming             | No dependency array on `useEffect` (polling bug)                         |
| `components/Genres`        | Genre label from TMDB genre list       | Fetches genre list on every render                                       |
| `components/Ratings`       | Star rating display                    | `react-star-ratings` needs type stubs                                    |
| `components/Review`        | Expandable review text                 | Avatar fallback pattern OK                                               |
| `components/SearchResults` | Search dropdown item                   | OK                                                                       |
| `pages/HomePage`           | Popular + top-rated lists              | Missing dep array → infinite fetch loop                                  |
| `pages/MovieDetails`       | Movie detail + trailer + reviews       | Commented-out favorites code; bare axios post to serverUrl with no guard |
| `pages/SignIn`             | Login form                             | `setUserName` undefined bug in source                                    |
| `pages/SignUp`             | Signup form                            | `onSubmit` not wired to `handleSignUp`                                   |
| `pages/MyFavorites`        | Saved movies (commented out in router) | Dead code                                                                |

**Existing bugs to fix during migration (not add):**

- `HomePage` both `useEffect` calls missing dependency arrays → infinite re-fetch
- `SignUp.jsx` calls `setUserName()` (undefined) — should be `setUsername()`
- `SignUp` form `<form>` has no `onSubmit` handler wired
- API key hardcoded in `App.jsx` line 5
- `MovieDetails` fires `axios.post` to `serverUrl` unconditionally even when `user._id` undefined

---

## Target Stack

| Concern    | Choice                                           | Reason                                                                             |
| ---------- | ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Framework  | Next.js 16.2 (App Router)                        | SSR/SSG, Turbopack default, `use cache` explicit caching, ~400% faster dev startup |
| Language   | TypeScript 5.1+ strict                           | Required minimum for Next.js 16; type safety for TMDB shapes                       |
| Bundler    | Turbopack (default in 16)                        | No config needed; 2–5× faster builds, up to 10× faster Fast Refresh                |
| Styling    | CSS Modules (rename to `.module.css`)            | Minimal churn; scoped by default; Turbopack-compatible                             |
| HTTP       | `fetch` via Next.js Route Handlers + `use cache` | Replaces axios; keeps API key server-side; opt-in caching per endpoint             |
| Auth state | `next/headers` cookies + `localStorage` hybrid   | SSR-safe                                                                           |
| React      | 19.2 (bundled with Next.js 16)                   | View Transitions, `useEffectEvent`, `<Activity/>` available                        |
| Testing    | Vitest + React Testing Library + Playwright      | Unit + component + E2E                                                             |
| Linting    | ESLint `typescript-eslint` + Prettier            | Replaces current `.eslintrc.cjs`                                                   |
| CI         | GitHub Actions                                   | Lint → Type-check → Unit → E2E → Build                                             |
| Runtime    | Node.js 20.9+                                    | **Hard minimum for Next.js 16** — verify CI runner and deployment target           |

---

## Phase 0 — Refactor (branch: `feat/refactor`)

> Separates data logic from render logic. Components become pure renderers. Makes every subsequent phase — tests, TS, Next.js — dramatically simpler.

### 0.1 Extract API client (`src/lib/tmdb.js`)

Single module. All TMDB `baseUrl` + `apiKey` resolved here. Axios injected once. Every other file imports from this module — nothing else calls axios directly.

```js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL ?? 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const client = axios.create({ baseURL: BASE_URL });

/**
 * Fetches a paginated list of popular movies.
 * @param {number} page
 * @returns {Promise<import('../types').Movie[]>}
 */
export const getPopularMovies = (page = 1) =>
  client.get('/movie/popular', { params: { api_key: API_KEY, page } }).then((r) => r.data.results);

/**
 * Fetches top-rated movies (first page, first 10 results).
 * @returns {Promise<import('../types').Movie[]>}
 */
export const getTopRatedMovies = () =>
  client
    .get('/movie/top_rated', { params: { api_key: API_KEY, page: 1 } })
    .then((r) => r.data.results.slice(0, 10));

/**
 * Fetches upcoming movies.
 * @returns {Promise<import('../types').Movie[]>}
 */
export const getUpcomingMovies = () =>
  client.get('/movie/upcoming', { params: { api_key: API_KEY } }).then((r) => r.data.results);

/**
 * Fetches full movie details by ID.
 * @param {number|string} id
 * @returns {Promise<import('../types').MovieDetails>}
 */
export const getMovieDetails = (id) =>
  client.get(`/movie/${id}`, { params: { api_key: API_KEY } }).then((r) => r.data);

/**
 * Fetches YouTube trailer key for a movie.
 * @param {number|string} id
 * @returns {Promise<string|null>}
 */
export const getMovieTrailer = (id) =>
  client
    .get(`/movie/${id}/videos`, { params: { api_key: API_KEY, language: 'en-US' } })
    .then(
      (r) => r.data.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer')?.key ?? null,
    );

/**
 * Fetches reviews for a movie.
 * @param {number|string} id
 * @returns {Promise<{ results: import('../types').Review[], total_results: number }>}
 */
export const getMovieReviews = (id) =>
  client.get(`/movie/${id}/reviews`, { params: { api_key: API_KEY } }).then((r) => r.data);

/**
 * Fetches the full genre list.
 * @returns {Promise<import('../types').Genre[]>}
 */
export const getGenres = () =>
  client.get('/genre/movie/list', { params: { api_key: API_KEY } }).then((r) => r.data.genres);

/**
 * Searches movies by query string.
 * @param {string} query
 * @returns {Promise<import('../types').Movie[]>}
 */
export const searchMovies = (query) =>
  client.get('/search/movie', { params: { api_key: API_KEY, query } }).then((r) => r.data.results);
```

Move `VITE_TMDB_API_KEY` to `.env`. Remove prop-drilling of `apiKey` + `baseUrl` from `App.jsx` — no component receives these props after this phase.

### 0.2 Extract custom hooks (`src/hooks/`)

Each hook wraps one `tmdb.js` call. Components stop managing fetch state themselves.

```
src/hooks/
  usePopularMovies.js    → getPopularMovies(page)
  useTopRatedMovies.js   → getTopRatedMovies()
  useUpcomingMovies.js   → getUpcomingMovies()
  useMovieDetails.js     → getMovieDetails(id)
  useMovieTrailer.js     → getMovieTrailer(id)
  useMovieReviews.js     → getMovieReviews(id)
  useGenres.js           → getGenres()
  useSearch.js           → searchMovies(query) + 300ms debounce
```

Pattern (same for all):

```js
import { useState, useEffect } from 'react';
import { getPopularMovies } from '../lib/tmdb';

/**
 * Fetches and returns paginated popular movies.
 *
 * @param {number} page - Page number (1–10)
 * @returns {{ movies: Movie[], loading: boolean, error: Error|null }}
 */
export function usePopularMovies(page = 1) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPopularMovies(page)
      .then(setMovies)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [page]);

  return { movies, loading, error };
}
```

`useSearch` adds debounce and skips empty queries:

```js
import { useState, useEffect } from 'react';
import { searchMovies } from '../lib/tmdb';

/**
 * Debounced movie search hook.
 *
 * @param {string} query - Raw search input
 * @param {number} [delay=300] - Debounce delay in ms
 * @returns {{ results: Movie[], loading: boolean }}
 */
export function useSearch(query, delay = 300) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(
      () =>
        searchMovies(query)
          .then(setResults)
          .catch(() => setResults([]))
          .finally(() => setLoading(false)),
      delay,
    );
    return () => clearTimeout(timer);
  }, [query, delay]);

  return { results, loading };
}
```

### 0.3 Refactor components to use hooks

Remove all `useState`/`useEffect`/`axios` fetch logic from components. Replace with hook calls.

| Component      | Before                                                   | After                                                                 |
| -------------- | -------------------------------------------------------- | --------------------------------------------------------------------- |
| `HomePage`     | 2× inline `useEffect` + `axios.get` (missing dep arrays) | `usePopularMovies(page)` + `useTopRatedMovies()`                      |
| `Slider`       | inline `useEffect` + `axios.get`                         | `useUpcomingMovies()`                                                 |
| `Genres`       | inline `useEffect` + `axios.get` (fires every render)    | `useGenres()`                                                         |
| `Header`       | inline `useEffect` + `axios.get`                         | `useSearch(query)`                                                    |
| `MovieDetails` | 3× inline `useEffect` + `axios.get`                      | `useMovieDetails(id)` + `useMovieTrailer(id)` + `useMovieReviews(id)` |

Example — `Header` after refactor:

```jsx
import { useSearch } from '../../hooks/useSearch';

function Header() {
  const [query, setQuery] = useState('');
  const { results } = useSearch(query);
  // ... rest of render only
}
```

### 0.4 Fix all existing bugs (during refactor, not later)

> Fix here rather than deferring to TS phase — broken behaviour produces misleading test results.

| File               | Bug                                                  | Fix                                                           |
| ------------------ | ---------------------------------------------------- | ------------------------------------------------------------- |
| `HomePage.jsx`     | Both `useEffect` missing dep arrays → infinite fetch | Eliminated — hooks handle deps correctly                      |
| `SignUp.jsx`       | `setUserName()` undefined                            | Rename state to `setUsername`                                 |
| `SignUp.jsx`       | `<form>` no `onSubmit`                               | Add `onSubmit={handleSignUp}`                                 |
| `App.jsx`          | API key hardcoded                                    | Move to `VITE_TMDB_API_KEY` env var                           |
| `MovieDetails.jsx` | `axios.post` fires with undefined `user._id`         | Guarded inside `useEffect` with `if (user?._id && movie?.id)` |
| `Slider.jsx`       | `handleRight`/`handleLeft` off-by-one wrap           | Fix boundary check order before `setIndex`                    |

### 0.5 Add JSDoc docstrings

Every function, hook, and component in `src/` gets a docstring before tests are written. Pattern for components:

```jsx
/**
 * Displays an expandable user review with avatar fallback.
 *
 * @param {Object} props
 * @param {import('../../types').Review} props.review - TMDB review object
 */
function Review({ review }) { ... }
```

### 0.6 Remove dead code

- Delete commented-out favorites logic in `MovieDetails.jsx`
- Remove unused `MyFavorites` route from `App.jsx` (keep component file, mark `@deprecated` in docstring)
- Remove `serverUrl` prop from `MovieDetails` (no longer used post-cleanup)

### 0.7 Resulting structure after refactor

```
src/
  lib/
    tmdb.js              ← all TMDB fetch fns (single mock target)
  hooks/
    usePopularMovies.js
    useTopRatedMovies.js
    useUpcomingMovies.js
    useMovieDetails.js
    useMovieTrailer.js
    useMovieReviews.js
    useGenres.js
    useSearch.js
  components/            ← pure renderers; no fetch logic
  pages/                 ← pure renderers; no fetch logic
  context/               ← unchanged
  types/                 ← (introduced in Phase 2)
```

> PR → main. App must behave identically before/after. No new features.

---

## Phase 1 — Pre-Migration Safety Net (branch: `feat/tests`)

> Now components are pure renderers, tests are trivial. Mock `src/lib/tmdb.js` once — all hooks and components covered.

### 1.1 Install test tooling

### 1.1 Install test tooling

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jsdom playwright @playwright/test msw
```

### 1.2 Vitest config (`vitest.config.js`)

```js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
  },
});
```

### 1.3 Test setup (`src/test/setup.js`)

```js
import '@testing-library/jest-dom';
```

### 1.4 Mock `src/lib/tmdb.js` (`src/test/mocks/tmdb.js`)

After refactor, one mock covers all hooks and components. No MSW needed for unit tests.

```js
export const getPopularMovies = vi
  .fn()
  .mockResolvedValue([
    { id: 1, title: 'Test Movie', vote_average: 7, poster_path: '/x.jpg', genre_ids: [28] },
  ]);
export const getTopRatedMovies = vi.fn().mockResolvedValue([]);
export const getUpcomingMovies = vi.fn().mockResolvedValue([
  {
    id: 2,
    title: 'Upcoming Movie',
    overview: 'Overview text',
    backdrop_path: '/y.jpg',
    genre_ids: [28],
    vote_average: 8,
    release_date: '2026-12-01',
  },
]);
export const getMovieDetails = vi.fn().mockResolvedValue({
  id: 550,
  title: 'Fight Club',
  overview: '...',
  poster_path: '/z.jpg',
  vote_average: 8.4,
  genres: [{ id: 18, name: 'Drama' }],
  runtime: 139,
  budget: 63000000,
  tagline: 'Mischief. Mayhem. Soap.',
  status: 'Released',
});
export const getMovieTrailer = vi.fn().mockResolvedValue('dQw4w9WgXcQ');
export const getMovieReviews = vi.fn().mockResolvedValue({ results: [], total_results: 0 });
export const getGenres = vi.fn().mockResolvedValue([{ id: 28, name: 'Action' }]);
export const searchMovies = vi.fn().mockResolvedValue([]);
```

MSW still used for E2E — keeps real network shape honest.

### 1.5 Unit tests (JS, post-refactor)

Write in `src/__tests__/`. Tests now small — components are pure renderers, hooks are thin wrappers.

| Test file                           | What it covers                                                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `lib/tmdb.test.js`                  | Each exported fn calls correct axios endpoint; query params correct; trailer filter picks YouTube+Trailer only                 |
| `hooks/usePopularMovies.test.js`    | Returns movies on resolve; sets loading correctly; calls `getPopularMovies(page)`                                              |
| `hooks/useUpcomingMovies.test.js`   | Returns movies; wraps index correctly in Slider context                                                                        |
| `hooks/useMovieDetails.test.js`     | Returns details on resolve; passes `id` param                                                                                  |
| `hooks/useMovieTrailer.test.js`     | Returns key string; returns null on no match                                                                                   |
| `hooks/useMovieReviews.test.js`     | Returns results + total                                                                                                        |
| `hooks/useGenres.test.js`           | Returns genre array                                                                                                            |
| `hooks/useSearch.test.js`           | Empty query skips call; debounce delays call; returns results                                                                  |
| `context/ThemeContext.test.jsx`     | Default `darkMode` true; toggle persists to localStorage; reads localStorage on mount                                          |
| `context/UserContext.test.jsx`      | Empty default; reads `userInfo` from localStorage on mount; exposes `setUser`/`setToken`                                       |
| `components/Header.test.jsx`        | Renders logo; search input visible; results shown when query non-empty; theme icon click calls `setDarkMode`                   |
| `components/MovieCard.test.jsx`     | Renders title; renders star rating; click navigates to `/moviedetails/{id}`; fallback when `poster_path` null                  |
| `components/Slider.test.jsx`        | Renders movie title; right arrow increments index; left arrow wraps to last; index wraps on right from end                     |
| `components/Genres.test.jsx`        | Maps genre IDs to names from hook; handles empty `moviesGenres`                                                                |
| `components/Ratings.test.jsx`       | Renders correct number of filled stars for given rating                                                                        |
| `components/Review.test.jsx`        | Truncates at 300 chars; "read more" expands; "read less" collapses                                                             |
| `components/SearchResults.test.jsx` | Renders title + image; click navigates and clears query                                                                        |
| `pages/HomePage.test.jsx`           | Renders popular section; renders top-rated section; pagination numbers 1–10; page click sets page                              |
| `pages/MovieDetails.test.jsx`       | Renders ReactPlayer when trailer key present; fallback poster when null; renders reviews; "read more reviews" increments count |
| `pages/SignIn.test.jsx`             | Renders email + password inputs; submit posts credentials; stores token on success; shows already-logged-in when token set     |
| `pages/SignUp.test.jsx`             | Renders all three inputs; submit calls endpoint; success state shown; `setUsername` now defined (bug fixed)                    |
| `pages/MyFavorites.test.jsx`        | Shows sign-in prompt when no token; renders MovieCards when token present                                                      |

### 1.6 Playwright E2E (`e2e/`)

```
e2e/
  home.spec.js         # slider visible, popular cards rendered, pagination present
  search.spec.js       # type query → dropdown appears → click → navigates to detail
  moviedetails.spec.js # /moviedetails/550 → title, trailer or fallback, reviews section
  auth.spec.js         # signin form → submit → redirect; token clears on signout
```

MSW service worker active in Playwright against `vite preview` build.

---

## Phase 2 — GitHub Actions CI (branch: `feat/ci`)

> Establish green baseline before any structural changes.

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, feat/typescript, feat/nextjs]
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint

  unit:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run test -- --run --coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  e2e:
    runs-on: ubuntu-latest
    needs: unit
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  build:
    runs-on: ubuntu-latest
    needs: [unit, e2e]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
    env:
      TMDB_API_KEY: ${{ secrets.TMDB_API_KEY }}
```

Add `TMDB_API_KEY` as GitHub Actions secret.

---

## Phase 3 — TypeScript Migration (branch: `feat/typescript`)

### 3.1 Install TS + type stubs

```bash
npm install -D typescript @types/react @types/react-dom @types/node
npx tsc --init
```

`tsconfig.json` target:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### 3.2 TMDB type definitions (`src/types/tmdb.ts`)

```ts
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  runtime?: number;
  budget?: number;
  tagline?: string;
  status?: string;
  genres?: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  key: string;
  site: string;
  type: string;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  author_details: {
    avatar_path: string | null;
  };
}

export interface TMDBResponse<T> {
  results: T[];
  total_results: number;
  page: number;
  total_pages: number;
}
```

### 3.3 Context types (`src/types/context.ts`)

```ts
export interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export interface User {
  _id: string;
  email: string;
  username: string;
  token?: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string;
  setToken: (token: string) => void;
}
```

### 3.4 Rename files

```
src/lib/tmdb.js           → src/lib/tmdb.ts
src/hooks/*.js            → src/hooks/*.ts
*.jsx                     → *.tsx  (all components, pages, contexts)
```

Rename order: `types/` → `lib/` → `hooks/` → `context/` → `components/` → `pages/` → `App`

Type the hook return shapes using `src/types/tmdb.ts`. Add `interface` for all hook return values. No bugs to fix here — all fixed in Phase 0.

### 3.5 Update tests to TypeScript

Rename `src/__tests__/**/*.test.jsx` → `*.test.tsx`. Update mock file to `src/test/mocks/tmdb.ts`. Add `vi.mock('@/lib/tmdb')` imports. Add TS assertions where useful (e.g., `as Movie`).

Add type-check step to CI (update `ci.yml`):

```yaml
typecheck:
  runs-on: ubuntu-latest
  needs: lint
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with: { node-version: 20, cache: npm }
    - run: npm ci
    - run: npx tsc --noEmit
```

---

## Phase 4 — Next.js 16 Migration (branch: `feat/nextjs`)

### 4.1 Bootstrap Next.js 16

```bash
# Scaffold new project (installs next@latest = 16.2.x, react@19, react-dom@19)
npx create-next-app@latest cinetrail-next \
  --typescript --app --src-dir --no-tailwind --import-alias "@/*"
```

> **Node.js check first.** Next.js 16 requires Node.js 20.9+. Verify CI runner (`ubuntu-latest` ships Node 20 ✓) and deployment target before proceeding.

Copy `src/` content across. Adjust imports. Turbopack is the default bundler — no config needed. If any custom webpack plugin is in use, test with `next build --webpack` as fallback.

### 4.2 Routing map

| React Router route       | Next.js App Router equivalent         |
| ------------------------ | ------------------------------------- |
| `/`                      | `app/page.tsx`                        |
| `/moviedetails/:movieid` | `app/moviedetails/[movieid]/page.tsx` |
| `/signin`                | `app/signin/page.tsx`                 |
| `/signup`                | `app/signup/page.tsx`                 |
| `/myfavorites`           | `app/myfavorites/page.tsx`            |

Remove `react-router-dom`. Replace `useNavigate` → `useRouter` from `next/navigation`. Replace `<Link>` → `next/link`.

### 4.3 API key — move server-side

Create Next.js Route Handlers to proxy TMDB. API key never ships to client. `src/lib/tmdb.ts` base URL switches from `https://api.themoviedb.org/3` to `/api/tmdb` — one change, all hooks follow.

In Next.js 16, caching is **explicit and opt-in** via the `use cache` directive — there is no longer implicit `fetch` caching. Add `"use cache"` at function level to cache TMDB responses server-side.

```
app/api/tmdb/[...path]/route.ts
```

```ts
import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY!;

/**
 * Proxies GET requests to the TMDB API, injecting the server-side API key.
 * Caches responses for 60 seconds via Next.js 16 `use cache` + cacheLife.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  'use cache';
  const { path } = await params;
  const search = req.nextUrl.searchParams.toString();
  const url = `${TMDB_BASE}/${path.join('/')}?api_key=${API_KEY}&${search}`;
  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data);
}
```

> **Next.js 16 caching note:** `{ next: { revalidate: 60 } }` on `fetch()` is removed in Next.js 16. Use `"use cache"` at the function level instead. For this route handler, add `import { cacheLife } from 'next/cache'` and call `cacheLife('minutes')` inside the handler if per-request granularity is needed. For read-your-writes after mutations (e.g., a future favourites feature), use `updateTag()` from `next/cache` in Server Actions — not `revalidateTag()`.

All hook calls to TMDB route through `/api/tmdb/...` — no other changes needed downstream.

### 4.4 SSR-safe context

Wrap localStorage calls in `typeof window !== 'undefined'` guards. Use `'use client'` directive on all context providers and interactive components.

`app/layout.tsx`:

```tsx
import { CombinedContextProvider } from '@/context';
import Header from '@/components/Header/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CombinedContextProvider>
          <Header />
          {children}
        </CombinedContextProvider>
      </body>
    </html>
  );
}
```

### 4.5 Image optimisation

Replace all `<img>` with `next/image`. TMDB domain allowlisted in `next.config.ts`:

```ts
import type { NextConfig } from 'next';

/**
 * Next.js 16 configuration.
 * Turbopack is the default bundler — no explicit config needed.
 * cacheComponents enables explicit opt-in caching via "use cache" directive.
 * reactCompiler auto-memoizes components (zero manual useMemo/useCallback).
 */
const nextConfig: NextConfig = {
  // Next.js 16: explicit opt-in caching — replaces implicit fetch revalidate
  cacheComponents: true,

  // React Compiler stable in Next.js 16 — auto-memoizes, no code changes needed
  // Enable after validating build times; adds Babel compile step
  // reactCompiler: true,

  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'image.tmdb.org', pathname: '/t/p/**' }],
  },
};

export default nextConfig;
```

### 4.6 CSS Modules rename

```
header.css        → Header.module.css
movie.css         → MovieCard.module.css  (components)
movie.css         → MovieDetails.module.css (pages)
slider.css        → Slider.module.css
review.css        → Review.module.css
home.css          → HomePage.module.css
fav.css           → MyFavorites.module.css
signIn.css        → SignIn.module.css
signUp.css        → SignUp.module.css
```

Update imports and replace class string references with `styles.className`.

### 4.7 Dependency cleanup

Remove:

- `react-router-dom` → replaced by `next/navigation`
- `axios` → replaced by `fetch`
- `prop-types` → replaced by TypeScript

Keep:

- `react-player`
- `react-icons`
- `react-star-ratings` (add `@types/react-star-ratings` or `declare module`)

Add / upgrade:

- `next@16` (latest: `16.2.x`)
- `react@19` + `react-dom@19` (bundled with Next.js 16 — React 19.2 features available)
- `typescript@5.1+` (Next.js 16 hard minimum)

No `middleware.ts` needed for this app — no request interception required. If added later, name it `middleware.ts` (Next.js convention).

---

## Phase 5 — Post-Migration

### 5.1 Update CI for Next.js 16

Replace `vite build` with `next build` (Turbopack is the default — no flag needed). Pin Node.js to `20.9` minimum in all CI jobs (Next.js 16 hard requirement). Add type-check step:

```yaml
typecheck:
  runs-on: ubuntu-latest
  needs: lint
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with: { node-version: '20.9', cache: npm }
    - run: npm ci
    - run: npx tsc --noEmit
```

Full CI job order: `lint → typecheck → unit → e2e → build`

### 5.2 Coverage gate

Add to `vitest.config.ts`:

```ts
coverage: {
  provider: 'v8',
  thresholds: { lines: 80, functions: 80, branches: 70 },
}
```

### 5.3 Secrets management

`.env.local` (never committed):

```
TMDB_API_KEY=your_key_here
```

GitHub Actions secrets: `TMDB_API_KEY`

Remove hardcoded key from `App.tsx` ⚠️ — rotate the exposed key `8ff72cfe0871eca79c1016ea37ac82c0` immediately; it is public in repo history.

---

## Execution Order

```
Phase 0  (Refactor) [branch: feat/refactor]
  ├─ 0.1  Extract src/lib/tmdb.js (API client, move key to .env)
  ├─ 0.2  Extract src/hooks/* (8 custom hooks)
  ├─ 0.3  Refactor all components to use hooks (remove inline fetch logic)
  ├─ 0.4  Fix all 6 existing bugs
  ├─ 0.5  Add JSDoc docstrings to all 16 source files + 8 hooks + lib
  └─ 0.6  Remove dead code (commented favorites, serverUrl prop)
           └─ PR #1 → main (app behaves identically, no new features)

Phase 1  (Tests) [branch: feat/tests]
  ├─ 1.1  Install vitest + RTL + Playwright + msw
  ├─ 1.2  vitest.config.js + setup + tmdb mock
  ├─ 1.3  Write 23 unit test files
  └─ 1.4  Write 4 E2E specs
           └─ PR #2 → main (all tests green)

Phase 2  (CI) [branch: feat/ci]
  └─ Add .github/workflows/ci.yml
           └─ PR #3 → main (CI green on all PRs going forward)

Phase 3  (TypeScript) [branch: feat/typescript]
  ├─ 3.1  tsconfig.json
  ├─ 3.2  src/types/tmdb.ts + context.ts
  ├─ 3.3  Rename: lib → hooks → context → components → pages → App
  ├─ 3.4  Update tests + mocks to .tsx/.ts
  └─ 3.5  Add typecheck job to CI
           └─ PR #4 → main (CI green, zero TS errors)

Phase 4  (Next.js 16) [branch: feat/nextjs]
  ├─ 4.1  Bootstrap Next.js 16 (next@16, react@19, node 20.9+ check)
  ├─ 4.2  Map routes; replace react-router with next/navigation
  ├─ 4.3  Route Handlers + "use cache" directive; update tmdb.ts base URL
  ├─ 4.4  SSR-safe context + 'use client' directives
  ├─ 4.5  next/image + next.config.ts (cacheComponents: true)
  ├─ 4.6  CSS Modules rename
  ├─ 4.7  Remove axios + react-router-dom + prop-types; upgrade react@19
  └─ 4.8  Update CI (next build, node 20.9, tsc --noEmit)
           └─ PR #5 → main (CI green, Playwright green)

Phase 5  (Post)
  ├─ Coverage thresholds enforced in CI
  ├─ Rotate exposed API key (already in git history)
  └─ Update README
```

---

## Effort Estimate

| Phase          | Scope                                                                      | Est. Hours  |
| -------------- | -------------------------------------------------------------------------- | ----------- |
| 0 — Refactor   | API client, 8 hooks, component cleanup, bug fixes, JSDoc                   | 4–6 h       |
| 1 — Tests      | 23 unit test files, 4 E2E specs, MSW setup                                 | 8–10 h      |
| 2 — CI         | 1 workflow file                                                            | 1 h         |
| 3 — TypeScript | Types, rename 24 files, update tests                                       | 4–6 h       |
| 4 — Next.js 16 | Bootstrap, routing, `use cache` proxy, `next/image`, CSS modules, React 19 | 8–12 h      |
| 5 — Post       | Coverage gate, secret rotation, README                                     | 1 h         |
| **Total**      |                                                                            | **26–36 h** |
