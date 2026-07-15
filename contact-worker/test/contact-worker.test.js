import assert from 'node:assert/strict';
import test from 'node:test';

import { buildEmailText, handleRequest, validateSubmission } from '../src/index.js';

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
