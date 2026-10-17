import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, undash } from './new.mjs';

const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);

test('slugify', () => {
  assert.equal(slugify('"What will you do with that degree?"'), 'what-will-you-do-with-that-degree');
  assert.equal(slugify('Cafe  au lait'), 'cafe-au-lait');
});

test('undash removes em and en dashes', () => {
  assert.equal(undash(`Goalies ${EM} fast`), 'Goalies, fast');
  assert.equal(undash(`2023${EN}2024`), '2023 to 2024');
  const out = undash(`a ${EN} b ${EM} c`);
  assert.ok(!out.includes(EN) && !out.includes(EM));
});
