import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildEmailText,
  handleRequest,
  purgeExpiredFunnelEvents,
  validateFunnelEvent,
  validateSubmission,
} from '../src/index.js';

const now = 1_800_000_000_000;

function validContact(overrides = {}) {
  return {
    formType: 'contact',
    language: 'ko',
    startedAt: now - 10_000,
    website: '',
    turnstileToken: 'token',
    name: 'Papaya Listener',
    email: 'listener@example.com',
    inquiryType: 'Partnership',
    message: 'Hello from the contact form.',
    ...overrides,
  };
}

function validPilot(overrides = {}) {
  return {
    formType: 'pilot',
    language: 'en',
    startedAt: now - 10_000,
    website: '',
    turnstileToken: 'token',
    name: 'Catalog Operator',
    email: 'operator@example.com',
    operatingSystem: 'Windows 11',
    bottleneck: 'Release candidates are spread across folders and notes.',
    sourcePath: '/en/pilot/',
    sourceReferrer: 'https://example.com/production-guide',
    campaign: 'source=newsletter · medium=email · campaign=founder-pilot',
    evidenceConsent: 'yes',
    ...overrides,
  };
}

test('validates and normalizes a contact submission', () => {
  const result = validateSubmission(validContact({ email: 'LISTENER@EXAMPLE.COM' }), now);
  assert.equal(result.ok, true);
  assert.equal(result.spam, false);
  assert.equal(result.values.email, 'listener@example.com');
});

test('silently accepts honeypot submissions without delivery', () => {
  const result = validateSubmission(validContact({ website: 'https://spam.example' }), now);
  assert.deepEqual(result, { ok: true, spam: true, formType: 'contact' });
});

test('rejects too many links and oversized fields', () => {
  const links = 'https://a.example https://b.example https://c.example https://d.example';
  assert.equal(validateSubmission(validContact({ message: links }), now).error, 'too_many_links');
  assert.equal(validateSubmission(validContact({ name: 'x'.repeat(101) }), now).error, 'invalid_submission');
});

test('requires a target operating system for pilot applications', () => {
  assert.equal(validateSubmission(validPilot(), now).ok, true);
  assert.equal(validateSubmission(validPilot({ operatingSystem: '' }), now).error, 'invalid_submission');
  assert.equal(validateSubmission(validPilot({ evidenceConsent: '' }), now).ok, true);
  assert.equal(validateSubmission(validPilot({ evidenceConsent: 'publish everything' }), now).error, 'invalid_submission');
});

test('records sanitized lead context without counting the referrer against user links', () => {
  const message = 'https://a.example https://b.example https://c.example';
  const submission = validateSubmission(validContact({
    message,
    sourcePath: '/ko/contact/',
    sourceReferrer: 'https://partner.example/article',
    campaign: 'source=partner',
  }), now);

  assert.equal(submission.ok, true);
  const email = buildEmailText(submission);
  assert.match(email, /Source page:\n\/ko\/contact\//);
  assert.match(email, /Campaign:\nsource=partner/);
});

test('builds a plain-text message with reply details', () => {
  const submission = validateSubmission(validContact(), now);
  const email = buildEmailText(submission);
  assert.match(email, /Website inquiry/);
  assert.match(email, /Reply email:\nlistener@example\.com/);
  assert.doesNotMatch(email, /<html/i);
});

test('blocks requests from unapproved origins', async () => {
  const request = new Request('https://contact-api.papayamusiclab.com/config', {
    headers: { origin: 'https://attacker.example' },
  });
  const response = await handleRequest(request, {
    ALLOWED_ORIGINS: 'https://papayamusiclab.com',
  });
  assert.equal(response.status, 403);
});

test('returns the public Turnstile key only to an approved origin', async () => {
  const request = new Request('https://contact-api.papayamusiclab.com/config', {
    headers: { origin: 'https://papayamusiclab.com' },
  });
  const response = await handleRequest(request, {
    ALLOWED_ORIGINS: 'https://papayamusiclab.com',
    TURNSTILE_SITE_KEY: 'public-site-key',
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true, siteKey: 'public-site-key' });
});

test('accepts only a small, non-identifying funnel event schema', () => {
  assert.deepEqual(validateFunnelEvent({
    eventName: 'cta_click',
    language: 'ko',
    path: '/ko/?email=private@example.com',
    properties: { placement: 'hero-pilot' },
  }), {
    ok: true,
    eventName: 'cta_click',
    language: 'ko',
    path: '/ko/',
    properties: { placement: 'hero-pilot' },
  });

  assert.equal(validateFunnelEvent({
    eventName: 'cta_click',
    language: 'ko',
    path: '/ko/',
    properties: { email: 'private@example.com' },
  }).error, 'invalid_event');
});

test('writes an approved funnel event to D1', async () => {
  const queries = [];
  const fakeDb = {
    prepare(sql) {
      const query = { sql, bindings: [] };
      queries.push(query);
      return {
        bind(...bindings) {
          query.bindings = bindings;
          return this;
        },
        async run() {
          return { success: true };
        },
      };
    },
  };
  const response = await handleRequest(new Request('https://contact-api.papayamusiclab.com/events', {
    method: 'POST',
    headers: {
      origin: 'https://papayamusiclab.com',
      'content-type': 'application/json',
      'cf-connecting-ip': '203.0.113.10',
    },
    body: JSON.stringify({
      eventName: 'pricing_view',
      language: 'en',
      path: '/en/',
      properties: {},
    }),
  }), {
    ALLOWED_ORIGINS: 'https://papayamusiclab.com',
    FUNNEL_RATE_LIMITER: { limit: async () => ({ success: true }) },
    FUNNEL_DB: fakeDb,
  });

  assert.equal(response.status, 204);
  assert.equal(queries.length, 2);
  assert.match(queries[0].sql, /INSERT INTO funnel_events/);
  assert.equal(queries[0].bindings[0], 'pricing_view');
  assert.match(queries[1].sql, /-90 days/);
});

test('purges funnel events older than 90 days', async () => {
  let sql = '';
  await purgeExpiredFunnelEvents({
    FUNNEL_DB: {
      prepare(value) {
        sql = value;
        return { run: async () => ({ success: true }) };
      },
    },
  });
  assert.match(sql, /-90 days/);
});
