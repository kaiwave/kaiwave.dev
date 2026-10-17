'use client';
import { useEffect, useState } from 'react';

const palette = ['orange', 'pink', 'yellow', 'blue', 'green', 'coral', 'mint'];

// A word that takes a random colour from the palette on each visit.
export default function PaletteWord({ children }) {
  const [c, setC] = useState(null);
  useEffect(() => setC(palette[Math.floor(Math.random() * palette.length)]), []);
  return <span className={`palette-word${c ? ` c-${c}` : ''}`}>{children}</span>;
}
