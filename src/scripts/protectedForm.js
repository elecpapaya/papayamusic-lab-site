import { trackFunnelEvent } from './funnelAnalytics.js';

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let turnstileScriptPromise;

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => resolve(window.turnstile), { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.append(script);
  });

  return turnstileScriptPromise;
}

function parseConfig(value, fallback = {}) {
  try {
    return JSON.parse(value || '');
  } catch {
    return fallback;
  }
}

function buildSummary(form, config) {
  const formData = new FormData(form);
  const rows = [config.summaryTitle, '', `Language: ${config.language}`, ''];
  for (const name of config.fieldOrder) {
    const value = String(formData.get(name) || '').trim();
    rows.push(`${config.fields[name] || name}:`, value || '-', '');
  }
  return rows.join('\n').trimEnd();
}

function setStatus(output, message, state = '') {
  output.textContent = message;
  output.dataset.state = state;
}

function cleanAttributionValue(value, maxLength = 500) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}

export function getLeadAttribution(locationLike, referrer = '') {
  const sourcePath = cleanAttributionValue(locationLike?.pathname || '/', 300) || '/';
  let sourceReferrer = '';

  if (referrer) {
    try {
      const referrerUrl = new URL(referrer, locationLike?.origin || undefined);
      sourceReferrer = cleanAttributionValue(`${referrerUrl.origin}${referrerUrl.pathname}`, 500);
    } catch {
      sourceReferrer = '';
    }
  }

  const params = new URLSearchParams(locationLike?.search || '');
  const campaign = [
    ['source', params.get('utm_source')],
    ['medium', params.get('utm_medium')],
    ['campaign', params.get('utm_campaign')],
  ]
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${cleanAttributionValue(value, 100)}`)
    .join(' · ');

  return { sourcePath, sourceReferrer, campaign };
}

function populateLeadAttribution(form) {
  const attribution = getLeadAttribution(window.location, document.referrer);
  for (const [name, value] of Object.entries(attribution)) {
    const input = form.querySelector(`input[name="${name}"]`);
    if (input) input.value = value;
  }
}

async function fetchTurnstileSiteKey(apiUrl) {
  const response = await fetch(`${apiUrl}/config`, {
    method: 'GET',
    headers: { accept: 'application/json' },
  });
  if (!response.ok) throw new Error('Turnstile configuration is unavailable.');
  const result = await response.json();
  if (!result.siteKey) throw new Error('Turnstile site key is missing.');
  return result.siteKey;
}

export async function setupProtectedForm(selector) {
  const form = document.querySelector(selector);
  if (!form) return;

  const submitButton = form.querySelector('[data-submit]');
  const copyButton = form.querySelector('[data-copy]');
  const output = form.querySelector('[data-output]');
  const widget = form.querySelector('[data-turnstile]');
  const startedAt = form.querySelector('input[name="startedAt"]');
  const config = {
    apiUrl: String(form.dataset.apiUrl || '').replace(/\/$/, ''),
    formType: form.dataset.formType,
    language: form.dataset.language,
    fields: parseConfig(form.dataset.fields),
    fieldOrder: parseConfig(form.dataset.fieldOrder, []),
    messages: parseConfig(form.dataset.messages),
    summaryTitle: form.dataset.summaryTitle || 'Form summary',
  };
  const compactVerification = Boolean(window.matchMedia?.('(max-width: 400px)').matches);

  let widgetId;
  let verificationReady = false;
  let preserveStatusOnNextVerification = false;

  const setVerificationReady = (ready) => {
    verificationReady = ready;
    submitButton.disabled = !ready;
  };

  const resetVerification = ({ preserveStatus = false } = {}) => {
    preserveStatusOnNextVerification = preserveStatus;
    setVerificationReady(false);
    if (window.turnstile && widgetId !== undefined) window.turnstile.reset(widgetId);
  };

  if (startedAt) startedAt.value = String(Date.now());
  populateLeadAttribution(form);
  setStatus(output, config.messages.loading, 'loading');

  try {
    const [siteKey, turnstile] = await Promise.all([
      fetchTurnstileSiteKey(config.apiUrl),
      loadTurnstileScript(),
    ]);
    widgetId = turnstile.render(widget, {
      sitekey: siteKey,
      action: config.formType,
      language: config.language,
      theme: 'auto',
      size: compactVerification ? 'compact' : 'flexible',
      callback: () => {
        setVerificationReady(true);
        if (preserveStatusOnNextVerification) {
          preserveStatusOnNextVerification = false;
        } else {
          setStatus(output, '', '');
        }
      },
      'error-callback': () => {
        setVerificationReady(false);
        setStatus(output, config.messages.verificationFailed, 'error');
        trackFunnelEvent('turnstile_failure', { formType: config.formType, outcome: 'challenge_error' });
      },
      'expired-callback': () => {
        setVerificationReady(false);
        setStatus(output, config.messages.verificationRequired, 'error');
        trackFunnelEvent('turnstile_failure', { formType: config.formType, outcome: 'expired' });
      },
      'timeout-callback': () => {
        setVerificationReady(false);
        setStatus(output, config.messages.verificationRequired, 'error');
        trackFunnelEvent('turnstile_failure', { formType: config.formType, outcome: 'timeout' });
      },
    });
    setVerificationReady(Boolean(turnstile.getResponse(widgetId)));
    setStatus(output, '', '');
  } catch {
    setVerificationReady(false);
    setStatus(output, config.messages.unavailable, 'error');
    trackFunnelEvent('turnstile_failure', { formType: config.formType, outcome: 'initialization' });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    if (!verificationReady) {
      setStatus(output, config.messages.verificationRequired, 'error');
      trackFunnelEvent('turnstile_failure', { formType: config.formType, outcome: 'not_ready' });
      return;
    }

    const formData = new FormData(form);
    const turnstileToken = String(formData.get('cf-turnstile-response') || '');
    if (!turnstileToken) {
      resetVerification();
      setStatus(output, config.messages.verificationRequired, 'error');
      trackFunnelEvent('turnstile_failure', { formType: config.formType, outcome: 'missing_token' });
      return;
    }

    const payload = Object.fromEntries(formData.entries());
    delete payload['cf-turnstile-response'];
    payload.formType = config.formType;
    payload.language = config.language;
    payload.turnstileToken = turnstileToken;

    submitButton.disabled = true;
    setStatus(output, config.messages.sending, 'loading');
    trackFunnelEvent('form_submit_attempt', { formType: config.formType });

    try {
      const response = await fetch(`${config.apiUrl}/submit`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        const key = result.error === 'rate_limited' ? 'rateLimited' :
          result.error === 'verification_failed' ? 'verificationFailed' :
            result.error === 'invalid_submission' || result.error === 'too_many_links' ? 'invalid' : 'failed';
        throw new Error(key);
      }

      form.reset();
      if (startedAt) startedAt.value = String(Date.now());
      populateLeadAttribution(form);
      resetVerification({ preserveStatus: true });
      const successMessage = config.formType === 'pilot' && config.messages.pilotSuccess
        ? config.messages.pilotSuccess
        : config.messages.success;
      setStatus(output, successMessage, 'success');
      trackFunnelEvent('form_submit_success', { formType: config.formType });
    } catch (error) {
      resetVerification({ preserveStatus: true });
      const key = error instanceof Error && config.messages[error.message] ? error.message : 'failed';
      setStatus(output, config.messages[key], 'error');
      trackFunnelEvent('form_submit_failure', { formType: config.formType, outcome: key });
    } finally {
      submitButton.disabled = !verificationReady;
    }
  });

  copyButton?.addEventListener('click', async () => {
    const summary = buildSummary(form, config);
    try {
      await window.navigator.clipboard.writeText(summary);
      setStatus(output, `${config.messages.copied}\n\n${summary}`, 'success');
    } catch {
      setStatus(output, `${config.messages.copyFallback}\n\n${summary}`, 'error');
    }
  });
}
