// Tiny Markdown subset for posts: frontmatter, paragraphs, *italic*, **bold**, [links](url).
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, '<a href="$2">$1</a>');
}
