import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },
  {
    path: 'accept-invite',
    loadComponent: () => import('./features/auth/accept-invite/accept-invite.component').then(m => m.AcceptInviteComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./app.shell.component').then(m => m.AppShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'articles',         loadComponent: () => import('./features/articles/article-list/article-list.component').then(m => m.ArticleListComponent) },
      { path: 'articles/new',     loadComponent: () => import('./features/articles/article-form/article-form.component').then(m => m.ArticleFormComponent) },
      { path: 'articles/:id/edit',loadComponent: () => import('./features/articles/article-form/article-form.component').then(m => m.ArticleFormComponent) },
      { path: 'tests',            loadComponent: () => import('./features/tests/test-list/test-list.component').then(m => m.TestListComponent) },
      { path: 'tests/new',        loadComponent: () => import('./features/tests/test-form/test-form.component').then(m => m.TestFormComponent) },
      { path: 'tests/:id/edit',   loadComponent: () => import('./features/tests/test-form/test-form.component').then(m => m.TestFormComponent) },
      { path: 'users',            canActivate: [roleGuard('admin')], loadComponent: () => import('./features/users/user-list/user-list.component').then(m => m.UserListComponent) },
      { path: 'team',             canActivate: [roleGuard('admin')], loadComponent: () => import('./features/team/team-list/team-list.component').then(m => m.TeamListComponent) },
      { path: 'team/new',         canActivate: [roleGuard('admin')], loadComponent: () => import('./features/team/team-form/team-form.component').then(m => m.TeamFormComponent) },
      { path: 'team/:id/edit',    canActivate: [roleGuard('admin')], loadComponent: () => import('./features/team/team-form/team-form.component').then(m => m.TeamFormComponent) },
      { path: 'reviews',           loadComponent: () => import('./features/reviews/review-list/review-list.component').then(m => m.ReviewListComponent) },
      { path: 'contract',         canActivate: [roleGuard('admin')], loadComponent: () => import('./features/contract/contract.component').then(m => m.ContractComponent) },
      { path: 'account',          loadComponent: () => import('./features/account/account.component').then(m => m.AccountComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
