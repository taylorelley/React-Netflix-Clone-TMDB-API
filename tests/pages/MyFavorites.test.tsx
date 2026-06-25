import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

let fetchMock: ReturnType<typeof vi.fn>;

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/myfavorites',
  useSearchParams: () => new URLSearchParams(),
}));

import MyFavorites from '@/views/MyFavorites/Myfavorites';
import UserContextProvider from '@/context/UserContext';

beforeEach(() => {
  localStorage.clear();
  fetchMock = vi.fn();
  global.fetch = fetchMock as unknown as typeof fetch;
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ favorites: [] }),
  });
});

afterEach(() => {
  delete (global as { fetch?: unknown }).fetch;
});

const renderFav = ({ token = '', user = null }: { token?: string; user?: { _id: string } | null } = {}) => {
  if (token) localStorage.setItem('token', token);
  if (user) localStorage.setItem('userInfo', JSON.stringify(user));
  return render(
    <UserContextProvider>
      <MyFavorites />
    </UserContextProvider>
  );
};

describe('MyFavorites', () => {
  it('shows signin prompt when no token', () => {
    renderFav();
    expect(screen.getByText(/Signin to save movies/)).toBeInTheDocument();
  });

  it('fetches favorites when token + user present', async () => {
    renderFav({ token: 'tk', user: { _id: 'u1' } });
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });

  it('renders MovieCards when favorites returned', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          favorites: [
            { movie: [{ _id: 'm1', title: 'Fav Movie', poster_path: '/f.jpg', vote_average: 7 }] },
          ],
        }),
    });
    renderFav({ token: 'tk', user: { _id: 'u1' } });
    await waitFor(() => expect(screen.getByText('Fav Movie')).toBeInTheDocument());
  });

  it('handles fetch error gracefully', async () => {
    fetchMock.mockRejectedValueOnce(new Error('server down'));
    renderFav({ token: 'tk', user: { _id: 'u1' } });
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });
});
