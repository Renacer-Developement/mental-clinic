import { resolve } from 'node:path';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { API_ARTICLES, API_TESTS } from './app/app.constants';
import { getSitemap } from './sitemap';
import { CONDITIONS } from './app/features/conditions/conditions.data';

// Resolved from CWD rather than import.meta.url: this project's browserslist
// targets Safari/iOS versions old enough that esbuild empties `import.meta`
// across the whole bundle (including the server output), so `import.meta.url`
// is unusable here. npm scripts always run with CWD at the project root.
const browserDistFolder = resolve(process.cwd(), 'dist/mental-clinic-fe/browser');

const app = express();
// Vercel's edge is the only proxy in front of this function and it sets the
// X-Forwarded-* headers itself. Without trusting them Angular silently serves
// the empty client-side shell instead of SSR (allowedHosts still guards Host).
const angularApp = new AngularNodeAppEngine({ trustProxyHeaders: true });

// llms.txt (https://llmstxt.org): a plain-text map of the site for AI assistants,
// built from the live API so new tests and articles show up without a redeploy.
const SITE = 'https://doctor-skripnik.com.ua';

const fetchJson = async <T>(url: string): Promise<T[]> => {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    return res.ok ? ((await res.json()) as T[]) : [];
  } catch {
    return [];
  }
};

// Tests moved from /test/detail/<mongo id> to /test/detail/<slug>. Old URLs are
// what Google indexed, so they get a permanent redirect; the id→slug map is
// refreshed at most every 10 min per warm instance.
let testSlugs: { map: Map<string, string>; at: number } | null = null;
const slugForTestId = async (id: string): Promise<string | undefined> => {
  if (!testSlugs || Date.now() - testSlugs.at > 10 * 60_000) {
    const tests = await fetchJson<{ _id: string; slug?: string }>(API_TESTS);
    if (tests.length) {
      testSlugs = { map: new Map(tests.filter(t => t.slug).map(t => [t._id, t.slug!])), at: Date.now() };
    }
  }
  return testSlugs?.map.get(id);
};

app.get('/test/detail/:id', async (req, res, next) => {
  if (!/^[0-9a-f]{24}$/i.test(req.params.id)) return next();
  const slug = await slugForTestId(req.params.id.toLowerCase());
  if (!slug) return next(); // API down or test has no slug yet: render the id URL as before
  res.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  res.redirect(301, `/test/detail/${encodeURIComponent(slug)}`);
});

app.get('/llms.txt', async (_req, res) => {
  const [tests, articles] = await Promise.all([
    fetchJson<{ _id: string; slug?: string; name: string; description?: string }>(API_TESTS),
    fetchJson<{ slug: string; title: string; excerpt?: string; status?: string }>(API_ARTICLES),
  ]);
  const line = (title: string, url: string, note?: string) =>
    `- [${title}](${url})${note ? `: ${note.replace(/\s+/g, ' ').trim()}` : ''}`;

  const body = [
    '# Онлайн центр ментального здоров’я Євгена Скрипника',
    '',
    '> Євген Скрипник — лікар-психіатр, психотерапевт, нарколог і невролог з понад 20-річним досвідом. '
      + 'Онлайн-консультації по всій Україні щодня, окрім неділі, з 8:00 до 22:00, очний прийом у м. Глухів (Сумська область). '
      + 'Лікування за принципами доказової медицини: депресія, тривожні розлади, панічні атаки, ПТСР, ОКР, '
      + 'біполярний розлад, РДУГ у дорослих, залежності. На сайті — понад 30 безкоштовних психологічних тестів '
      + 'українською мовою з поясненням результатів.',
    '',
    'Телефон для запису: +380665691677. Мова: українська.',
    '',
    '## Основне',
    line('Про лікаря', `${SITE}/about`, 'освіта, досвід, підходи до лікування'),
    line('Записатися на консультацію', `${SITE}/visit`, 'онлайн-консультація психіатра, формат і запис'),
    line('Відгуки пацієнтів', `${SITE}/reviews`),
    line('Препарати', `${SITE}/drugs`, 'довідник препаратів, які застосовуються в психіатрії'),
    '',
    '## Що лікуємо',
    ...CONDITIONS.map(c => line(c.h1, `${SITE}/${c.slug}`, `${c.teaser}. ${c.description}`)),
    '',
    '## Психологічні тести онлайн (безкоштовно)',
    line('Усі тести', `${SITE}/test/list`),
    ...tests.map(t => line(t.name, `${SITE}/test/detail/${t.slug ?? t._id}`, t.description?.split(/(?<=\.)\s/)[0])),
    '',
    '## Статті',
    line('Усі статті', `${SITE}/articles`),
    ...articles
      .filter(a => a.slug && (!a.status || a.status === 'published'))
      .map(a => line(a.title, `${SITE}/articles/${a.slug}`, a.excerpt)),
    '',
    '## Важливо',
    '- Результати тестів — скринінг, а не діагноз. Діагноз ставить лікар після консультації.',
    '',
  ].join('\n');

  res.set('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  res.type('text/plain; charset=utf-8').send(body);
});

app.get('/sitemap.xml', async (_req, res) => {
  const xml = await getSitemap();
  if (!xml) {
    // API asleep/down and no copy yet: tell crawlers to retry instead of serving a partial sitemap.
    res.set('Retry-After', '120').set('Cache-Control', 'no-store').sendStatus(503);
    return;
  }
  // Vercel's edge keeps a copy for an hour and keeps serving it while it refreshes or if the function errors.
  res.set('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=604800');
  res.type('application/xml; charset=utf-8').send(xml);
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (!response) return next();
      // Server-rendered pages (articles, tests) hit the Render API on every request,
      // which made them slow (TTFB ~0.6–1.1 s). Let Vercel's edge serve a copy for
      // 5 min and refresh it in the background. Only successful pages are cached —
      // a 404/503 (API asleep) must never be stored in place of the real page.
      if (response.status === 200 && !response.headers.has('Cache-Control')) {
        response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400');
      }
      return writeResponseToNodeResponse(response, res);
    })
    .catch(next);
});

// Only self-listen when run directly (e.g. `node dist/.../server/server.mjs`).
// The Angular build also imports this module in a worker to statically extract
// prerender routes — it must not bind a port in that context.
const isMain = process.argv[1]?.endsWith('server.mjs') ?? false;
if (isMain) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
