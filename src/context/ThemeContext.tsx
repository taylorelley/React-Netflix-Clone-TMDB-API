import { useState, createContext, useEffect, type ReactNode } from 'react';
import type { ThemeContextType } from '../types/context';

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: true,
  setDarkMode: () => {},
});

/**
 * Provides dark/light mode state, persisted to localStorage.
 */
export default function ThemeContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const theme = localStorage.getItem('darkMode');
    if (theme) {
      setDarkMode(JSON.parse(theme) as boolean);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
