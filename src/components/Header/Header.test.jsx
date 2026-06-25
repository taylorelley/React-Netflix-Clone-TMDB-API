import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import ThemeContextProvider from '../../context/ThemeContext';
import UserContextProvider from '../../context/UserContext';

vi.mock('../../hooks/useSearch', () => ({
  useSearch: vi.fn().mockReturnValue({ results: [], loading: false }),
}));

const renderHeader = () =>
  render(
    <MemoryRouter>
      <ThemeContextProvider>
        <UserContextProvider>
          <Header />
        </UserContextProvider>
      </ThemeContextProvider>
    </MemoryRouter>
  );

beforeEach(() => {
  localStorage.clear();
});

describe('Header', () => {
  it('renders logo link', () => {
    renderHeader();
    expect(screen.getByText('Netflix')).toBeInTheDocument();
  });

  it('renders search input', () => {
    renderHeader();
    expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument();
  });

  it('toggles dark mode when theme icon clicked', () => {
    renderHeader();
    const icons = document.querySelectorAll('.theme-icon');
    expect(icons.length).toBeGreaterThan(0);
    fireEvent.click(icons[0]);
    expect(localStorage.getItem('darkMode')).toBe(JSON.stringify(false));
  });

  it('shows search results when query non-empty', async () => {
    const { useSearch } = await import('../../hooks/useSearch');
    useSearch.mockReturnValue({
      results: [{ id: 1, title: 'Result', backdrop_path: '/a.jpg' }],
      loading: false,
    });
    renderHeader();
    const input = screen.getByPlaceholderText('Search movies...');
    fireEvent.change(input, { target: { value: 'avengers' } });
    await waitFor(() => expect(screen.getByText('Result')).toBeInTheDocument());
  });
});