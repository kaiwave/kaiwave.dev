'use client';
import { useEffect } from 'react';

// Background dots shy away from the mouse: within REACH px they grow a little and drift off.
// Uses `transform`, which stacks on top of the float animation's `translate`; CSS eases the change.
const REACH = 160;
const PUSH = 26;
const GROW = 0.45;

export default function Pucks() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pucks = [...document.querySelectorAll('.puck')];
    let frame = 0;
    let x = -1e4;
    let y = -1e4;

    const update = () => {
      frame = 0;
      // Read every position first, then write, so the browser lays out once per frame.
      const rects = pucks.map((el) => el.getBoundingClientRect());
      rects.forEach((r, i) => {
        const dx = r.x + r.width / 2 - x;
        const dy = r.y + r.height / 2 - y;
        const d = Math.hypot(dx, dy) || 1;
        const near = Math.max(0, 1 - d / REACH);
        pucks[i].style.transform = near
          ? `translate(${(dx / d) * PUSH * near}px, ${(dy / d) * PUSH * near}px) scale(${1 + GROW * near})`
          : '';
      });
    };
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      frame ||= requestAnimationFrame(update);
    };
    const onLeave = () => {
      x = y = -1e4;
      frame ||= requestAnimationFrame(update);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
