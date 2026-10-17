import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePost, inline } from './markdown.mjs';

test('parses frontmatter and paragraphs', () => {
  const p = parsePost('---\ntitle: "Hi: there"\ndate: 2026-01-02\n---\n\nOne *two*.\n\nThree');
  assert.equal(p.title, '"Hi: there"');
  assert.equal(p.date, '2026-01-02');
  assert.deepEqual(p.paragraphs, ['One <em>two</em>.', 'Three']);
});

test('escapes html and only links http or root paths', () => {
  assert.equal(inline('<b> [x](javascript:alert(1))'), '&lt;b&gt; [x](javascript:alert(1))');
  assert.equal(inline('[gh](https://github.com)'), '<a href="https://github.com">gh</a>');
});

test('rejects a post without frontmatter', () => {
  assert.throws(() => parsePost('no meta'));
});
