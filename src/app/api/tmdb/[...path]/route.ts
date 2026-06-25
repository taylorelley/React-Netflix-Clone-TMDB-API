/**
 * TMDB API proxy route handler.
 *
 * The TMDB API key never leaves the server. Client code calls
 * `/api/tmdb/...` instead of `https://api.themoviedb.org/3/...`.
 * Responses are cached on the server via the Next.js 16 `use cache`
 * directive (extracted to a helper because `use cache` cannot be used
 * directly inside a Route Handler body).
 */
import { NextResponse, type NextRequest } from 'next/server';
import { cacheLife } from 'next/cache';

const TMDB_BASE = 'https://api.themoviedb.org/3';

class TmdbConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TmdbConfigError';
  }
}

class TmdbUpstreamError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'TmdbUpstreamError';
    this.status = status;
  }
}

async function fetchFromTmdb(path: string, search: string, apiKey: string): Promise<unknown> {
  'use cache';
  cacheLife('minutes');
  const params = new URLSearchParams(search);
  params.set('api_key', apiKey);
  const url = `${TMDB_BASE}/${path}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new TmdbUpstreamError(res.status, `TMDB responded ${res.status}`);
  }
  return res.json();
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'TMDB_API_KEY is not set in the server environment', code: 'TMDB_NOT_CONFIGURED' },
      { status: 503 },
    );
  }

  const { path } = await params;
  const search = req.nextUrl.searchParams.toString();

  try {
    const data = await fetchFromTmdb(path.join('/'), search, apiKey);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof TmdbUpstreamError) {
      return NextResponse.json(
        { error: err.message, code: 'TMDB_UPSTREAM_ERROR' },
        { status: err.status >= 400 && err.status < 600 ? err.status : 502 },
      );
    }
    if (err instanceof TmdbConfigError) {
      return NextResponse.json(
        { error: err.message, code: 'TMDB_NOT_CONFIGURED' },
        { status: 503 },
      );
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message, code: 'INTERNAL' }, { status: 500 });
  }
}
