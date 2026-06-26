'use client';

import { useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

/**
 * Custom cinematic cursor with magnetic hover effects.
 * Renders a small dot + larger trailing circle.
 * Hides on touch devices.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const circle = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const ring = circleRef.current;
    if (!dot || !ring) return;

    let raf: number;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
    };

    const animate = () => {
      circle.current.x += (pos.current.x - circle.current.x) * 0.12;
      circle.current.y += (pos.current.y - circle.current.y) * 0.12;
      ring.style.transform = `translate(${circle.current.x - 20}px, ${circle.current.y - 20}px)`;
      raf = requestAnimationFrame(animate);
    };

    const hoveredClass = styles.hovered ?? 'hovered';

    const onEnterLink = () => {
      ring.classList.add(hoveredClass);
      dot.classList.add(hoveredClass);
    };
    const onLeaveLink = () => {
      ring.classList.remove(hoveredClass);
      dot.classList.remove(hoveredClass);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(animate);

    const addHover = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
        el.addEventListener('mouseenter', onEnterLink);
        el.addEventListener('mouseleave', onLeaveLink);
      });
    };

    addHover();
    const observer = new MutationObserver(addHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.dot} />
      <div ref={circleRef} className={styles.circle} />
    </>
  );
}
