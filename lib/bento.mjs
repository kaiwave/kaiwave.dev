// Card sizes for any number of projects, so the grid never leaves a hole.
// Desktop (3 columns): the first card is wide and the second tall when there are 4 or more,
// then rows of three; a leftover single becomes full width, a leftover pair becomes wide + single.
// Tablet (2 columns): the first card spans the row, and the last does too if the rest is odd.
export function bento(n) {
  const desk = Array(n).fill('');
  let start = 0;
  if (n >= 4) {
    desk[0] = 'wide';
    desk[1] = 'tall';
    start = 4;
  }
  const left = (n - start) % 3;
  if (left === 1) desk[n - 1] = 'full';
  if (left === 2) desk[n - 2] = 'wide';

  const tab = Array(n).fill('');
  if (n) tab[0] = 'twide';
  if (n > 1 && (n - 1) % 2) tab[n - 1] = 'twide';

  return desk.map((d, i) => [d, tab[i]].filter(Boolean).join(' '));
}

// Desktop cells used, counting wide as 2, tall as 2 and full as 3. Used by the test.
export const cells = (classes) =>
  classes.reduce((s, c) => s + (c.includes('full') ? 3 : c.includes('wide') && !c.startsWith('twide') ? 2 : c.includes('tall') ? 2 : 1), 0);
