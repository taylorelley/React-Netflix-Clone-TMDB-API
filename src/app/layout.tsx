import { Suspense, type ReactNode } from 'react';
import './globals.css';
import CombinedContextProvider from '@/context';
import Header from '@/components/Header/Header';

export const metadata = {
  title: 'Cinetrail',
  description: 'Browse popular, top-rated, and upcoming movies powered by TMDB.',
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
