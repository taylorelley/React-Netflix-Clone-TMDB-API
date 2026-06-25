import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

let fetchMock: ReturnType<typeof vi.fn>;

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/signup',
  useSearchParams: () => new URLSearchParams(),
}));

import SignUp from '@/views/SignUp/SignUp';
import ThemeContextProvider from '@/context/ThemeContext';

beforeEach(() => {
  localStorage.clear();
  fetchMock = vi.fn();
  global.fetch = fetchMock as unknown as typeof fetch;
});

afterEach(() => {
  delete (global as { fetch?: unknown }).fetch;
});

const renderSignUp = () =>
  render(
    <ThemeContextProvider>
      <SignUp />
    </ThemeContextProvider>
  );

describe('SignUp', () => {
  it('renders email, password, username inputs', () => {
    renderSignUp();
    expect(screen.getByPlaceholderText('Enter Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Username')).toBeInTheDocument();
  });

  it('submit posts to /api/users/signup', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ status: 200 }),
    });
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'a@b.c' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'pw' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Username'), { target: { value: 'alice' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/users/signup');
    expect(JSON.parse(init.body as string)).toEqual({ email: 'a@b.c', password: 'pw', username: 'alice' });
  });

  it('setUsername state works (no setUserName bug)', () => {
    renderSignUp();
    const input = screen.getByPlaceholderText('Enter Username') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'bob' } });
    expect(input.value).toBe('bob');
  });

  it('form has onSubmit handler wired (handleSignUp)', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ status: 200 }),
    });
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'a@b.c' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'pw' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Username'), { target: { value: 'alice' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });

  it('clears inputs on success', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ status: 200 }),
    });
    renderSignUp();
    const email = screen.getByPlaceholderText('Enter Email') as HTMLInputElement;
    const pw = screen.getByPlaceholderText('Enter Password') as HTMLInputElement;
    const user = screen.getByPlaceholderText('Enter Username') as HTMLInputElement;
    fireEvent.change(email, { target: { value: 'a@b.c' } });
    fireEvent.change(pw, { target: { value: 'pw' } });
    fireEvent.change(user, { target: { value: 'alice' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    await waitFor(() => {
      expect(email.value).toBe('');
      expect(pw.value).toBe('');
      expect(user.value).toBe('');
    });
  });

  it('shows message on status 409 (existing email)', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ status: 409 }),
    });
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'taken@b.c' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'pw' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Username'), { target: { value: 'bob' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    await waitFor(() =>
      expect(screen.getByText(/There is another user with that email/)).toBeInTheDocument()
    );
  });

  it('handles signup error gracefully', async () => {
    fetchMock.mockRejectedValue(new Error('server down'));
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'a@b.c' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'pw' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Username'), { target: { value: 'a' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });

  it('uses light class names when darkMode is false', async () => {
    localStorage.setItem('darkMode', JSON.stringify(false));
    const { container } = renderSignUp();
    await waitFor(() => {
      expect(container.querySelector('[class*="signupLight"]')).toBeTruthy();
    });
  });
});
