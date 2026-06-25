import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import './globals.css';
import CombinedContextProvider from '@/context';
import Header from '@/components/Header/Header';

export const metadata: Metadata = {
  title: 'Cinetrail',
  description: 'Browse popular, top-rated, and upcoming movies powered by TMDB.',
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
          <Header />
          <Suspense>{children}</Suspense>
        </CombinedContextProvider>
      </body>
    </html>
  );
}
