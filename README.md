# kaiwave.dev

My personal portfolio site. Live at [kaiwave.dev](https://kaiwave.dev).

A static Next.js site: `npm run build` exports plain HTML, CSS and JS to `out/`, and every push to `main` deploys it to GitHub Pages.

## Updating content

Everything you edit lives in `content/`. No code changes needed.

| What | Where |
| --- | --- |
| Projects (the colour cards) | `content/projects.json` |
| Posts written on this site | `content/posts/<slug>.md`, served at `/notes/<slug>/` |
| Posts that live on LinkedIn | `content/notes.json` |
| Every other word on the page: hero sentence and button, the statement, section titles, the About text (wrap a word in {braces} to colour it), the Boardsteals line, "say hello" and the email button, plus name, email, CV link, GitHub, LinkedIn, location and the record table | `content/site.json` |
| Boardsteals top five (updated automatically) | `content/boardsteals.json` |
| Pictures | `public/img/` (add a credit to `public/img/credits.json` for anything you did not take) |

The quickest way is the helper, which asks a few questions and writes the file for you:

```bash
npm run new
```

It handles `post`, `link` and `project`, and swaps out em and en dashes so the house style holds.

New projects need no code or demo: each one becomes a colour card. Order in `projects.json` is display order. The first `projects.showFirst` (4) show up front, the first two as a wide and a tall card; the rest open with "Show all". Sizes are worked out from the count, never random, so no grid ever has a hole. Filter buttons appear for any tag two or more projects share. Give a project an `image` and it shows on its card.

## Boardsteals, every Wednesday

The deploy workflow also runs every Wednesday at 7am Melbourne time (6am outside daylight saving). It pulls the newest week from `boardsteals.kaiwave.dev/data/picks_weekly.json`, keeps the top five, and redeploys. If the fetch fails or the season is over, the last good week stays up. Run it by hand from the Actions tab ("Run workflow") or locally:

```bash
npm run boardsteals
```

A post is Markdown with a small header:

```markdown
---
title: My new post
date: 2026-10-20
---

First paragraph, with *italic*, **bold** and [a link](https://example.com).

Second paragraph.
```

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # markdown, card grid, Boardsteals and helper checks
npm run build   # static export to out/
```

## Layout

```text
app/          page.jsx (the one-page site), notes/[slug] (post pages), globals.css
components/   Projects (cards, filters, show all), Boing (letter springs), Reveal (scroll entrances), PaletteWord
content/      all the words and data
lib/          content loading, Markdown, card grid sizes
public/       images, favicon, CNAME
scripts/      new.mjs (content helper), boardsteals.mjs (weekly pull)
```
