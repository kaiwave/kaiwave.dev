import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toBoard } from './boardsteals.mjs';

const player = (name, rating) => ({
  name,
  team: 'IND',
  position: 'QB',
  rating,
  main_stats: { expected_points: 30, actual_points: 10, total_opportunity: 40 },
});

test('takes the top five by rating', () => {
  const json = {
    meta: { is_season_active: true, season: 2026, current_week: 6 },
    players: [70, 95, 80, 60, 90, 85].map((r, i) => player(`P${i}`, r)),
  };
  const b = toBoard(json);
  assert.equal(b.week, 6);
  assert.deepEqual(
    b.players.map((p) => p.rating),
    [95, 90, 85, 80, 70]
  );
  assert.equal(b.players[0].pos, 'QB, IND');
});

test('keeps the old board when the season is over or data is broken', () => {
  assert.equal(toBoard({ meta: { is_season_active: false, current_week: 18 }, players: [] }), null);
  assert.equal(toBoard({ meta: { is_season_active: true, current_week: 2 }, players: [player('A', 'x')] }), null);
  assert.equal(toBoard(null), null);
});
