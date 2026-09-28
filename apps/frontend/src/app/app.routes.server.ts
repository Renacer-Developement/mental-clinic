import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static marketing pages — content doesn't depend on live API data, prerender at build time
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'drugs', renderMode: RenderMode.Prerender },
  { path: 'visit', renderMode: RenderMode.Prerender },
  { path: 'reviews', renderMode: RenderMode.Prerender },

  // Dynamic content backed by the API — render per-request so bots/crawlers
  // always see the current tests, articles and contract text, not a stale build-time snapshot
  { path: 'contract', renderMode: RenderMode.Server },
  { path: 'test', renderMode: RenderMode.Server },
  { path: 'test/list', renderMode: RenderMode.Server },
  { path: 'test/list/:type', renderMode: RenderMode.Server },
  { path: 'test/detail/:id', renderMode: RenderMode.Server },
  { path: 'articles', renderMode: RenderMode.Server },
  { path: 'articles/category/:cat', renderMode: RenderMode.Server },
  { path: 'articles/:id', renderMode: RenderMode.Server },

  // Real 404 status so this never counts as a soft-404 for crawlers
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
