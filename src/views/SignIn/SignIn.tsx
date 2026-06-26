'use client';

import { useState, useContext, useRef, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
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
  const formRef = useRef<HTMLFormElement>(null);

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

  useEffect(() => {
    if (!formRef.current) return;
    gsap.fromTo(
      formRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.3 },
    );
    gsap.fromTo(
      formRef.current.querySelectorAll(`.${styles.inputGroup}`),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out', delay: 0.6 },
    );
  }, []);

  const containerClass = darkMode ? styles.container : `${styles.container} ${styles.light}`;

  return (
    <div className={containerClass}>
      <div className={styles.bgGradient} />
      {token ? (
        <div className={styles.alreadyLoggedIn}>
          <p>You are already logged in.</p>
        </div>
      ) : (
        <form ref={formRef} className={styles.form} onSubmit={handleSignIn}>
          <div className={styles.formHeader}>
            <h1>Welcome Back</h1>
            <p>Sign in to continue your cinematic journey</p>
          </div>

          <div className={styles.inputGroup}>
            <input
              value={email}
              type="email"
              placeholder=" "
              id="email"
              className={styles.input}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputLine} />
          </div>

          <div className={styles.inputGroup}>
            <input
              value={password}
              type="password"
              placeholder=" "
              id="psw"
              className={styles.input}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="psw" className={styles.label}>
              Password
            </label>
            <div className={styles.inputLine} />
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn}>
              Sign In
            </button>
          </div>

          <p className={styles.formFooter}>
            Don&apos;t have an account? <Link href="/signup">Create one</Link>
          </p>
        </form>
      )}
    </div>
  );
}
