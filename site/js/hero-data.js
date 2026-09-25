/* ============================================================
   HERO STATS — "database"
   ============================================================
   The hero stat row on the homepage reads straight from this
   array and count-up animates whenever it scrolls into view.

   Fields:
     id       — unique key, used internally (don't need to touch)
     value    — a number to count up to, or null for non-numeric
     display  — only used when value is null (e.g. the ∞ symbol)
     labelKey — must match a key in the `translations` object in
                main.js (en + fr) so the label stays translatable
   ============================================================ */
window.heroStats = [
  { id: 'research', value: 1,    display: null, labelKey: 'researchrep' },
  { id: 'ongoing',  value: 3,    display: null, labelKey: 'ongoingrep' },
  { id: 'magic',    value: null, display: '∞',  labelKey: 'magicjoke' },
];
