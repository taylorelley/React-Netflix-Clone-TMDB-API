import type { NextConfig } from 'next';

/**
 * Next.js 16 configuration.
 * - cacheComponents: opt-in to `use cache` for server-side caching.
 * - images.remotePatterns: allow TMDB image hosts to be served via next/image.
 */
const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org', pathname: '/t/p/**' },
    ],
  },
};

export default nextConfig;
