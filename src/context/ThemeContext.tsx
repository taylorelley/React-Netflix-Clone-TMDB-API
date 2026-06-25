'use client';

import { useState, createContext, useEffect, type ReactNode } from 'react';
import type { ThemeContextType } from '@/types/context';

export const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = 'darkMode';

function readStored(): boolean | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === null ? null : (JSON.parse(raw) as boolean);
  } catch {
    return null;
  }
}

/**
 * Provides dark/light mode state, persisted to localStorage.
 */
export default function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const stored = readStored();
    if (stored !== null) setDarkMode(stored);
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>{children}</ThemeContext.Provider>
  );
}
