import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toShowcase } from './showcase.mjs';

const player = (name, rating) => ({
  name,
  team: 'IND',
  position: 'QB',
  rating,
  main_stats: { expected_points: 30, actual_points: 10, total_opportunity: 40 },
});

test('pasted Boardsteals JSON becomes the top five cards', () => {
  const s = toShowcase({
    meta: { current_week: 6 },
    players: [70, 95, 80, 60, 90, 85, 'x'].map((r, i) => player(`P${i}`, r)),
  });
  assert.equal(s.title, 'Boardsteals, week 6');
  assert.deepEqual(
    s.cards.map((c) => c.badge),
    ['95', '90', '85', '80', '70']
  );
  assert.equal(s.cards[0].subtitle, 'QB, IND');
  assert.deepEqual(s.cards[0].rows[0], ['Expected pts', 30]);
});

test('generic cards pass straight through', () => {
  const cards = [{ title: 'A', rows: [['x', 1]] }];
  assert.deepEqual(toShowcase({ title: 'Launch week', cards }), { title: 'Launch week', cards });
});

test('anything else fails the build loudly', () => {
  assert.throws(() => toShowcase({ nope: true }));
});
