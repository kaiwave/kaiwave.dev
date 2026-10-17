// Pulls this week's top Boardsteals picks into content/boardsteals.json.
// Runs in the deploy workflow every Wednesday morning (Melbourne) and by hand with `npm run boardsteals`.
// If the fetch fails or the data looks wrong, the last good file is kept so the site still builds.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE = 'https://boardsteals.kaiwave.dev/data/picks_weekly.json';
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'content', 'boardsteals.json');

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

export function toBoard(json, count = 5) {
  const meta = json?.meta;
  if (!meta?.is_season_active || !Number.isInteger(meta.current_week)) return null;
  const players = (Array.isArray(json.players) ? json.players : [])
    .map((p) => ({
      name: String(p?.name ?? '').slice(0, 60),
      pos: `${String(p?.position ?? '').slice(0, 4)}, ${String(p?.team ?? '').slice(0, 4)}`,
      rating: num(p?.rating),
      expected: num(p?.main_stats?.expected_points),
      actual: num(p?.main_stats?.actual_points),
      opps: num(p?.main_stats?.total_opportunity),
    }))
    .filter((p) => p.name && [p.rating, p.expected, p.actual, p.opps].every((v) => v !== null))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, count);
  if (players.length < count) return null;
  return { season: meta.season, week: meta.current_week, updated: new Date().toISOString().slice(0, 10), players };
}

async function main() {
  try {
    const res = await fetch(SOURCE, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const board = toBoard(await res.json());
    if (!board) {
      console.log('Boardsteals: no active week or too few players, keeping the last board.');
      return;
    }
    fs.writeFileSync(out, JSON.stringify(board, null, 2) + '\n');
    console.log(`Boardsteals: wrote week ${board.week} of ${board.season}.`);
  } catch (err) {
    console.warn(`Boardsteals: fetch failed (${err.message}), keeping the last board.`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
