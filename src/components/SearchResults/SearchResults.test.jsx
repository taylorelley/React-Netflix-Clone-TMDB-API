import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchResults from './SearchResults';

const movie = { id: 7, title: 'Search Hit', backdrop_path: '/hit.jpg' };

const renderResult = (props = {}) =>
  render(
    <MemoryRouter>
      <SearchResults movie={movie} setQuery={() => {}} {...props} />
    </MemoryRouter>
  );

describe('SearchResults', () => {
  it('renders title', () => {
    renderResult();
    expect(screen.getByText('Search Hit')).toBeInTheDocument();
  });

  it('renders image', () => {
    const { container } = renderResult();
    expect(container.querySelector('img.result-img')).toBeTruthy();
  });

  it('calls setQuery with empty string on click', () => {
    const setQuery = vi.fn();
    const { container } = renderResult({ setQuery });
    fireEvent.click(container.querySelector('.search-results-item'));
    expect(setQuery).toHaveBeenCalledWith('');
  });

  it('falls back to noImage on image error', () => {
    const { container } = renderResult();
    const img = container.querySelector('img.result-img');
    fireEvent.error(img);
    expect(img.src).toContain('no-image');
  });
});