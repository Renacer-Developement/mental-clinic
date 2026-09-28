import { Routes } from '@angular/router';

export const TESTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tests.component').then(m => m.TestsComponent),
    children: [
      {
        path: 'detail/:id',
        loadComponent: () => import('./detail-page/detail-page.component').then(m => m.DetailPageComponent),
      },
      {
        path: 'list/:type',
        loadComponent: () => import('./list/list.component').then(m => m.ListComponent),
      },
      {
        path: 'list',
        loadComponent: () => import('./list/list.component').then(m => m.ListComponent),
      },
    ],
  },
];
