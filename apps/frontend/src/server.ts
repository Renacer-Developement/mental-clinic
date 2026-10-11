import { resolve } from 'node:path';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { API_ARTICLES, API_TESTS } from './app/app.constants';

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

app.get('/llms.txt', async (_req, res) => {
  const [tests, articles] = await Promise.all([
    fetchJson<{ _id: string; name: string; description?: string }>(API_TESTS),
    fetchJson<{ slug: string; title: string; excerpt?: string; status?: string }>(API_ARTICLES),
  ]);
  const line = (title: string, url: string, note?: string) =>
    `- [${title}](${url})${note ? `: ${note.replace(/\s+/g, ' ').trim()}` : ''}`;

  const body = [
    '# Онлайн центр ментального здоров’я Євгена Скрипника',
    '',
    '> Євген Скрипник — лікар-психіатр, психотерапевт, нарколог і невролог з понад 20-річним досвідом. '
      + 'Онлайн-консультації по всій Україні щодня з 8:00 до 22:00, очний прийом у м. Глухів (Сумська область). '
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
    '## Психологічні тести онлайн (безкоштовно)',
    line('Усі тести', `${SITE}/test/list`),
    ...tests.map(t => line(t.name, `${SITE}/test/detail/${t._id}`, t.description?.split(/(?<=\.)\s/)[0])),
    '',
    '## Статті',
    line('Усі статті', `${SITE}/articles`),
    ...articles
      .filter(a => a.slug && (!a.status || a.status === 'published'))
      .map(a => line(a.title, `${SITE}/articles/${a.slug}`, a.excerpt)),
    '',
    '## Важливо',
    '- Результати тестів — скринінг, а не діагноз. Діагноз ставить лікар після консультації.',
    '- У кризі (думки про самогубство чи самоушкодження) — лінія психологічної підтримки 7333 або 112.',
    '',
  ].join('\n');

  res.set('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  res.type('text/plain; charset=utf-8').send(body);
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
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
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
