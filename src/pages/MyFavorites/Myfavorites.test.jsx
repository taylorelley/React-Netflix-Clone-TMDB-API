import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MyFavorites from './Myfavorites';
import UserContextProvider from '../../context/UserContext';

vi.mock('axios');

beforeEach(() => {
  localStorage.clear();
  axios.get.mockReset();
  axios.get.mockResolvedValue({ data: { favorites: [] } });
});

const renderFav = ({ token = '', user = null } = {}) => {
  if (token) localStorage.setItem('token', token);
  if (user) localStorage.setItem('userInfo', JSON.stringify(user));
  return render(
    <MemoryRouter>
      <UserContextProvider>
        <MyFavorites />
      </UserContextProvider>
    </MemoryRouter>
  );
};

describe('MyFavorites', () => {
  it('shows signin prompt when no token', () => {
    renderFav();
    expect(screen.getByText(/Signin to save movies/)).toBeInTheDocument();
  });

  it('fetches favorites when token + user present', async () => {
    renderFav({ token: 'tk', user: { _id: 'u1' } });
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
  });

  it('renders MovieCards when favorites returned', async () => {
    axios.get.mockResolvedValue({
      data: {
        favorites: [
          { movie: [{ _id: 'm1', title: 'Fav Movie', poster_path: '/f.jpg', vote_average: 7 }] },
        ],
      },
    });
    renderFav({ token: 'tk', user: { _id: 'u1' } });
    await waitFor(() => expect(screen.getByText('Fav Movie')).toBeInTheDocument());
  });

  it('handles fetch error gracefully', async () => {
    const err = new Error('server down');
    axios.get.mockRejectedValueOnce(err);
    const errSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    renderFav({ token: 'tk', user: { _id: 'u1' } });
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(errSpy).toHaveBeenCalledWith(err);
    errSpy.mockRestore();
  });
});