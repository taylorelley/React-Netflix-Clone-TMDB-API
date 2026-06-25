import { type ReactNode } from 'react';
import ThemeContextProvider from './ThemeContext';
import UserContextProvider from './UserContext';

/**
 * Combines all context providers into a single wrapper.
 */
export default function CombinedContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeContextProvider>
      <UserContextProvider>{children}</UserContextProvider>
    </ThemeContextProvider>
  );
}
