import assert from 'node:assert/strict';
import test from 'node:test';

import { setupProtectedForm } from './protectedForm.js';

test('requires a fresh Turnstile token after a failed submission', async () => {
  const originalDocument = globalThis.document;
  const originalFetch = globalThis.fetch;
  const originalFormData = globalThis.FormData;
  const originalWindow = globalThis.window;

  const submitButton = { disabled: true };
  const output = { textContent: '', dataset: {} };
  const widget = {};
  const startedAt = { value: '' };
  const listeners = new Map();
  const messages = {
    loading: 'loading',
    sending: 'sending',
    success: 'success',
    unavailable: 'unavailable',
    verificationRequired: 'verification required',
    verificationFailed: 'verification failed',
    rateLimited: 'rate limited',
    invalid: 'invalid',
    failed: 'failed',
  };
  const form = {
    dataset: {
      apiUrl: 'https://contact-api.example.com',
      formType: 'contact',
      language: 'en',
      fields: JSON.stringify({ name: 'Name' }),
      fieldOrder: JSON.stringify(['name']),
      messages: JSON.stringify(messages),
      summaryTitle: 'Contact',
    },
    querySelector(selector) {
      return {
        '[data-submit]': submitButton,
        '[data-copy]': null,
        '[data-output]': output,
        '[data-turnstile]': widget,
        'input[name="startedAt"]': startedAt,
      }[selector];
    },
    addEventListener(type, handler) {
      listeners.set(type, handler);
    },
    reportValidity() {
      return true;
    },
    reset() {},
  };

  let token = '';
  let resetCount = 0;
  let widgetOptions;
  let submitCalls = 0;

  try {
    globalThis.window = {
      matchMedia() {
        return { matches: true };
      },
      turnstile: {
        render(_widget, options) {
          widgetOptions = options;
          return 'contact-widget';
        },
        getResponse() {
          return token;
        },
        reset() {
          resetCount += 1;
          token = '';
        },
      },
    };
    globalThis.document = {
      querySelector() {
        return form;
      },
    };
    globalThis.FormData = class {
      constructor() {
        this.values = new Map([
          ['name', 'Papaya Listener'],
          ['cf-turnstile-response', token],
        ]);
      }

      get(name) {
        return this.values.get(name);
      }

      entries() {
        return this.values.entries();
      }
    };
    globalThis.fetch = async (url) => {
      if (String(url).endsWith('/config')) {
        return Response.json({ siteKey: 'public-site-key' });
      }
      submitCalls += 1;
      return Response.json({ success: false, error: 'unavailable' }, { status: 503 });
    };

    await setupProtectedForm('#contact-form');
    assert.equal(submitButton.disabled, true);
    assert.equal(widgetOptions.size, 'compact');

    token = 'first-token';
    widgetOptions.callback(token);
    assert.equal(submitButton.disabled, false);

    await listeners.get('submit')({ preventDefault() {} });
    assert.equal(submitCalls, 1);
    assert.equal(resetCount, 1);
    assert.equal(submitButton.disabled, true);
    assert.equal(output.textContent, messages.failed);

    token = 'second-token';
    widgetOptions.callback(token);
    assert.equal(submitButton.disabled, false);
    assert.equal(output.textContent, messages.failed);
  } finally {
    globalThis.document = originalDocument;
    globalThis.fetch = originalFetch;
    globalThis.FormData = originalFormData;
    globalThis.window = originalWindow;
  }
});
