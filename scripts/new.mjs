// Add content without touching code: `npm run new`, answer the prompts, then `npm run dev` to check it.
//   post     a full post on this site     -> content/posts/<slug>.md
//   link     a post that lives elsewhere  -> content/notes.json
//   project  a project                    -> content/projects.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = (...p) => path.join(root, 'content', ...p);

export const slugify = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-');

// The site's house style bans em and en dashes; swap them for a comma or "to".
const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);
export const undash = (s) =>
  s
    .replace(new RegExp(`\\s*${EM}\\s*`, 'g'), ', ')
    .replace(new RegExp(`(\\d)\\s*${EN}\\s*(\\d)`, 'g'), '$1 to $2')
    .replace(new RegExp(`\\s*${EN}\\s*`, 'g'), ', ');

const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
const today = () => new Date().toISOString().slice(0, 10);

async function main() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = async (q, fallback = '') => undash((await rl.question(fallback ? `${q} [${fallback}]: ` : `${q}: `)).trim()) || fallback;
  const need = async (q, check = Boolean, fallback) => {
    for (;;) {
      const a = await ask(q, fallback);
      if (check(a)) return a;
      console.log('  That does not look right, try again.');
    }
  };

  const kind = await need('What are you adding? post / link / project', (a) => ['post', 'link', 'project'].includes(a), 'post');

  if (kind === 'post') {
    const title = await need('Title');
    const slug = await need('URL slug', (s) => /^[a-z0-9-]+$/.test(s) && !fs.existsSync(file('posts', `${s}.md`)), slugify(title));
    const date = await need('Date (YYYY-MM-DD)', isDate, today());
    console.log('Write the post. Blank line between paragraphs; *italic*, **bold**, [link](https://...). End with a line containing only a dot.');
    const lines = [];
    for (let l; (l = await rl.question('')) !== '.'; ) lines.push(undash(l));
    fs.writeFileSync(file('posts', `${slug}.md`), `---\ntitle: ${title}\ndate: ${date}\n---\n\n${lines.join('\n').trim()}\n`);
    console.log(`Saved content/posts/${slug}.md. It shows at /notes/${slug}/ and in Writing.`);
  }

  if (kind === 'link') {
    const notes = JSON.parse(fs.readFileSync(file('notes.json'), 'utf8'));
    const title = await need('Title');
    const href = await need('Link (https://...)', (u) => /^https:\/\/\S+$/.test(u));
    const date = await need('Date (YYYY-MM-DD)', isDate, today());
    const tags = (await ask('Tags, comma separated', 'linkedin')).split(',').map((t) => t.trim()).filter(Boolean);
    let id = slugify(title);
    while (notes.some((n) => n.id === id)) id += '-2';
    notes.unshift({ id, title, date, href, tags });
    fs.writeFileSync(file('notes.json'), JSON.stringify(notes, null, 2) + '\n');
    console.log('Added to content/notes.json.');
  }

  if (kind === 'project') {
    const projects = JSON.parse(fs.readFileSync(file('projects.json'), 'utf8'));
    const title = await need('Full title');
    const id = await need('Id', (s) => /^[a-z0-9-]+$/.test(s) && !projects.some((p) => p.id === s), slugify(title));
    const short = await need('Short name for the index (about 25 characters)', (s) => s.length <= 32);
    const kindLine = await need('Kind of work, e.g. "Hockey, projective geometry"');
    const en = await need('One-paragraph description');
    const fr = await ask('French description (optional)');
    const image = await need('Image path in public/, e.g. /img/goalie.jpg', (p) => fs.existsSync(path.join(root, 'public', p)));
    const links = [];
    for (;;) {
      const label = await ask('Link label (Report, GitHub, Visit site), blank to finish');
      if (!label) break;
      links.push({ label, href: await need(`  ${label} URL`, (u) => /^https:\/\/\S+$/.test(u)) });
    }
    const status = links.length ? '' : 'In progress';
    const at = Number(await ask('Position in the list (1 = top)', '1')) - 1;
    projects.splice(Math.max(0, at), 0, {
      id, title: { en: title }, short, kind: kindLine, featured: false,
      description: { en, ...(fr && { fr }) }, tags: [], links, image, status,
    });
    fs.writeFileSync(file('projects.json'), JSON.stringify(projects, null, 2) + '\n');
    console.log('Added to content/projects.json.');
  }

  rl.close();
  console.log('Preview with `npm run dev`, then commit and push to main to publish.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
