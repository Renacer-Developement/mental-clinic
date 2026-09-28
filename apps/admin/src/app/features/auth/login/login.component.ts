import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { AuthService } from '../../../core/services/auth.service';

type View = 'credentials' | 'otp' | 'forgot';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, PasswordModule,
            ButtonModule, InputOtpModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  private auth   = inject(AuthService);
  private router = inject(Router);

  view          = signal<View>('credentials');
  loading       = signal(false);
  resendLoading = signal(false);
  error         = signal('');
  success       = signal('');
  countdown     = signal(0);

  // Per-field error highlights
  identifierErr = signal(false);
  passwordErr   = signal(false);
  otpErr        = signal(false);

  // Step 1
  identifier = '';
  password   = '';

  // Step 2 (OTP)
  userId      = '';
  sentTo      = '';
  otp         = '';
  otpAttempts = 0;

  // Forgot password
  forgotIdentifier = '';

  private countdownTimer: ReturnType<typeof setInterval> | null = null;
  private errorTimer:     ReturnType<typeof setTimeout>  | null = null;
  private successTimer:   ReturnType<typeof setTimeout>  | null = null;

  showError(msg: string) {
    if (this.errorTimer) clearTimeout(this.errorTimer);
    this.error.set(msg);
    this.errorTimer = setTimeout(() => this.error.set(''), 5000);
  }

  clearError() {
    if (this.errorTimer) { clearTimeout(this.errorTimer); this.errorTimer = null; }
    this.error.set('');
  }

  showSuccess(msg: string) {
    if (this.successTimer) clearTimeout(this.successTimer);
    this.success.set(msg);
    this.successTimer = setTimeout(() => this.success.set(''), 4000);
  }

  clearSuccess() {
    if (this.successTimer) { clearTimeout(this.successTimer); this.successTimer = null; }
    this.success.set('');
  }

  submit() {
    this.clearError();
    this.identifierErr.set(!this.identifier);
    this.passwordErr.set(!this.password);
    if (!this.identifier || !this.password) { this.showError('Заповніть усі поля'); return; }
    this.loading.set(true);
    this.auth.loginStep1(this.identifier, this.password).subscribe({
      next: (res: any) => {
        if (res.user) {
          // 2FA disabled — logged in directly
          this.router.navigate(['/dashboard']);
          return;
        }
        this.userId = res.userId;
        this.sentTo = res.sentTo;
        this.loading.set(false);
        this.view.set('otp');
        this.startCountdown();
      },
      error: (err) => {
        this.identifierErr.set(true);
        this.passwordErr.set(true);
        this.showError(err.error?.message ?? 'Помилка входу');
        this.loading.set(false);
      },
    });
  }

  verifyOtp() {
    this.clearError();
    if (!this.otp || this.otp.length !== 6) {
      this.otpErr.set(true);
      this.showError('Введіть 6-значний код');
      return;
    }
    this.loading.set(true);
    this.auth.verifyOtp(this.userId, this.otp).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.otpAttempts++;
        this.otpErr.set(true);
        if (this.otpAttempts >= 3) {
          this.back();
          this.showError('Забагато невірних спроб. Будь ласка, увійдіть знову.');
          return;
        }
        this.showError(
          (err.error?.message ?? 'Невірний код') +
          ` (спроба ${this.otpAttempts} з 3)`
        );
        this.loading.set(false);
      },
    });
  }

  resendOtp() {
    this.clearError();
    this.resendLoading.set(true);
    this.auth.resendOtp(this.userId).subscribe({
      next: (res) => {
        this.sentTo = res.sentTo;
        this.resendLoading.set(false);
        this.showSuccess('Новий код надіслано на ' + res.sentTo);
        this.startCountdown();
      },
      error: (err) => {
        this.showError(err.error?.message ?? 'Помилка надсилання');
        this.resendLoading.set(false);
      },
    });
  }

  sendForgot() {
    this.clearError();
    this.clearSuccess();
    if (!this.forgotIdentifier) { this.showError('Введіть email або телефон'); return; }
    this.loading.set(true);
    this.auth.forgotPassword(this.forgotIdentifier).subscribe({
      next: () => {
        this.showSuccess('Якщо акаунт існує — посилання надіслано на вашу пошту');
        this.loading.set(false);
      },
      error: () => {
        this.showSuccess('Якщо акаунт існує — посилання надіслано на вашу пошту');
        this.loading.set(false);
      },
    });
  }

  back() {
    this.clearError();
    this.clearSuccess();
    this.otp              = '';
    this.otpAttempts      = 0;
    this.forgotIdentifier = '';
    this.stopCountdown();
    this.view.set('credentials');
  }

  private startCountdown() {
    this.stopCountdown();
    this.countdown.set(60);
    this.countdownTimer = setInterval(() => {
      const next = this.countdown() - 1;
      if (next <= 0) { this.countdown.set(0); this.stopCountdown(); }
      else           { this.countdown.set(next); }
    }, 1000);
  }

  private stopCountdown() {
    if (this.countdownTimer !== null) { clearInterval(this.countdownTimer); this.countdownTimer = null; }
  }

  ngOnDestroy() {
    this.stopCountdown();
    if (this.errorTimer)   clearTimeout(this.errorTimer);
    if (this.successTimer) clearTimeout(this.successTimer);
  }
}
