import { API_ARTICLES, API_TESTS } from './app/app.constants';
import { CONDITIONS } from './app/features/conditions/conditions.data';
import { TEST_CATEGORY_CONTENT } from './app/features/tests/constants/test-category-content.constants';
import { ARTICLE_CATEGORIES } from './app/features/articles/constants/article-categories.constants';

// /sitemap.xml, built on request from the live API (like llms.txt), so a test or
// article published in the admin is listed without a script run or redeploy.

const SITE = 'https://doctor-skripnik.com.ua';
const TTL_MS = 60 * 60 * 1000;
// Render's free backend can take 30–60 s to wake up; Vercel caps the function at 30 s.
const API_TIMEOUT_MS = 25_000;

interface Entry {
  path: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: string;
  lastmod?: string;
  image?: { loc: string; title: string };
}

interface ApiTest { _id: string; slug?: string; updatedAt?: string }
interface ApiArticle {
  _id: string;
  slug?: string;
  title?: string;
  coverImage?: string;
  status?: string;
  categories?: string[];
  updatedAt?: string;
  publishedAt?: string;
  createdAt?: string;
}

/** Pages that exist regardless of API content. */
const STATIC_ENTRIES: Entry[] = [
  { path: '/',         changefreq: 'daily',   priority: '1.0' },
  { path: '/about',    changefreq: 'monthly', priority: '0.9' },
  { path: '/visit',    changefreq: 'monthly', priority: '0.9' },
  ...CONDITIONS.map(c => ({ path: `/${c.slug}`, changefreq: 'monthly' as const, priority: '0.9' })),
  { path: '/articles', changefreq: 'daily',   priority: '0.9' },
  { path: '/test/list', changefreq: 'weekly', priority: '0.8' },
  ...Object.keys(TEST_CATEGORY_CONTENT).map(slug => ({ path: `/test/list/${slug}`, changefreq: 'weekly' as const, priority: '0.7' })),
  { path: '/reviews',  changefreq: 'weekly',  priority: '0.8' },
  // Team page hidden until specialists are added
  // { path: '/team',     changefreq: 'monthly', priority: '0.7' },
  { path: '/pro-tsentr', changefreq: 'monthly', priority: '0.8' },
  { path: '/drugs',    changefreq: 'monthly', priority: '0.7' },
];

const getJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url, { signal: AbortSignal.timeout(API_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return (await res.json()) as T;
};

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const toXml = (entries: Entry[]) => [
  '<?xml version="1.0" encoding="UTF-8"?>',
  // Browsers render the sitemap as a readable table; crawlers ignore the stylesheet.
  '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  ...entries.map(e => [
    '  <url>',
    `    <loc>${escapeXml(SITE + e.path)}</loc>`,
    ...(e.lastmod ? [`    <lastmod>${e.lastmod.slice(0, 10)}</lastmod>`] : []),
    `    <changefreq>${e.changefreq}</changefreq>`,
    `    <priority>${e.priority}</priority>`,
    ...(e.image ? [
      '    <image:image>',
      `      <image:loc>${escapeXml(e.image.loc)}</image:loc>`,
      `      <image:title>${escapeXml(e.image.title)}</image:title>`,
      '    </image:image>',
    ] : []),
    '  </url>',
  ].join('\n')),
  '</urlset>',
  '',
].join('\n');

async function build(): Promise<string> {
  const [tests, allArticles] = await Promise.all([
    getJson<ApiTest[]>(API_TESTS),
    getJson<ApiArticle[]>(`${API_ARTICLES}?limit=1000`),
  ]);
  // There are always tests; an empty list means the API is misbehaving, not that the site is empty.
  if (!Array.isArray(tests) || !tests.length) throw new Error('API returned no tests');
  if (!Array.isArray(allArticles)) throw new Error('API returned no article list');

  const articles = allArticles.filter(a => a.status === 'published' && (a.slug || a._id));
  // Empty category pages are noindex, so only list categories that have articles.
  const used = new Set(articles.flatMap(a => a.categories ?? []).map(c => c.toLowerCase()));

  return toXml([
    ...STATIC_ENTRIES,
    ...ARTICLE_CATEGORIES
      .filter(c => c.value && used.has(c.value))
      .map(c => ({ path: `/articles/category/${encodeURIComponent(c.value)}`, changefreq: 'weekly' as const, priority: '0.7' })),
    ...articles.map(a => ({
      path: `/articles/${encodeURIComponent(a.slug ?? a._id)}`,
      changefreq: 'monthly' as const,
      priority: '0.8',
      lastmod: a.updatedAt ?? a.publishedAt ?? a.createdAt,
      // Covers live on the API host; Google accepts image URLs on another domain.
      ...(a.coverImage?.startsWith('http') && { image: { loc: a.coverImage, title: a.title ?? '' } }),
    })),
    ...tests.filter(t => t._id).map(t => ({
      path: `/test/detail/${encodeURIComponent(t.slug ?? t._id)}`,
      changefreq: 'monthly' as const,
      priority: '0.7',
      lastmod: t.updatedAt,
    })),
  ]);
}

let cached: { xml: string; at: number } | null = null;

/**
 * Fresh sitemap, rebuilt at most once an hour per warm instance. If the API is
 * down, the last good copy is served; `null` only when there has never been one.
 */
export async function getSitemap(): Promise<string | null> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.xml;
  try {
    cached = { xml: await build(), at: Date.now() };
  } catch (err) {
    console.error('sitemap: build failed', err);
  }
  return cached?.xml ?? null;
}
