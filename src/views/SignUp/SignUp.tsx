'use client';

import { useState, useContext, type FormEvent } from 'react';
import Link from 'next/link';
import { ThemeContext } from '@/context/ThemeContext';
import styles from './SignUp.module.css';

export default function SignUp() {
  const themeCtx = useContext(ThemeContext);
  const darkMode = themeCtx?.darkMode ?? true;
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

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
      setPassword('');
      setEmail('');
      setUsername('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unknown error');
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
      <form className={styles.signupForm} onSubmit={handleSignUp}>
        <div className={styles.titleContainer}>
          <h1>Sign Up</h1>
          <p>Please fill in this form to create an account.</p>
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

        <div className={inputClass}>
          <label htmlFor="username">Username</label>
          <input
            value={username}
            type="text"
            placeholder="Enter Username"
            name="username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {message ? <p className={styles.successMessage}>{message}</p> : null}

        <div className={styles.buttonContainer}>
          <button type="reset" className={styles.cancelbtn}>
            Cancel
          </button>
          <button type="submit" className={styles.signupbtn}>
            Sign Up
          </button>
        </div>

        <p>
          Already have an account? <Link href="/signin">SignIn</Link>
        </p>
      </form>
    </div>
  );
}
