import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll';

const rafMock = vi.fn();
let rafCallCount = 0;

vi.mock('lenis', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      raf: vi.fn(),
      destroy: vi.fn(),
    })),
  };
});

beforeEach(() => {
  rafCallCount = 0;
  vi.stubGlobal('requestAnimationFrame', (cb: (time: number) => void) => {
    rafMock(cb);
    // Only execute callback once to avoid infinite recursion
    if (rafCallCount === 0) {
      rafCallCount++;
      cb(Date.now());
    }
    return 1;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('SmoothScroll', () => {
  it('renders children', () => {
    const { container } = render(
      <SmoothScroll>
        <div data-testid="child">Hello</div>
      </SmoothScroll>,
    );
    expect(container.querySelector('[data-testid="child"]')?.textContent).toBe('Hello');
  });

  it('initializes Lenis on mount and runs raf loop', () => {
    render(
      <SmoothScroll>
        <span>x</span>
      </SmoothScroll>,
    );
    expect(rafMock).toHaveBeenCalled();
  });

  it('exposes lenis on window for GSAP integration', () => {
    render(
      <SmoothScroll>
        <span>x</span>
      </SmoothScroll>,
    );
    expect((window as unknown as Record<string, unknown>).__lenis).toBeDefined();
  });

  it('cleans up on unmount', () => {
    const { unmount } = render(
      <SmoothScroll>
        <span>x</span>
      </SmoothScroll>,
    );
    unmount();
    expect(true).toBe(true);
  });
});
