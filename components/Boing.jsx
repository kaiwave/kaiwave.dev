'use client';
import { useEffect } from 'react';

// Hover a wordmark letter and it springs into its own pose, held until the mouse leaves; then it springs back.
// Touch and pen have no hover-off, so a tap toggles the pose instead. Each data-b value is a different pose.
// A damped spring moves every channel towards its target, so changes are smooth and interruptible.
// Channels: sx, sy = extra scale; rot, skew = degrees; ty = em.
const POSES = [
  { sy: 0.32, sx: -0.14 }, // k: stretched tall
  { sx: 0.1, sy: -0.42 }, // a: squashed flat
  { ty: -0.12, rot: -18 }, // i: hops and leans
  { skew: 16 }, // w: leans back
  { rot: 180 }, // a: upside down
  { ty: -0.3 }, // v: held high
  { sx: -0.28, sy: -0.28, ty: -0.22 }, // e: shrinks and floats
];
const CHANNELS = ['sx', 'sy', 'rot', 'skew', 'ty'];
const STIFF = 220;
const DAMP = 14;

export default function Boing() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const state = new Map(); // letter -> { held, ch: { [channel]: { x, v, to } } }
    const moving = new Set();
    let frame = 0;
    let last = 0;

    // Only the inner glyph moves; the letter box stays put as a steady hover target, so a letter
    // that moves out from under the cursor does not flicker between states.
    const draw = (el, ch) => {
      el.firstElementChild.style.transform = `translateY(${ch.ty.x}em) rotate(${ch.rot.x}deg) skewX(${ch.skew.x}deg) scale(${1 + ch.sx.x}, ${1 + ch.sy.x})`;
    };

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      for (const el of moving) {
        const { ch, held } = state.get(el);
        let busy = false;
        for (const c of Object.values(ch)) {
          c.v += (-STIFF * (c.x - c.to) - DAMP * c.v) * dt;
          c.x += c.v * dt;
          if (Math.abs(c.x - c.to) > 0.0005 || Math.abs(c.v) > 0.01) busy = true;
          else c.x = c.to;
        }
        draw(el, ch);
        if (!busy) {
          moving.delete(el);
          if (!held) el.firstElementChild.style.transform = '';
        }
      }
      frame = moving.size ? requestAnimationFrame(tick) : 0;
    };

    const hold = (el, held) => {
      if (el.getAnimations().some((a) => a.animationName === 'letter-in' && a.playState === 'running')) return;
      const pose = POSES[Number(el.dataset.b) % POSES.length];
      const s = state.get(el) ?? { held: false, ch: Object.fromEntries(CHANNELS.map((c) => [c, { x: 0, v: 0, to: 0 }])) };
      if (s.held === held) return;
      s.held = held;
      for (const c of CHANNELS) s.ch[c].to = s.held ? (pose[c] ?? 0) : 0;
      state.set(el, s);
      moving.add(el);
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    const letterOf = (e) => e.target.closest?.('.letter[data-b]');
    const onOver = (e) => e.pointerType === 'mouse' && letterOf(e) && hold(letterOf(e), true);
    const onOut = (e) => {
      const el = e.pointerType === 'mouse' && letterOf(e);
      if (el && !el.contains(e.relatedTarget)) hold(el, false);
    };
    const onTap = (e) => {
      const el = e.pointerType !== 'mouse' && letterOf(e);
      if (el) hold(el, !state.get(el)?.held);
    };
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);
    document.addEventListener('pointerup', onTap);
    return () => {
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('pointerup', onTap);
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
