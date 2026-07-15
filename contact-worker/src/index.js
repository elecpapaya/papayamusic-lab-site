const MAX_REQUEST_BYTES = 32_000;
const MAX_URLS = 3;

const FORM_SCHEMAS = {
  contact: {
    required: ['name', 'email', 'inquiryType', 'message'],
    fields: {
      name: 100,
      email: 254,
      inquiryType: 80,
      message: 3_000,
    },
  },
  pilot: {
    required: ['name', 'email', 'bottleneck'],
    fields: {
      name: 100,
      email: 254,
      role: 160,
      operatingSystem: 120,
      catalogSize: 160,
      currentTools: 600,
      bottleneck: 1_500,
      goals: 1_200,
      notes: 1_200,
    },
  },
};

const FIELD_LABELS = {
  name: 'Name',
  email: 'Reply email',
  inquiryType: 'Inquiry type',
  message: 'Message',
  role: 'Role / project',
  operatingSystem: 'Operating system',
  catalogSize: 'Monthly catalog size',
  currentTools: 'Current tools',
  bottleneck: 'Biggest bottleneck',
  goals: 'Success criteria',
  notes: 'Additional notes',
};

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      ...headers,
    },
  });
}

function splitList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function corsHeaders(origin, env) {
  const allowedOrigins = splitList(env.ALLOWED_ORIGINS);
  if (!origin || !allowedOrigins.includes(origin)) return null;
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'Origin',
  };
}

function cleanText(value) {
  return String(value ?? '')
    .replace(/\u0000/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

function isValidEmail(value) {
  if (value.length > 254 || /[\r\n]/.test(value)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function countUrls(values) {
  return values.reduce((total, value) => {
    const matches = value.match(/\b(?:https?:\/\/|www\.)[^\s<]+/gi);
    return total + (matches?.length ?? 0);
  }, 0);
}

export function validateSubmission(raw, now = Date.now()) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: 'invalid_submission' };
  }

  const formType = cleanText(raw.formType);
  const schema = FORM_SCHEMAS[formType];
  if (!schema) return { ok: false, error: 'invalid_submission' };

  const honeypot = cleanText(raw.website);
  const startedAt = Number(raw.startedAt);
  if (honeypot || !Number.isFinite(startedAt) || startedAt <= 0 || now - startedAt < 2_000) {
    return { ok: true, spam: true, formType };
  }

  const values = {};
  for (const [field, maxLength] of Object.entries(schema.fields)) {
    const value = cleanText(raw[field]);
    if (value.length > maxLength) return { ok: false, error: 'invalid_submission' };
    values[field] = value;
  }

  if (schema.required.some((field) => !values[field])) {
    return { ok: false, error: 'invalid_submission' };
  }

  values.email = values.email.toLowerCase();
  if (!isValidEmail(values.email)) return { ok: false, error: 'invalid_submission' };
  if (countUrls(Object.values(values)) > MAX_URLS) {
    return { ok: false, error: 'too_many_links' };
  }

  return {
    ok: true,
    spam: false,
    formType,
    language: cleanText(raw.language).slice(0, 8) || 'en',
    turnstileToken: cleanText(raw.turnstileToken),
    values,
  };
}

export function buildEmailText(submission) {
  const title = submission.formType === 'pilot' ? 'Founder Pilot application' : 'Website inquiry';
  const rows = [title, '', `Language: ${submission.language}`, `Form: ${submission.formType}`, ''];

  for (const [field, value] of Object.entries(submission.values)) {
    rows.push(`${FIELD_LABELS[field] || field}:`, value || '-', '');
  }

  return rows.join('\n').trimEnd();
}

async function verifyTurnstile(submission, request, env) {
  if (!submission.turnstileToken || !env.TURNSTILE_SECRET_KEY) return false;

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: submission.turnstileToken,
      remoteip: request.headers.get('cf-connecting-ip') || undefined,
      idempotency_key: crypto.randomUUID(),
    }),
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) return false;
  const result = await response.json();
  const allowedHostnames = splitList(env.TURNSTILE_HOSTNAMES);
  return Boolean(
    result.success &&
      result.action === submission.formType &&
      allowedHostnames.includes(result.hostname),
  );
}

async function sendContactEmail(submission, env) {
  if (!env.EMAIL || !env.CONTACT_RECIPIENT || !env.CONTACT_SENDER) {
    throw new Error('Contact email binding is not configured.');
  }

  const subjectPrefix = submission.formType === 'pilot' ? 'Founder Pilot' : 'Website inquiry';
  await env.EMAIL.send({
    to: env.CONTACT_RECIPIENT,
    from: {
      name: 'PapayaMusic Lab Website',
      email: env.CONTACT_SENDER,
    },
    replyTo: submission.values.email,
    subject: `[PapayaMusic Lab] ${subjectPrefix} — ${submission.values.name}`,
    text: buildEmailText(submission),
  });
}

async function parseJson(request) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().startsWith('application/json')) return null;

  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > MAX_REQUEST_BYTES) return null;

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_REQUEST_BYTES) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function handleRequest(request, env) {
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  const cors = corsHeaders(origin, env);

  if (request.method === 'OPTIONS') {
    return cors ? new Response(null, { status: 204, headers: cors }) : new Response(null, { status: 403 });
  }

  if (!cors) return jsonResponse({ success: false, error: 'origin_not_allowed' }, 403);

  if (request.method === 'GET' && url.pathname === '/config') {
    if (!env.TURNSTILE_SITE_KEY) {
      return jsonResponse({ success: false, error: 'unavailable' }, 503, cors);
    }
    return jsonResponse({ success: true, siteKey: env.TURNSTILE_SITE_KEY }, 200, cors);
  }

  if (request.method !== 'POST' || url.pathname !== '/submit') {
    return jsonResponse({ success: false, error: 'not_found' }, 404, cors);
  }

  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  if (env.CONTACT_RATE_LIMITER) {
    const rateLimit = await env.CONTACT_RATE_LIMITER.limit({ key: `contact:${ip}` });
    if (!rateLimit.success) {
      return jsonResponse({ success: false, error: 'rate_limited' }, 429, cors);
    }
  }

  const raw = await parseJson(request);
  const submission = validateSubmission(raw);
  if (!submission.ok) {
    return jsonResponse({ success: false, error: submission.error }, 400, cors);
  }
  if (submission.spam) return jsonResponse({ success: true }, 200, cors);

  try {
    const turnstileValid = await verifyTurnstile(submission, request, env);
    if (!turnstileValid) {
      return jsonResponse({ success: false, error: 'verification_failed' }, 400, cors);
    }
    await sendContactEmail(submission, env);
    return jsonResponse({ success: true }, 200, cors);
  } catch (error) {
    console.error('Contact form delivery failed.', error?.code || error?.name || 'unknown');
    return jsonResponse({ success: false, error: 'unavailable' }, 503, cors);
  }
}

export default {
  fetch: handleRequest,
};
