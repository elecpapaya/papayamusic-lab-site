import { getCollection } from 'astro:content';

const fallbackLanguage = 'en';

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function toBlogSummary(entry) {
  return {
    entry,
    slug: entry.data.slug,
    lang: entry.data.lang,
    date: formatDate(entry.data.date),
    publishedAt: entry.data.date,
    category: entry.data.category,
    title: entry.data.title,
    excerpt: entry.data.excerpt,
    lead: entry.data.lead,
  };
}

async function getBlogEntries() {
  return getCollection('blog');
}

export async function getBlogPosts(language) {
  const entries = await getBlogEntries();

  return entries
    .filter((entry) => entry.data.lang === language)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.data.slug.localeCompare(b.data.slug))
    .map(toBlogSummary);
}

export async function getBlogPost(slug, language) {
  const entries = await getBlogEntries();
  const entry =
    entries.find((item) => item.data.slug === slug && item.data.lang === language) ??
    entries.find((item) => item.data.slug === slug && item.data.lang === fallbackLanguage);

  return entry ? toBlogSummary(entry) : null;
}

export async function getBlogStaticPaths(languages) {
  const entries = await getBlogEntries();

  return entries.flatMap((entry) => {
    const language = languages.find((item) => item.code === entry.data.lang);
    if (!language) {
      return [];
    }

    return {
      params: {
        lang: entry.data.lang,
        slug: entry.data.slug,
      },
    };
  });
}

export async function getBlogSitemapEntries() {
  const entries = await getBlogEntries();

  return entries
    .sort((a, b) => a.data.lang.localeCompare(b.data.lang) || a.data.slug.localeCompare(b.data.slug))
    .map((entry) => ({
      lang: entry.data.lang,
      slug: entry.data.slug,
    }));
}

export async function getBlogFeedEntries(language) {
  return getBlogPosts(language);
}
