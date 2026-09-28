import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, PasswordModule, ButtonModule, MessageModule],
  template: `
    <div class="reset-wrapper">
      <div class="reset-card">
        <div class="reset-header">
          <img src="logo.avif" alt="Логотип" />
          <h1>Новий пароль</h1>
          <p>Введіть новий пароль для вашого акаунту</p>
        </div>

        @if (!token) {
          <p-message severity="error" text="Посилання недійсне або протерміноване" styleClass="w-full" />
          <div class="back-link">
            <button class="link-btn" (click)="router.navigate(['/login'])">← Повернутись до входу</button>
          </div>
        } @else if (done()) {
          <p-message severity="success" text="Пароль успішно змінено! Тепер можете увійти." styleClass="w-full" />
          <div class="back-link">
            <button class="link-btn" (click)="router.navigate(['/login'])">Перейти до входу →</button>
          </div>
        } @else {
          @if (error()) {
            <p-message severity="error" [text]="error()" styleClass="w-full" />
          }

          <div class="field">
            <label>Новий пароль</label>
            <p-password [(ngModel)]="newPassword" [feedback]="true" [toggleMask]="true"
                        styleClass="w-full" inputStyleClass="w-full"
                        placeholder="Мінімум 6 символів"
                        promptLabel="Введіть пароль"
                        weakLabel="Слабкий" mediumLabel="Середній" strongLabel="Надійний" />
          </div>

          <div class="field">
            <label>Підтвердіть пароль</label>
            <p-password [(ngModel)]="confirmPassword" [feedback]="false" [toggleMask]="true"
                        styleClass="w-full" inputStyleClass="w-full"
                        placeholder="Повторіть новий пароль" />
          </div>

          <p-button label="Змінити пароль" icon="pi pi-check" styleClass="w-full"
            [loading]="loading()" (onClick)="submit()" />

          <div class="back-link">
            <button class="link-btn" (click)="router.navigate(['/login'])">← Повернутись до входу</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    $primary: #5f75d6;
    $heading: #003168;

    .reset-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, $heading 0%, #1a3a7a 50%, darken($primary, 10%) 100%);
    }

    .reset-card {
      background: #fff;
      border-radius: 16px;
      padding: 44px 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.2);
    }

    .reset-header {
      text-align: center;
      margin-bottom: 28px;

      img {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        border: 3px solid $primary;
        object-fit: cover;
        box-shadow: 0 4px 16px rgba(95,117,214,0.35);
        margin-bottom: 12px;
      }

      h1 {
        font-size: 20px;
        font-weight: 700;
        color: $heading;
        margin: 0 0 4px;
        font-family: 'Inter', sans-serif;
      }

      p {
        color: #6b7280;
        font-size: 13px;
        margin: 0;
        font-family: 'Inter', sans-serif;
      }
    }

    .field {
      margin-bottom: 18px;

      label {
        display: block;
        font-size: 13px;
        font-weight: 500;
        margin-bottom: 6px;
        color: #374151;
        font-family: 'Inter', sans-serif;
      }
    }

    p-message { display: block; margin-bottom: 16px; }

    .back-link {
      text-align: center;
      margin-top: 16px;
    }

    .link-btn {
      background: none;
      border: none;
      color: $primary;
      font-size: 13px;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
      text-underline-offset: 2px;
      &:hover { color: darken($primary, 10%); }
    }
  `],
})
export class ResetPasswordComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private auth   = inject(AuthService);
  router         = inject(Router);

  token          = '';
  newPassword    = '';
  confirmPassword = '';
  loading        = signal(false);
  error          = signal('');
  done           = signal(false);

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  submit() {
    this.error.set('');
    if (!this.newPassword || this.newPassword.length < 6) {
      this.error.set('Пароль має містити мінімум 6 символів'); return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error.set('Паролі не збігаються'); return;
    }
    this.loading.set(true);
    this.auth.resetPassword(this.token, this.newPassword).subscribe({
      next: () => { this.done.set(true); this.loading.set(false); },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Помилка зміни паролю');
        this.loading.set(false);
      },
    });
  }
}
