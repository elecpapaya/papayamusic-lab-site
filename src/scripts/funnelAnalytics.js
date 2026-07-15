const FUNNEL_EVENTS = new Set([
  'page_view',
  'product_tour_view',
  'fit_view',
  'pricing_view',
  'faq_view',
  'cta_click',
  'form_start',
  'operating_system_selected',
  'turnstile_failure',
  'form_submit_attempt',
  'form_submit_success',
  'form_submit_failure',
]);
const PROPERTY_KEYS = new Set(['placement', 'formType', 'outcome', 'operatingSystem']);
const TOKEN_PATTERN = /^[a-z0-9][a-z0-9_.:-]{0,79}$/;

function normalizeToken(value) {
  const token = String(value || '').trim().toLowerCase();
  return TOKEN_PATTERN.test(token) ? token : '';
}

export function createFunnelPayload(eventName, properties = {}, context = {}) {
  if (!FUNNEL_EVENTS.has(eventName)) return null;

  const language = normalizeToken(context.language).slice(0, 2);
  const path = String(context.path || '').split(/[?#]/, 1)[0];
  if (!['en', 'ko', 'ja'].includes(language) || !path.startsWith('/') || path.length > 300) return null;

  const cleanProperties = {};
  for (const [key, value] of Object.entries(properties)) {
    if (!PROPERTY_KEYS.has(key)) return null;
    const token = normalizeToken(value);
    if (!token) return null;
    cleanProperties[key] = token;
  }

  return { eventName, language, path, properties: cleanProperties };
}

export function categorizeOperatingSystem(value) {
  return {
    'Windows 11': 'windows_11',
    'Other Windows': 'other_windows',
    'macOS waitlist': 'macos_waitlist',
    'Other platform waitlist': 'other_waitlist',
  }[String(value || '')] || '';
}

export function trackFunnelEvent(eventName, properties = {}) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const endpoint = String(document.body?.dataset.eventEndpoint || '').replace(/\/$/, '');
  if (!endpoint) return;

  const payload = createFunnelPayload(eventName, properties, {
    language: document.documentElement?.lang,
    path: window.location?.pathname,
  });
  if (!payload) return;

  void fetch(`${endpoint}/events`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

export function setupFunnelAnalytics() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  trackFunnelEvent('page_view');

  const sections = [...document.querySelectorAll('[data-funnel-section]')];
  if ('IntersectionObserver' in window) {
    const observer = new window.IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        trackFunnelEvent(entry.target.dataset.funnelSection);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.35 });
    sections.forEach((section) => observer.observe(section));
  }

  document.querySelectorAll('[data-funnel-cta]').forEach((link) => {
    link.addEventListener('click', () => {
      trackFunnelEvent('cta_click', { placement: link.dataset.funnelCta });
    });
  });

  document.querySelectorAll('form[data-form-type]').forEach((form) => {
    form.addEventListener('focusin', () => {
      if (form.dataset.funnelStarted === 'true') return;
      form.dataset.funnelStarted = 'true';
      trackFunnelEvent('form_start', { formType: form.dataset.formType });
    });

    form.querySelector('select[name="operatingSystem"]')?.addEventListener('change', (event) => {
      const operatingSystem = categorizeOperatingSystem(event.currentTarget.value);
      if (operatingSystem) trackFunnelEvent('operating_system_selected', {
        formType: form.dataset.formType,
        operatingSystem,
      });
    });
  });
}
