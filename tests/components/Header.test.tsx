import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSearch } from '@/hooks/useSearch';
import Header from '@/components/Header/Header';
import ThemeContextProvider from '@/context/ThemeContext';
import UserContextProvider from '@/context/UserContext';
import type { Movie } from '@/types/tmdb';

vi.mock('@/hooks/useSearch', () => ({
  useSearch: vi.fn().mockReturnValue({ results: [] as Movie[], loading: false }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const renderHeader = () =>
  render(
    <ThemeContextProvider>
      <UserContextProvider>
        <Header />
      </UserContextProvider>
    </ThemeContextProvider>,
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

  it('toggles dark mode when theme toggle clicked', () => {
    renderHeader();
    const toggle = document.querySelector('[class*="themeToggle"]');
    expect(toggle).toBeTruthy();
    if (toggle) fireEvent.click(toggle);
    expect(localStorage.getItem('darkMode')).toBe(JSON.stringify(false));
  });

  it('shows search results when query non-empty', async () => {
    (useSearch as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      results: [{ id: 1, title: 'Result', backdrop_path: '/a.jpg' } as Movie],
      loading: false,
    });
    renderHeader();
    const input = screen.getByPlaceholderText('Search movies...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'avengers' } });
    await waitFor(() => expect(screen.getByText('Result')).toBeInTheDocument());
  });
});
