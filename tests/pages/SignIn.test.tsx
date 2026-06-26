import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const pushMock = vi.fn();
let fetchMock: ReturnType<typeof vi.fn>;

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
  usePathname: () => '/signin',
  useSearchParams: () => new URLSearchParams(),
}));

import SignIn from '@/views/SignIn/SignIn';
import ThemeContextProvider from '@/context/ThemeContext';
import UserContextProvider from '@/context/UserContext';

beforeEach(() => {
  localStorage.clear();
  pushMock.mockReset();
  fetchMock = vi.fn();
  global.fetch = fetchMock as unknown as typeof fetch;
});

afterEach(() => {
  delete (global as { fetch?: unknown }).fetch;
});

const renderSignIn = () =>
  render(
    <ThemeContextProvider>
      <UserContextProvider>
        <SignIn />
      </UserContextProvider>
    </ThemeContextProvider>,
  );

describe('SignIn', () => {
  it('renders email + password inputs', () => {
    renderSignIn();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('submit posts credentials to /api/users/login', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ token: 'tk' }),
    });
    renderSignIn();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.c' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pw' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/users/login');
    expect(JSON.parse(init.body as string)).toEqual({ email: 'a@b.c', password: 'pw' });
  });

  it('stores token in localStorage on success', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ token: 'mytoken' }),
    });
    renderSignIn();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.c' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pw' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    await waitFor(() => expect(localStorage.getItem('token')).toBe('mytoken'));
  });

  it('shows already-loggedin when token set', () => {
    localStorage.setItem('token', 'preset');
    render(
      <ThemeContextProvider>
        <UserContextProvider>
          <SignIn />
        </UserContextProvider>
      </ThemeContextProvider>,
    );
    expect(screen.getByText(/already logged in/i)).toBeInTheDocument();
  });

  it('handles login error gracefully', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    });
    renderSignIn();
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.c' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pw' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText(/Login failed/)).toBeInTheDocument());
  });

  it('uses light class names when darkMode is false', async () => {
    localStorage.setItem('darkMode', JSON.stringify(false));
    const { container } = renderSignIn();
    await waitFor(() => {
      expect(container.querySelector('[class*="light"]')).toBeTruthy();
    });
  });
});
