import { HttpInterceptorFn } from '@angular/common/http';

// Send cookie (where available) + Authorization header (fallback for iOS Safari / incognito
// which block cross-site cookies even with SameSite=None).
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('mc_token');
  const headers = token
    ? req.headers.set('Authorization', `Bearer ${token}`)
    : req.headers;
  return next(req.clone({ withCredentials: true, headers }));
};
