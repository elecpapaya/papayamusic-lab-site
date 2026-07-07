import { buildRssFeed, rssResponse } from '../../lib/rss.js';
import { languages } from '../../content.js';

export function getStaticPaths() {
  return languages.map((language) => ({
    params: {
      lang: language.code,
    },
  }));
}

export async function GET({ params }) {
  return rssResponse(await buildRssFeed(params.lang));
}
