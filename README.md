# PapayaMusic Lab Site

Public Astro site for PapayaMusic Lab.

This repository is only the public website. It must not contain the desktop app source, protected builds, customer data, private download links, license keys, payment records, or internal implementation notes.

## Purpose

- Public landing page.
- Protected general contact and Founder Pilot request forms.
- Buyer-facing docs.
- Production notes / blog.
- Localized static routes for English, Korean, and Japanese.
- GitHub Pages-compatible static output.

## Commands

```powershell
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Content

Site config:

```text
src/siteConfig.js
```

Localized copy:

```text
src/content.js
```

Blog posts:

```text
src/content/blog/{lang}/{slug}.md
```

Important routes:

```text
/en/
/ko/
/ja/
/en/docs/
/ko/contact/
/ko/pilot/
/{lang}/blog/
/{lang}/rss.xml
/sitemap.xml
```

The public pages remain static. General contact and Founder Pilot forms submit to the separate Cloudflare Worker in `contact-worker/`. The Worker validates Cloudflare Turnstile server-side, applies a honeypot and request limits, validates message size and link count, and forwards plain-text messages through a Cloudflare Email Service binding. The destination address is stored only as a Worker secret.

## Protected contact worker

Create a Turnstile widget restricted to `papayamusiclab.com` and `www.papayamusiclab.com`. Then configure the Worker secrets without committing their values:

```powershell
pnpm exec wrangler secret put TURNSTILE_SITE_KEY --config contact-worker/wrangler.jsonc
pnpm exec wrangler secret put TURNSTILE_SECRET_KEY --config contact-worker/wrangler.jsonc
pnpm exec wrangler secret put CONTACT_RECIPIENT --config contact-worker/wrangler.jsonc
pnpm exec wrangler secret put CONTACT_SENDER --config contact-worker/wrangler.jsonc
```

`CONTACT_RECIPIENT` must be a verified Cloudflare Email Routing destination. `CONTACT_SENDER` must belong to the onboarded `papayamusiclab.com` domain. The Worker is configured for `contact-api.papayamusiclab.com` and never returns either address to the browser.

Validate and deploy:

```powershell
pnpm worker:test
pnpm worker:check
pnpm worker:deploy
```

## GitHub Pages

Deployment workflow:

```text
.github/workflows/deploy.yml
```

In repository settings:

1. Open **Settings > Pages**.
2. Set **Build and deployment > Source** to **GitHub Actions**.
3. Run the workflow manually or push to `main`.

For GitHub project pages, the workflow defaults to:

```text
PAPAYA_SITE_BASE=/{repo-name}/
```

For a custom domain at the root, set this repository variable:

```text
PAPAYA_SITE_BASE=/
```

Then configure the custom domain in **Settings > Pages** and DNS.

## Safety

Before publishing, check that the public site does not expose:

- Product source code.
- Full app screenshots or implementation walkthroughs.
- Protected app builds.
- License keys.
- Private download URLs.
- Customer support conversations.
- Customer media, lyrics, videos, project files, or account credentials.
