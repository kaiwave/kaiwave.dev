// content/showcase.json holds the featured project's cards. Two formats are accepted:
//   1. Generic: { "title": "...", "cards": [{ "badge", "title", "subtitle", "rows": [[label, value], ...] }] }
//   2. Boardsteals' own picks_weekly.json, pasted in unchanged; its top five become the cards.
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

export function toShowcase(json, count = 5) {
  if (Array.isArray(json?.cards)) return { title: String(json.title ?? ''), cards: json.cards };
  if (!Array.isArray(json?.players)) throw new Error('content/showcase.json needs "cards" or Boardsteals "players"');
  const cards = json.players
    .map((p) => ({
      name: String(p?.name ?? ''),
      pos: [p?.position, p?.team].filter(Boolean).join(', '),
      rating: num(p?.rating),
      rows: [
        ['Expected pts', num(p?.main_stats?.expected_points)],
        ['Actual pts', num(p?.main_stats?.actual_points)],
        ['Opportunities', num(p?.main_stats?.total_opportunity)],
      ],
    }))
    .filter((p) => p.name && p.rating !== null && p.rows.every(([, v]) => v !== null))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, count)
    .map((p) => ({ badge: String(p.rating), title: p.name, subtitle: p.pos, rows: p.rows }));
  const week = json.meta?.current_week;
  return { title: week ? `Boardsteals, week ${week}` : 'Boardsteals', cards };
}
