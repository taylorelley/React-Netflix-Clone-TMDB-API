'use client';

import { useState, useEffect, createContext, type ReactNode } from 'react';
import type { User, UserContextType } from '@/types/context';

export const UserContext = createContext<UserContextType | null>(null);

const USER_KEY = 'userInfo';
const TOKEN_KEY = 'token';

function readUser(): User | '' {
  if (typeof window === 'undefined') return '';
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return '';
    return JSON.parse(raw) as User;
  } catch {
    return '';
  }
}

function readToken(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(TOKEN_KEY) || '';
}

/**
 * Provides user auth state, persisted to localStorage.
 */
export default function UserContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | ''>('');
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    setUser(readUser());
    setToken(readToken());
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: user === '' ? null : user,
        setUser: (u) => setUser(u ?? ''),
        token,
        setToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
