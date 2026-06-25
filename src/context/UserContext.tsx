import { useState, useEffect, createContext, type ReactNode } from 'react';
import type { User, UserContextType } from '../types/context';

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  token: '',
  setToken: () => {},
});

/**
 * Provides user auth state, persisted to localStorage.
 */
export default function UserContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (!stored) {
      localStorage.setItem('userInfo', '');
    } else {
      setUser(JSON.parse(stored) as User);
    }
    setToken(localStorage.getItem('token') ?? '');
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
}
