'use client';

import { useState, useContext, useRef, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ThemeContext } from '@/context/ThemeContext';
import styles from './SignUp.module.css';

export default function SignUp() {
  const themeCtx = useContext(ThemeContext);
  const darkMode = themeCtx?.darkMode ?? true;
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSignUp = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });
      const data = (await res.json().catch(() => ({}))) as { status?: number };
      if (data.status === 409) {
        setMessage('There is another user with that email. Try again');
        return;
      }
      if (!res.ok) {
        setMessage(`Signup failed: ${res.status}`);
        return;
      }
      setPassword('');
      setEmail('');
      setUsername('');
      setMessage('Account created successfully!');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unknown error');
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
      <form ref={formRef} className={styles.form} onSubmit={handleSignUp}>
        <div className={styles.formHeader}>
          <h1>Create Account</h1>
          <p>Start your cinematic journey</p>
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

        <div className={styles.inputGroup}>
          <input
            value={username}
            type="text"
            placeholder=" "
            id="username"
            className={styles.input}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="username" className={styles.label}>
            Username
          </label>
          <div className={styles.inputLine} />
        </div>

        {message ? (
          <p className={message.includes('successfully') ? styles.success : styles.error}>
            {message}
          </p>
        ) : null}

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn}>
            Sign Up
          </button>
        </div>

        <p className={styles.formFooter}>
          Already have an account? <Link href="/signin">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
