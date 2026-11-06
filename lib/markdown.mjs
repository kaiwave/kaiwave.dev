// Tiny Markdown subset for posts: frontmatter, paragraphs, *italic*, **bold**, [links](url).
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// http(s) or root-relative URL; allows one level of brackets, as in Wikipedia's Foo_(bar).
const URL_PART = String.raw`(?:[^()\s]|\([^()\s]*\))`;
const LINK = new RegExp(String.raw`\[(.+?)\]\((https?:\/\/${URL_PART}+|\/${URL_PART}*)\)`, 'g');

export function parsePost(src) {
  const m = src.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error('Post is missing its --- frontmatter --- block');
  const meta = Object.fromEntries(
    m[1].split('\n').filter(Boolean).map((l) => {
      const i = l.indexOf(':');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
  );
  return { ...meta, paragraphs: m[2].split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map(inline) };
}

export function inline(text) {
  const urls = [];
  return esc(text)
    // Links first, with each URL parked as \0n\0 so the * rules below cannot touch it.
    .replace(LINK, (_, label, url) => `<a href="\0${urls.push(url) - 1}\0">${label}</a>`)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\0(\d+)\0/g, (_, i) => urls[i]);
}
