# kaiwave.dev

My personal portfolio site. Live at [kaiwave.dev](https://kaiwave.dev).

A static Next.js site. You never build by hand to publish: every push to `main` makes GitHub Actions install, test, build and deploy the site (about two minutes; watch it in the repo's Actions tab). If a test or the build fails, the live site stays as it was.

## Updating content

Everything you edit lives in `content/`. No code changes needed.

| What | Where |
| --- | --- |
| Projects (the colour cards) | `content/projects.json` |
| Posts written on this site | `content/posts/<slug>.md`, served at `/notes/<slug>/` |
| Posts that live on LinkedIn | `content/notes.json` |
| Every other word on the page: hero sentence and button, the statement, section titles, the About text (wrap a word in {braces} to colour it), the featured project's sentence, photo and button, "say hello" and the email button, plus name, email, CV link, GitHub, LinkedIn, location and the record table | `content/site.json` |
| The featured project's cards (Boardsteals' weekly picks) | `content/showcase.json` |
| Pictures | `public/img/` (add a credit to `public/img/credits.json` for anything you did not take) |

The quickest way is the helper, which asks a few questions and writes the file for you:

```bash
npm run new
```

It handles `post`, `link` and `project` (for a `link`, the first tag is where the post lives, such as LinkedIn or Medium, and the Writing list shows it), and swaps out em and en dashes so the house style holds.

New projects need no code or demo: each one becomes a colour card. Order in `projects.json` is display order. The first `projects.showFirst` (4) show up front, the first two as a wide and a tall card; the rest open with "Show all". Sizes are worked out from the count, never random, so no grid ever has a hole. Filter buttons appear for any tag two or more projects share. Give a project an `image` and it shows on its card.

A post is Markdown with a small header:

```markdown
---
title: My new post
date: 2026-10-20
---

First paragraph, with *italic*, **bold** and [a link](https://example.com).

Second paragraph.
```

## Swapping the featured project

The dark section with the cards over a photo shows one featured project. To replace Boardsteals with something new:

1. **Mark it.** In `content/projects.json`, set `"featured": true` on the new project and `false` on Boardsteals. Exactly one project is featured. Its first link becomes the section's button, and if it has a `code` field, that snippet shows as the last card. Move it to the top of the list if it should also lead the project grid.
   
2. **Write the words.** In `content/site.json`, under `showcase`: `text` (one sentence), `cta` (button label), `image` (a photo in `public/img/`, landscape, about 1920px wide) and `codeTitle` (the code card's heading). Credit the photo in `public/img/credits.json` if you did not take it.

3. **Give it cards.** Replace `content/showcase.json` with the generic format: a title and three to five cards, each with an optional badge and subtitle and any number of label/value rows.

```json
{
  "title": "Launch week",
  "cards": [
    {
      "badge": "98.2",
      "title": "First result",
      "subtitle": "What it is",
      "rows": [
        ["Metric", 12.4],
        ["Another", "3 of 5"]
      ]
    }
  ]
}
```

4. **Check and publish.** Run `npm run dev`, look at the section, then push to `main`.

To drop the featured section altogether, set every project to `"featured": false`. If the new project publishes its own JSON and you want to paste that unchanged too, add a converter for its format in `lib/showcase.mjs`.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # markdown, card grid, showcase and helper checks
npm run build   # static export to out/
```

## Layout

```text
app/          page.jsx (the one-page site), notes/[slug] (post pages), globals.css
components/   Projects (cards, filters, show all), Writing (posts, show older), Boing (letter springs), Pucks (background dots), Reveal (scroll entrances), PaletteWord
content/      all the words and data
lib/          content loading, Markdown, card grid sizes, showcase formats
public/       images, favicon, CNAME
scripts/      new.mjs (content helper)
```
