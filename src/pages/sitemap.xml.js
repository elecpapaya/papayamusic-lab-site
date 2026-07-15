import { getBlogSitemapEntries } from '../blog.js';
import { languages } from '../content.js';
import { siteConfig } from '../siteConfig.js';

const siteUrl = siteConfig.siteUrl.replace(/\/$/, '');

function pageUrl(path) {
  return `${siteUrl}${path}`;
}

function urlEntry(path, priority) {
  return `  <url>
    <loc>${pageUrl(path)}</loc>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET() {
  const posts = await getBlogSitemapEntries();
  const urls = [
    ...languages.map((language) => urlEntry(`/${language.code}/`, '1.0')),
    ...languages.map((language) => urlEntry(`/${language.code}/blog/`, '0.8')),
    ...languages.map((language) => urlEntry(`/${language.code}/docs/`, '0.8')),
    ...languages.map((language) => urlEntry(`/${language.code}/contact/`, '0.7')),
    ...languages.map((language) => urlEntry(`/${language.code}/pilot/`, '0.9')),
    ...languages.map((language) => urlEntry(`/${language.code}/data-handling/`, '0.5')),
    ...languages.map((language) => urlEntry(`/${language.code}/terms/`, '0.4')),
    ...posts.map((post) => urlEntry(`/${post.lang}/blog/${post.slug}/`, '0.7')),
  ];

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
