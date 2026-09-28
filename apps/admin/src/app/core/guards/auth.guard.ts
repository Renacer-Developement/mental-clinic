import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // If no cached user at all — go to login immediately
  if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);

  // Verify the cookie is still valid on each navigation
  return auth.fetchMe().pipe(
    map(() => true),
    catchError(() => {
      return of(router.createUrlTree(['/login']));
    }),
  );
};
