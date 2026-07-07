# PapayaMusic Lab Site

Public Astro site for PapayaMusic Lab.

This repository is only the public website. It must not contain the desktop app source, protected builds, customer data, private download links, license keys, payment records, or internal implementation notes.

## Purpose

- Public landing page.
- Founder Pilot consultation request.
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
/ko/pilot/
/{lang}/blog/
/{lang}/rss.xml
/sitemap.xml
```

The Founder Pilot page is static and backend-free. It prepares an email draft and supports copying the application summary. It does not store submissions.

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
