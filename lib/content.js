import fs from 'node:fs';
import path from 'node:path';
import { parsePost } from './markdown.mjs';
import { toShowcase } from './showcase.mjs';

// Imported (not read with fs) so the dev server watches them and reloads on every edit.
import site from '@/content/site.json';
import projects from '@/content/projects.json';
import showcaseJson from '@/content/showcase.json';
import notes from '@/content/notes.json';
import credits from '@/public/img/credits.json';
import qsengine from '@/content/qsengine.json';

export { site, projects, credits, qsengine };
export const showcase = toShowcase(showcaseJson);

const dir = path.join(process.cwd(), 'content');

export function getPost(slug) {
  return { slug, ...parsePost(fs.readFileSync(path.join(dir, 'posts', `${slug}.md`), 'utf8')) };
}

export const postSlugs = () =>
  fs.readdirSync(path.join(dir, 'posts')).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3));

// Posts written here plus links out to other sites, newest first. An outside post's first tag names where it lives.
export function allWriting() {
  const local = postSlugs().map((s) => {
    const p = getPost(s);
    return { id: s, title: p.title, date: p.date, href: `/notes/${s}/`, where: 'This site' };
  });
  const external = notes.map((n) => ({ ...n, where: n.tags?.[0] ?? 'Elsewhere' }));
  return [...local, ...external].sort((a, b) => b.date.localeCompare(a.date));
}

// Content is typed with straight apostrophes; show typographic ones.
const RSQUO = String.fromCharCode(0x2019);
export const typo = (s) => s.replace(/'/g, RSQUO);
