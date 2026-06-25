export interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export interface User {
  _id: string;
  email: string;
  username: string;
  token?: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string;
  setToken: (token: string) => void;
}
