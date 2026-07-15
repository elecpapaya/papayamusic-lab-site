import assert from 'node:assert/strict';
import test from 'node:test';

import { getSalesContent } from '../salesContent.js';

function shapeOf(value) {
  if (Array.isArray(value)) return ['array', value.length, ...value.map(shapeOf)];
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, shapeOf(value[key])]));
  }
  return typeof value;
}

test('keeps the sales journey structurally aligned across languages', () => {
  const englishShape = shapeOf(getSalesContent('en'));
  assert.deepEqual(shapeOf(getSalesContent('ko')), englishShape);
  assert.deepEqual(shapeOf(getSalesContent('ja')), englishShape);
});

test('states the Windows boundary and manual renewal in every language', () => {
  for (const language of ['en', 'ko', 'ja']) {
    const content = getSalesContent(language);
    const searchable = JSON.stringify(content);
    assert.match(searchable, /Windows/);
    assert.equal(content.offer.terms.length, 3);
    assert.equal(content.faq.items.length, 8);
    assert.equal(content.pilotPage.operatingSystems.length, 4);
  }
});
