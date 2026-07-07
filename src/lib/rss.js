import { getBlogFeedEntries } from '../blog.js';
import { getHomeContent } from '../content.js';
import { siteConfig } from '../siteConfig.js';

const siteUrl = siteConfig.siteUrl.replace(/\/$/, '');

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function absoluteUrl(path) {
  return `${siteUrl}${path}`;
}

export async function buildRssFeed(language, feedPath = `/${language}/rss.xml`) {
  const content = getHomeContent(language);
  const posts = await getBlogFeedEntries(language);
  const channelUrl = absoluteUrl(feedPath);
  const siteHomeUrl = absoluteUrl(`/${language}/`);

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/${post.lang}/blog/${post.slug}/`);

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${post.publishedAt.toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`PapayaMusic Lab - ${content.blog.title}`)}</title>
    <link>${escapeXml(siteHomeUrl)}</link>
    <atom:link href="${escapeXml(channelUrl)}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(content.hero.lead)}</description>
    <language>${escapeXml(language)}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

export function rssResponse(xml) {
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
