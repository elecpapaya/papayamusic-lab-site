import { buildRssFeed, rssResponse } from '../lib/rss.js';

export async function GET() {
  return rssResponse(await buildRssFeed('en', '/rss.xml'));
}
