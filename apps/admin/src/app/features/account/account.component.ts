import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { InputOtpModule } from 'primeng/inputotp';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { TeamService } from '../../core/services/team.service';
import { TeamMember } from '../../core/models/team.model';
import { SessionInfo } from '../../core/models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

type ContactStep = 'form' | 'otp';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, TextareaModule, PasswordModule,
            ButtonModule, ToastModule, DividerModule, MessageModule, SkeletonModule,
            InputOtpModule, ToggleSwitchModule],
  providers: [MessageService],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit, OnDestroy {
  auth          = inject(AuthService);
  private http  = inject(HttpClient);
  private team  = inject(TeamService);
  private toast = inject(MessageService);

  user = computed(() => this.auth.currentUser());

  // ── Change password ──────────────────────────────────────
  currentPassword = '';
  newPassword     = '';
  confirmPassword = '';
  savingPwd       = signal(false);
  pwdError        = signal('');

  // ── Change email ─────────────────────────────────────────
  emailStep     = signal<ContactStep>('form');
  newEmail      = '';
  emailOtp      = '';
  emailSentTo   = '';
  emailLoading  = signal(false);
  emailError    = signal('');
  emailCountdown = signal(0);

  // ── Change phone ─────────────────────────────────────────
  phoneStep     = signal<ContactStep>('form');
  newPhone      = '';
  phoneOtp      = '';
  phoneSentTo   = '';
  phoneLoading  = signal(false);
  phoneError    = signal('');
  phoneCountdown = signal(0);

  // ── 2FA toggle ───────────────────────────────────────────
  twoFAEnabled   = signal(true);
  togglingTwoFA  = signal(false);

  // ── Active sessions ──────────────────────────────────────
  sessions          = signal<SessionInfo[]>([]);
  currentSessionId  = signal('');
  sessionsLoading   = signal(false);
  revokingId        = signal('');
  revokingAll       = signal(false);

  // ── Doctor profile ───────────────────────────────────────
  doctorProfile   = signal<TeamMember | null>(null);
  profileLoading  = signal(false);
  savingProfile   = signal(false);
  profileError    = signal('');

  profile: Partial<TeamMember> = {};
  specializationsText = '';
  educationText       = '';

  private emailTimer:    ReturnType<typeof setInterval> | null = null;
  private phoneTimer:    ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.twoFAEnabled.set(this.user()?.twoFactorEnabled !== false);
    this.loadSessions();
    if (this.user()?.role === 'doctor') {
      this.profileLoading.set(true);
      this.team.getMyProfile().subscribe({
        next: (m) => {
          this.doctorProfile.set(m);
          if (m) {
            this.profile             = { ...m };
            this.specializationsText = (m.specializations ?? []).join(', ');
            this.educationText       = (m.education ?? []).join('\n');
          }
          this.profileLoading.set(false);
        },
        error: () => this.profileLoading.set(false),
      });
    }
  }

  ngOnDestroy() {
    this.clearTimer('email');
    this.clearTimer('phone');
  }

  // ── Password ──────────────────────────────────────────────
  changePassword() {
    this.pwdError.set('');
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.pwdError.set('Заповніть усі поля'); return;
    }
    if (this.newPassword.length < 6) {
      this.pwdError.set('Новий пароль має містити мінімум 6 символів'); return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.pwdError.set('Паролі не збігаються'); return;
    }
    this.savingPwd.set(true);
    this.http.post(
      `${environment.apiUrl}/auth/change-password`,
      { currentPassword: this.currentPassword, newPassword: this.newPassword },
      { withCredentials: true }
    ).subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: 'Пароль змінено', life: 3000 });
        this.currentPassword = '';
        this.newPassword     = '';
        this.confirmPassword = '';
        this.savingPwd.set(false);
      },
      error: (err) => {
        this.pwdError.set(err.error?.message ?? 'Помилка зміни паролю');
        this.savingPwd.set(false);
      },
    });
  }

  // ── Email change ──────────────────────────────────────────
  requestEmailChange() {
    this.emailError.set('');
    if (!this.newEmail) { this.emailError.set('Введіть новий email'); return; }
    this.emailLoading.set(true);
    this.auth.requestContactChange('email', this.newEmail).subscribe({
      next: (res) => {
        this.emailSentTo = res.sentTo;
        this.emailLoading.set(false);
        this.emailStep.set('otp');
        this.startCountdown('email');
      },
      error: (err) => {
        this.emailError.set(err.error?.message ?? 'Помилка надсилання');
        this.emailLoading.set(false);
      },
    });
  }

  confirmEmailChange() {
    this.emailError.set('');
    if (!this.emailOtp || this.emailOtp.length !== 6) {
      this.emailError.set('Введіть 6-значний код'); return;
    }
    this.emailLoading.set(true);
    this.auth.confirmContactChange(this.emailOtp).subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: 'Email змінено', life: 3000 });
        this.resetEmailForm();
      },
      error: (err) => {
        this.emailError.set(err.error?.message ?? 'Невірний код');
        this.emailLoading.set(false);
      },
    });
  }

  resendEmailOtp() {
    this.emailError.set('');
    this.emailLoading.set(true);
    this.auth.requestContactChange('email', this.newEmail).subscribe({
      next: (res) => {
        this.emailSentTo = res.sentTo;
        this.emailLoading.set(false);
        this.startCountdown('email');
        this.toast.add({ severity: 'info', summary: 'Код надіслано повторно', life: 2500 });
      },
      error: (err) => {
        this.emailError.set(err.error?.message ?? 'Помилка надсилання');
        this.emailLoading.set(false);
      },
    });
  }

  resetEmailForm() {
    this.emailStep.set('form');
    this.newEmail = '';
    this.emailOtp = '';
    this.emailSentTo = '';
    this.emailError.set('');
    this.emailLoading.set(false);
    this.clearTimer('email');
  }

  // ── Phone change ──────────────────────────────────────────
  requestPhoneChange() {
    this.phoneError.set('');
    if (!this.newPhone) { this.phoneError.set('Введіть новий номер телефону'); return; }
    this.phoneLoading.set(true);
    this.auth.requestContactChange('phone', this.newPhone).subscribe({
      next: (res) => {
        this.phoneSentTo = res.sentTo;
        this.phoneLoading.set(false);
        this.phoneStep.set('otp');
        this.startCountdown('phone');
      },
      error: (err) => {
        this.phoneError.set(err.error?.message ?? 'Помилка надсилання');
        this.phoneLoading.set(false);
      },
    });
  }

  confirmPhoneChange() {
    this.phoneError.set('');
    if (!this.phoneOtp || this.phoneOtp.length !== 6) {
      this.phoneError.set('Введіть 6-значний код'); return;
    }
    this.phoneLoading.set(true);
    this.auth.confirmContactChange(this.phoneOtp).subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: 'Телефон змінено', life: 3000 });
        this.resetPhoneForm();
      },
      error: (err) => {
        this.phoneError.set(err.error?.message ?? 'Невірний код');
        this.phoneLoading.set(false);
      },
    });
  }

  resendPhoneOtp() {
    this.phoneError.set('');
    this.phoneLoading.set(true);
    this.auth.requestContactChange('phone', this.newPhone).subscribe({
      next: (res) => {
        this.phoneSentTo = res.sentTo;
        this.phoneLoading.set(false);
        this.startCountdown('phone');
        this.toast.add({ severity: 'info', summary: 'Код надіслано повторно', life: 2500 });
      },
      error: (err) => {
        this.phoneError.set(err.error?.message ?? 'Помилка надсилання');
        this.phoneLoading.set(false);
      },
    });
  }

  resetPhoneForm() {
    this.phoneStep.set('form');
    this.newPhone = '';
    this.phoneOtp = '';
    this.phoneSentTo = '';
    this.phoneError.set('');
    this.phoneLoading.set(false);
    this.clearTimer('phone');
  }

  // ── 2FA ───────────────────────────────────────────────────
  toggle2FA(enabled: boolean) {
    this.togglingTwoFA.set(true);
    this.auth.toggle2FA(enabled).subscribe({
      next: () => {
        this.twoFAEnabled.set(enabled);
        this.togglingTwoFA.set(false);
        this.toast.add({
          severity: 'success',
          summary: enabled ? 'Двофакторну автентифікацію увімкнено' : 'Двофакторну автентифікацію вимкнено',
          life: 3000,
        });
      },
      error: (err) => {
        this.togglingTwoFA.set(false);
        this.toast.add({ severity: 'error', summary: err.error?.message ?? 'Помилка', life: 3000 });
      },
    });
  }

  // ── Sessions ──────────────────────────────────────────────
  loadSessions() {
    this.sessionsLoading.set(true);
    this.auth.getSessions().subscribe({
      next: (res) => {
        this.sessions.set(res.sessions);
        this.currentSessionId.set(res.currentSessionId);
        this.sessionsLoading.set(false);
      },
      error: () => this.sessionsLoading.set(false),
    });
  }

  revokeSession(id: string) {
    this.revokingId.set(id);
    this.auth.revokeSession(id).subscribe({
      next: () => {
        this.sessions.update(s => s.filter(x => x._id !== id));
        this.revokingId.set('');
        this.toast.add({ severity: 'success', summary: 'Сесію завершено', life: 2500 });
      },
      error: () => this.revokingId.set(''),
    });
  }

  revokeAllSessions() {
    this.revokingAll.set(true);
    this.auth.revokeAllSessions().subscribe({
      next: () => {
        this.sessions.update(s => s.filter(x => x._id === this.currentSessionId()));
        this.revokingAll.set(false);
        this.toast.add({ severity: 'success', summary: 'Усі інші сесії завершено', life: 3000 });
      },
      error: () => this.revokingAll.set(false),
    });
  }

  parseDevice(ua: string): { label: string; icon: string } {
    if (!ua) return { label: 'Невідомий пристрій', icon: 'pi-desktop' };
    let browser = 'Browser', os = 'Unknown', icon = 'pi-desktop';
    if (ua.includes('Edg'))     browser = 'Edge';
    else if (ua.includes('Chrome'))  browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari'))  browser = 'Safari';
    if (ua.includes('iPhone'))      { os = 'iPhone';  icon = 'pi-mobile'; }
    else if (ua.includes('iPad'))   { os = 'iPad';    icon = 'pi-tablet'; }
    else if (ua.includes('Android')){ os = 'Android'; icon = 'pi-mobile'; }
    else if (ua.includes('Windows')){ os = 'Windows'; icon = 'pi-desktop'; }
    else if (ua.includes('Mac'))    { os = 'macOS';   icon = 'pi-apple'; }
    else if (ua.includes('Linux'))  { os = 'Linux';   icon = 'pi-desktop'; }
    return { label: `${browser} · ${os}`, icon };
  }

  // ── Doctor profile ────────────────────────────────────────
  saveProfile() {
    this.profileError.set('');
    const dto = {
      ...this.profile,
      specializations: this.specializationsText.split(',').map(s => s.trim()).filter(Boolean),
      education:       this.educationText.split('\n').map(s => s.trim()).filter(Boolean),
    };
    this.savingProfile.set(true);
    this.team.updateMyProfile(dto).subscribe({
      next: (updated) => {
        this.doctorProfile.set(updated);
        this.toast.add({ severity: 'success', summary: 'Профіль збережено', life: 3000 });
        this.savingProfile.set(false);
      },
      error: (err) => {
        this.profileError.set(err.error?.message ?? 'Помилка збереження');
        this.savingProfile.set(false);
      },
    });
  }

  // ── Countdown helpers ─────────────────────────────────────
  private startCountdown(type: 'email' | 'phone') {
    this.clearTimer(type);
    const countdown = type === 'email' ? this.emailCountdown : this.phoneCountdown;
    countdown.set(60);
    const timer = setInterval(() => {
      const next = countdown() - 1;
      if (next <= 0) { countdown.set(0); this.clearTimer(type); }
      else           { countdown.set(next); }
    }, 1000);
    if (type === 'email') this.emailTimer = timer;
    else                  this.phoneTimer = timer;
  }

  private clearTimer(type: 'email' | 'phone') {
    if (type === 'email' && this.emailTimer) { clearInterval(this.emailTimer); this.emailTimer = null; }
    if (type === 'phone' && this.phoneTimer) { clearInterval(this.phoneTimer); this.phoneTimer = null; }
  }
}
