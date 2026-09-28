import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { LandingComponent } from './features/landing/landing.component';
import { ROUTES } from './shared/constants/routes.constants';
import { AboutComponent } from './features/about/about.component';
import { DrugsComponent } from './features/drugs/drugs.component';
import { VisitPageComponent } from './features/visit/visit-page.component';
import { ReviewsComponent } from './features/reviews/reviews.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      // These routes are build-time prerendered (RenderMode.Prerender in
      // app.routes.server.ts). Their components must load eagerly — combining
      // loadComponent() with prerendering breaks the build's route-extraction
      // worker (it can't resolve the lazy chunk and silently drops the route).
      { path: '', component: LandingComponent },
      { path: ROUTES.ABOUT, component: AboutComponent },
      { path: ROUTES.DRUGS, component: DrugsComponent },
      { path: ROUTES.VISIT, component: VisitPageComponent },
      { path: ROUTES.REVIEWS, component: ReviewsComponent },

      // Everything below is RenderMode.Server (rendered per-request, not at
      // build time), so lazy loading is safe and keeps them out of the main bundle.
      {
        path: 'test',
        loadComponent: () => import('./features/tests/tests.component').then(m => m.TestsComponent),
        children: [
          {
            path: 'detail/:id',
            loadComponent: () => import('./features/tests/detail-page/detail-page.component').then(m => m.DetailPageComponent),
          },
          {
            path: 'list/:type',
            loadComponent: () => import('./features/tests/list/list.component').then(m => m.ListComponent),
          },
          {
            path: 'list',
            loadComponent: () => import('./features/tests/list/list.component').then(m => m.ListComponent),
          },
        ],
      },
      {
        path: ROUTES.CONTRACT,
        loadComponent: () => import('./features/contract/contract.component').then(m => m.ContractComponent),
      },
      // Articles — category filter must come before :id to avoid shadow
      {
        path: `${ROUTES.ARTICLES}/category/:cat`,
        loadComponent: () => import('./features/articles/list/articles-list.component').then(m => m.ArticlesListComponent),
      },
      {
        path: ROUTES.ARTICLES,
        loadComponent: () => import('./features/articles/list/articles-list.component').then(m => m.ArticlesListComponent),
      },
      {
        path: `${ROUTES.ARTICLES}/:id`,
        loadComponent: () => import('./features/articles/detail/article-detail.component').then(m => m.ArticleDetailComponent),
      },
      {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
      },
    ],
  },
];
