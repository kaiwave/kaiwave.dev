import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bento, cells } from './bento.mjs';

test('every project count fills whole rows on desktop and tablet', () => {
  for (let n = 1; n <= 20; n++) {
    const c = bento(n);
    assert.equal(c.length, n);
    assert.equal(cells(c) % 3, 0, `desktop holes at n=${n}: ${c}`);
    const tabletCells = c.reduce((s, x) => s + (x.includes('twide') ? 2 : 1), 0);
    assert.equal(tabletCells % 2, 0, `tablet holes at n=${n}`);
  }
});

test('seven projects: wide, tall, then rows of three', () => {
  assert.deepEqual(bento(7), ['wide twide', 'tall', '', '', '', '', '']);
});
