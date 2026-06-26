import { describe, it, expect, beforeEach } from 'vitest';
import { useContext, type ReactNode } from 'react';
import { render, screen, act, renderHook } from '@testing-library/react';
import UserContextProvider, { UserContext } from '@/context/UserContext';
import type { User } from '@/types/context';

beforeEach(() => {
  localStorage.clear();
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <UserContextProvider>{children}</UserContextProvider>
);
const useCtx = () => useContext(UserContext);

describe('UserContextProvider', () => {
  it('default values', async () => {
    const { result } = renderHook(useCtx, { wrapper });
    await act(async () => {});
    expect([null, '']).toContain(result.current?.user);
  });

  it('reads userInfo from localStorage on mount', async () => {
    const userData: User = { _id: 'u1', email: 'a@b.c', username: 'alice' };
    localStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('token', 'abc123');
    const { result } = renderHook(useCtx, { wrapper });
    await act(async () => {});
    expect(result.current?.user).toEqual(userData);
    expect(result.current?.token).toBe('abc123');
  });

  it('exposes setUser and setToken', () => {
    const { result } = renderHook(useCtx, { wrapper });
    act(() => result.current?.setUser({ _id: 'x', email: 'x@x.x', username: 'x' }));
    act(() => result.current?.setToken('tk'));
    expect(result.current?.user).toEqual({
      _id: 'x',
      email: 'x@x.x',
      username: 'x',
    });
    expect(result.current?.token).toBe('tk');
  });

  it('renders children', () => {
    render(
      <UserContextProvider>
        <div data-testid="child">ok</div>
      </UserContextProvider>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
