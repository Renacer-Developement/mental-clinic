import { RenderMode, ServerRoute } from '@angular/ssr';
import { CONDITIONS } from './features/conditions/conditions.data';

export const serverRoutes: ServerRoute[] = [
  // Static marketing pages — content doesn't depend on live API data, prerender at build time
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'drugs', renderMode: RenderMode.Prerender },
  { path: 'visit', renderMode: RenderMode.Prerender },
  { path: 'reviews', renderMode: RenderMode.Prerender },
  { path: 'pro-tsentr', renderMode: RenderMode.Prerender },
  { path: 'konsultatsiya-psykhiatra-onlain', renderMode: RenderMode.Prerender },
  ...CONDITIONS.map(c => ({ path: c.slug, renderMode: RenderMode.Prerender as const })),

  // Dynamic content backed by the API — render per-request so bots/crawlers
  // always see the current tests, articles and contract text, not a stale build-time snapshot
  { path: 'team', renderMode: RenderMode.Server },
  // Results load in the browser; the server sends the empty search box (noindex)
  { path: 'search', renderMode: RenderMode.Server },
  { path: 'contract', renderMode: RenderMode.Server },
  { path: 'test', renderMode: RenderMode.Server, status: 301 },
  { path: 'test/list', renderMode: RenderMode.Server },
  { path: 'test/list/:type', renderMode: RenderMode.Server },
  { path: 'test/detail/:id', renderMode: RenderMode.Server },
  { path: 'articles', renderMode: RenderMode.Server },
  { path: 'articles/category/:cat', renderMode: RenderMode.Server },
  { path: 'articles/:id', renderMode: RenderMode.Server },

  // Real 404 status so this never counts as a soft-404 for crawlers
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
