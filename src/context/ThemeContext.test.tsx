import { describe, it, expect, beforeEach } from 'vitest';
import { useContext, type ReactNode } from 'react';
import { render, screen, act, renderHook } from '@testing-library/react';
import ThemeContextProvider, { ThemeContext } from './ThemeContext';

beforeEach(() => {
  localStorage.clear();
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeContextProvider>{children}</ThemeContextProvider>
);
const useCtx = () => useContext(ThemeContext);

describe('ThemeContextProvider', () => {
  it('defaults darkMode to true when no localStorage entry', () => {
    const { result } = renderHook(useCtx, { wrapper });
    expect(result.current.darkMode).toBe(true);
  });

  it('reads darkMode from localStorage on mount', () => {
    localStorage.setItem('darkMode', JSON.stringify(false));
    const { result } = renderHook(useCtx, { wrapper });
    expect(result.current.darkMode).toBe(false);
  });

  it('setDarkMode updates state', () => {
    const { result } = renderHook(useCtx, { wrapper });
    act(() => result.current.setDarkMode(false));
    expect(result.current.darkMode).toBe(false);
  });

  it('renders children inside provider', () => {
    render(
      <ThemeContextProvider>
        <div data-testid="child">hello</div>
      </ThemeContextProvider>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
