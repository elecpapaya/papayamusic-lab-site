import assert from 'node:assert/strict';
import test from 'node:test';

import { categorizeOperatingSystem, createFunnelPayload } from './funnelAnalytics.js';

test('creates a bounded funnel payload without URL queries', () => {
  assert.deepEqual(createFunnelPayload('cta_click', { placement: 'hero-pilot' }, {
    language: 'ko-KR',
    path: '/ko/?email=private@example.com#form',
  }), {
    eventName: 'cta_click',
    language: 'ko',
    path: '/ko/',
    properties: { placement: 'hero-pilot' },
  });
});

test('rejects arbitrary properties and normalizes OS choices to categories', () => {
  assert.equal(createFunnelPayload('page_view', { email: 'private@example.com' }, {
    language: 'en',
    path: '/en/',
  }), null);
  assert.equal(categorizeOperatingSystem('Windows 11'), 'windows_11');
  assert.equal(categorizeOperatingSystem('private value'), '');
});
