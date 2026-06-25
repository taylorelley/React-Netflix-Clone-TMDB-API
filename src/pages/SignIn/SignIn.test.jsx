import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import SignIn from './SignIn';
import ThemeContextProvider from '../../context/ThemeContext';
import UserContextProvider from '../../context/UserContext';

vi.mock('axios');

beforeEach(() => {
  localStorage.clear();
  axios.post.mockReset();
});

const renderSignIn = () =>
  render(
    <MemoryRouter>
      <ThemeContextProvider>
        <UserContextProvider>
          <SignIn />
        </UserContextProvider>
      </ThemeContextProvider>
    </MemoryRouter>
  );

describe('SignIn', () => {
  it('renders email + password inputs', () => {
    renderSignIn();
    expect(screen.getByPlaceholderText('Enter Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
  });

  it('submit posts credentials to /users/login', async () => {
    axios.post.mockResolvedValue({ data: { token: 'tk' } });
    renderSignIn();
    fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'a@b.c' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'pw' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(axios.post.mock.calls[0][1]).toEqual({ email: 'a@b.c', password: 'pw' });
  });

  it('stores token in localStorage on success', async () => {
    axios.post.mockResolvedValue({ data: { token: 'mytoken' } });
    renderSignIn();
    fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'a@b.c' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'pw' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    await waitFor(() => expect(localStorage.getItem('token')).toBe('mytoken'));
  });

  it('shows already-loggedin when token set', () => {
    localStorage.setItem('token', 'preset');
    render(
      <MemoryRouter>
        <ThemeContextProvider>
          <UserContextProvider>
            <SignIn />
          </UserContextProvider>
        </ThemeContextProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/already loggedin/)).toBeInTheDocument();
  });

  it('handles login error gracefully', async () => {
    const err = new Error('network down');
    axios.post.mockRejectedValueOnce(err);
    const errSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    renderSignIn();
    fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'a@b.c' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'pw' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(errSpy).toHaveBeenCalledWith(err);
    errSpy.mockRestore();
  });

  it('uses light class names when darkMode is false', () => {
    localStorage.setItem('darkMode', JSON.stringify(false));
    const { container } = renderSignIn();
    expect(container.querySelector('.signup-light')).toBeTruthy();
    expect(container.querySelector('.input-wrapper-light')).toBeTruthy();
  });
});