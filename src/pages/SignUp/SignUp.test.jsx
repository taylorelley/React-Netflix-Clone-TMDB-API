import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import SignUp from './SignUp';
import ThemeContextProvider from '../../context/ThemeContext';

vi.mock('axios');

beforeEach(() => {
  axios.post.mockReset();
});

const renderSignUp = () =>
  render(
    <MemoryRouter>
      <ThemeContextProvider>
        <SignUp />
      </ThemeContextProvider>
    </MemoryRouter>
  );

describe('SignUp', () => {
  it('renders email, password, username inputs', () => {
    renderSignUp();
    expect(screen.getByPlaceholderText('Enter Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Username')).toBeInTheDocument();
  });

  it('submit posts to /users/signup', async () => {
    axios.post.mockResolvedValue({ data: { status: 200 } });
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'a@b.c' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'pw' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Username'), { target: { value: 'alice' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(axios.post.mock.calls[0][1]).toEqual({ email: 'a@b.c', password: 'pw', username: 'alice' });
  });

  it('setUsername state works (no setUserName bug)', () => {
    renderSignUp();
    const input = screen.getByPlaceholderText('Enter Username');
    fireEvent.change(input, { target: { value: 'bob' } });
    expect(input.value).toBe('bob');
  });

  it('form has onSubmit handler wired (handleSignUp)', async () => {
    axios.post.mockResolvedValue({ data: { status: 200 } });
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'a@b.c' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'pw' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Username'), { target: { value: 'alice' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });

  it('clears inputs on success', async () => {
    axios.post.mockResolvedValue({ data: { status: 200 } });
    renderSignUp();
    const email = screen.getByPlaceholderText('Enter Email');
    const pw = screen.getByPlaceholderText('Enter Password');
    const user = screen.getByPlaceholderText('Enter Username');
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

  it('shows alert on status 409 (existing email)', async () => {
    axios.post.mockResolvedValue({ data: { status: 409 } });
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'taken@b.c' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'pw' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Username'), { target: { value: 'bob' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('There is another user with that email. Try again'));
    alertSpy.mockRestore();
  });

  it('handles signup error gracefully', async () => {
    const err = new Error('server down');
    axios.post.mockRejectedValueOnce(err);
    const errSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    renderSignUp();
    fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'a@b.c' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'pw' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Username'), { target: { value: 'a' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(errSpy).toHaveBeenCalledWith(err);
    errSpy.mockRestore();
  });

  it('uses light class names when darkMode is false', () => {
    localStorage.setItem('darkMode', JSON.stringify(false));
    const { container } = renderSignUp();
    expect(container.querySelector('.signup-light')).toBeTruthy();
    expect(container.querySelector('.input-wrapper-light')).toBeTruthy();
  });
});