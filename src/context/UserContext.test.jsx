import { describe, it, expect, beforeEach } from 'vitest';
import React, { useContext } from 'react';
import { render, screen, act, renderHook } from '@testing-library/react';
import UserContextProvider, { UserContext } from './UserContext';

beforeEach(() => {
  localStorage.clear();
});

const wrapper = ({ children }) => <UserContextProvider>{children}</UserContextProvider>;
const useCtx = () => useContext(UserContext);

describe('UserContextProvider', () => {
  it('default values', () => {
    const { result } = renderHook(useCtx, { wrapper });
    expect(result.current.user).toBe('');
    // token starts as '' but useEffect overwrites with localStorage.getItem('token') which is null when missing
    expect(['', null]).toContain(result.current.token);
  });

  it('reads userInfo from localStorage on mount', () => {
    const userData = { _id: 'u1', email: 'a@b.c', username: 'alice' };
    localStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('token', 'abc123');
    const { result } = renderHook(useCtx, { wrapper });
    expect(result.current.user).toEqual(userData);
    expect(result.current.token).toBe('abc123');
  });

  it('exposes setUser and setToken', () => {
    const { result } = renderHook(useCtx, { wrapper });
    act(() => result.current.setUser({ _id: 'x' }));
    act(() => result.current.setToken('tk'));
    expect(result.current.user).toEqual({ _id: 'x' });
    expect(result.current.token).toBe('tk');
  });

  it('renders children', () => {
    render(
      <UserContextProvider>
        <div data-testid="child">ok</div>
      </UserContextProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});