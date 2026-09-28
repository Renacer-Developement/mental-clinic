import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function roleGuard(...allowed: string[]): CanActivateFn {
  return () => {
    const auth   = inject(AuthService);
    const router = inject(Router);
    const role   = auth.currentUser()?.role ?? '';
    return allowed.includes(role) ? true : router.createUrlTree(['/dashboard']);
  };
}
