import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import './globals.css';
import 'lenis/dist/lenis.css';
import CombinedContextProvider from '@/context';
import Header from '@/components/Header/Header';
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll';

export const metadata: Metadata = {
  title: 'Netflix — Premium Movie Discovery',
  description:
    'An immersive cinematic experience for discovering popular, top-rated, and upcoming movies powered by TMDB.',
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png' }],
    shortcut: ['/icon.png'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CombinedContextProvider>
          <SmoothScroll>
            <Header />
            <Suspense>{children}</Suspense>
          </SmoothScroll>
        </CombinedContextProvider>
      </body>
    </html>
  );
}
