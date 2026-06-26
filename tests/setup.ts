import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mock next/navigation globally — components use useRouter/usePathname
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock next/link as a plain anchor for tests
vi.mock('next/link', () => ({
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) =>
    React.createElement('a', { href, ...rest }, children),
}));

// Mock next/image as a plain <img> for tests
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
    onError,
    ...rest
  }: {
    src: string;
    alt: string;
    width?: number | string;
    height?: number | string;
    className?: string;
    onError?: () => void;
    [k: string]: unknown;
  }) =>
    React.createElement('img', {
      src,
      alt,
      width,
      height,
      className,
      onError,
      ...rest,
    }),
}));

// Mock react-player for jsdom (subpath imports don't resolve in tests)
vi.mock('react-player', () => {
  const ReactPlayer = vi.fn(({ url, controls }: { url: string; controls?: boolean }) =>
    React.createElement(
      'div',
      { 'data-testid': 'react-player', 'data-url': url, 'data-controls': String(!!controls) },
      'react-player',
    ),
  );
  return { default: ReactPlayer };
});
