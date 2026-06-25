'use client';

import { useState, useContext, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import { ThemeContext } from '@/context/ThemeContext';
import styles from './SignIn.module.css';

export default function SignIn() {
  const router = useRouter();
  const userCtx = useContext(UserContext);
  const themeCtx = useContext(ThemeContext);
  const setUser = userCtx?.setUser ?? (() => {});
  const token = userCtx?.token ?? '';
  const setToken = userCtx?.setToken ?? (() => {});
  const darkMode = themeCtx?.darkMode ?? true;
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSignIn = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error(`Login failed: ${res.status}`);
      }
      const data = (await res.json()) as { token: string; [k: string]: unknown };
      setUser(data as never);
      setToken(data.token);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('token', data.token);
        window.localStorage.setItem('userInfo', JSON.stringify(data));
      }
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const containerClass = darkMode
    ? styles.signupContainer
    : `${styles.signupContainer} ${styles.signupLight}`;
  const inputClass = darkMode
    ? styles.inputWrapper
    : `${styles.inputWrapper} ${styles.inputWrapperLight}`;

  return (
    <div className={containerClass}>
      {token ? (
        <p>You are already logged in.</p>
      ) : (
        <form className={styles.signupForm} onSubmit={handleSignIn}>
          <div className={styles.titleContainer}>
            <h1>Sign In</h1>
            <p>Please fill in this form to login.</p>
          </div>
          <div className={inputClass}>
            <label htmlFor="email">Email</label>
            <input
              value={email}
              type="email"
              placeholder="Enter Email"
              name="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={inputClass}>
            <label htmlFor="psw">Password</label>
            <input
              value={password}
              type="password"
              placeholder="Enter Password"
              name="psw"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? <p className={styles.successMessage}>{error}</p> : null}
          <div className={styles.buttonContainer}>
            <button type="reset" className={styles.cancelbtn}>
              Cancel
            </button>
            <button type="submit" className={styles.signupbtn}>
              Sign In
            </button>
          </div>
          <p>
            Don&apos;t have an account? <Link href="/signup">Signup</Link>
          </p>
        </form>
      )}
    </div>
  );
}
