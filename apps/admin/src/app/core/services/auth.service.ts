import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CreateUserDto, User, SessionInfo } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USER_KEY  = 'mc_user';
  private readonly TOKEN_KEY = 'mc_token';

  // Only user info (not the token) is stored — the HttpOnly cookie holds the token
  private _user = signal<User | null>(this.loadUser());

  isLoggedIn  = computed(() => !!this._user());
  isAdmin     = computed(() => this._user()?.role === 'admin');
  currentUser = computed(() => this._user());

  constructor(private http: HttpClient, private router: Router) {}

  loginStep1(identifier: string, password: string) {
    return this.http
      .post<{ userId: string; sentTo: string } | { user: User }>(
        `${environment.apiUrl}/auth/login`,
        { identifier, password },
        { withCredentials: true }
      )
      .pipe(
        tap((res: any) => {
          // 2FA disabled — server returns { user, token } directly, persist immediately
          if (res.user) this.persistUser(res.user, res.token);
        }),
      );
  }

  verifyOtp(userId: string, otp: string) {
    return this.http
      .post<{ user: User; token: string }>(`${environment.apiUrl}/auth/verify-otp`, { userId, otp }, { withCredentials: true })
      .pipe(tap(res => this.persistUser(res.user, res.token)));
  }

  resendOtp(userId: string) {
    return this.http.post<{ userId: string; sentTo: string }>(
      `${environment.apiUrl}/auth/resend-otp`,
      { userId }
    );
  }

  requestContactChange(type: 'email' | 'phone', value: string) {
    return this.http.post<{ sentTo: string }>(
      `${environment.apiUrl}/auth/request-contact-change`,
      { type, value },
      { withCredentials: true }
    );
  }

  confirmContactChange(otp: string) {
    return this.http
      .post<{ user: User }>(`${environment.apiUrl}/auth/confirm-contact-change`, { otp }, { withCredentials: true })
      .pipe(tap(res => this.persistUser(res.user)));
  }

  toggle2FA(enabled: boolean) {
    return this.http
      .patch<{ user: User }>(`${environment.apiUrl}/auth/2fa`, { enabled }, { withCredentials: true })
      .pipe(tap(res => this.persistUser(res.user)));
  }

  getSessions() {
    return this.http.get<{ sessions: SessionInfo[]; currentSessionId: string }>(
      `${environment.apiUrl}/auth/sessions`, { withCredentials: true }
    );
  }

  revokeSession(id: string) {
    return this.http.delete(`${environment.apiUrl}/auth/sessions/${id}`, { withCredentials: true });
  }

  revokeAllSessions() {
    return this.http.delete(`${environment.apiUrl}/auth/sessions/all`, { withCredentials: true });
  }

  forgotPassword(identifier: string) {
    return this.http.post(`${environment.apiUrl}/auth/forgot-password`, { identifier });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${environment.apiUrl}/auth/reset-password`, { token, newPassword });
  }

  // Validates the cookie on page refresh — called from the auth guard
  fetchMe() {
    return this.http
      .get<User>(`${environment.apiUrl}/auth/me`, { withCredentials: true })
      .pipe(tap(user => this.persistUser(user)));
  }

  getUsers() {
    return this.http.get<User[]>(`${environment.apiUrl}/auth/users`, { withCredentials: true });
  }

  inviteUser(email: string, role: 'admin' | 'user' | 'doctor') {
    const redirectUrl = environment.adminUrl;
    return this.http.post(
      `${environment.apiUrl}/auth/users/invite`,
      { email, role, redirectUrl },
      { withCredentials: true }
    );
  }

  acceptInvite(token: string, data: { name: string; lastName: string; phone: string; password: string }) {
    return this.http.post<User>(`${environment.apiUrl}/auth/users/accept`, { token, ...data });
  }

  updateUserRole(userId: string, role: 'admin' | 'user' | 'doctor') {
    return this.http.patch<User>(`${environment.apiUrl}/auth/users/${userId}/role`, { role }, { withCredentials: true });
  }

  updateUserStatus(userId: string, status: 'active' | 'inactive') {
    return this.http.patch<User>(`${environment.apiUrl}/auth/users/${userId}/status`, { status }, { withCredentials: true });
  }

  deleteUser(userId: string) {
    return this.http.delete(`${environment.apiUrl}/auth/users/${userId}`, { withCredentials: true });
  }

  createUser(dto: CreateUserDto) {
    return this.http.post<User>(`${environment.apiUrl}/auth/users`, dto, { withCredentials: true });
  }

  setup(name: string, email: string, password: string) {
    return this.http.post<User>(`${environment.apiUrl}/auth/setup`, { name, email, password });
  }

  logout() {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true }).subscribe();
    this.clearUser();
    this.router.navigate(['/login']);
  }

  private persistUser(user: User, token?: string) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    if (token) localStorage.setItem(this.TOKEN_KEY, token);
    this._user.set(user);
  }

  private clearUser() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this._user.set(null);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
