'use client';
import { useEffect } from 'react';

// Adds .in to each [data-reveal] section once it scrolls into view. Without JS nothing is hidden.
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.classList.add('io');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          io.unobserve(e.target);
        }),
      { rootMargin: '0px 0px -12% 0px' }
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.classList.remove('io');
    };
  }, []);
  return null;
}
