import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CombinedContextProvider from '@/context';

describe('CombinedContextProvider', () => {
  it('renders children inside both providers', () => {
    render(
      <CombinedContextProvider>
        <div data-testid="child">nested</div>
      </CombinedContextProvider>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
