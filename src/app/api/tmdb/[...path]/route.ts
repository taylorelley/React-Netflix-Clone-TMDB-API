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

async function fetchFromTmdb(path: string, search: string): Promise<unknown> {
  'use cache';
  cacheLife('minutes');
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('TMDB_API_KEY is not set');
  }
  const params = new URLSearchParams(search);
  params.set('api_key', apiKey);
  const url = `${TMDB_BASE}/${path}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB responded ${res.status}`);
  }
  return res.json();
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const search = req.nextUrl.searchParams.toString();
  try {
    const data = await fetchFromTmdb(path.join('/'), search);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const status = /TMDB responded (\d+)/.exec(message)?.[1];
    return NextResponse.json(
      { error: message },
      { status: status ? Number(status) : 500 }
    );
  }
}
