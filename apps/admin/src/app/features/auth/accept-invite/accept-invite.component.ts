import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-accept-invite',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, PasswordModule, ButtonModule, MessageModule],
  template: `
    <div class="wrap">
      <div class="card">
        <div class="header">
          <img src="logo.avif" alt="Логотип" />
          <h1>Онлайн центр ментального здоров'я Євгена Скрипника</h1>
          <p>Заповніть профіль для завершення реєстрації</p>
        </div>

        @if (!token) {
          <p-message severity="error" text="Посилання недійсне або протерміноване" styleClass="w-full" />
        } @else if (done()) {
          <div class="success-block">
            <i class="pi pi-check-circle"></i>
            <h3>Профіль налаштовано!</h3>
            <p>Тепер ви можете увійти до системи.</p>
            <p-button label="Перейти до входу" icon="pi pi-sign-in"
              styleClass="w-full" (onClick)="router.navigate(['/login'])" />
          </div>
        } @else {
          @if (error()) {
            <p-message severity="error" [text]="error()" styleClass="w-full" />
          }

          <div class="row">
            <div class="field">
              <label>Імʼя *</label>
              <input pInputText [(ngModel)]="form.name" class="w-full" placeholder="Іван" />
            </div>
            <div class="field">
              <label>Прізвище</label>
              <input pInputText [(ngModel)]="form.lastName" class="w-full" placeholder="Петренко" />
            </div>
          </div>

          <div class="field">
            <label>Номер телефону</label>
            <input pInputText [(ngModel)]="form.phone" class="w-full" placeholder="+380 99 123 45 67" />
          </div>

          <div class="field">
            <label>Пароль *</label>
            <p-password [(ngModel)]="form.password" [feedback]="true" [toggleMask]="true"
                        styleClass="w-full" inputStyleClass="w-full"
                        placeholder="Мінімум 6 символів"
                        promptLabel="Введіть пароль"
                        weakLabel="Слабкий" mediumLabel="Середній" strongLabel="Надійний" />
          </div>

          <div class="field">
            <label>Підтвердіть пароль *</label>
            <p-password [(ngModel)]="form.confirm" [feedback]="false" [toggleMask]="true"
                        styleClass="w-full" inputStyleClass="w-full"
                        placeholder="Повторіть пароль" />
          </div>

          <p-button label="Завершити реєстрацію" icon="pi pi-check" styleClass="w-full"
            [loading]="loading()" (onClick)="submit()" />
        }
      </div>
    </div>
  `,
  styles: [`
    $primary: #5f75d6;
    $heading: #003168;

    .wrap {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, $heading 0%, #1a3a7a 50%, darken($primary, 10%) 100%);
      padding: 32px 16px;
    }

    .card {
      background: #fff;
      border-radius: 16px;
      padding: 44px 40px;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .header {
      text-align: center;
      margin-bottom: 4px;

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
        font-size: 16px;
        font-weight: 700;
        color: $heading;
        margin: 0 0 4px;
        font-family: 'Inter', sans-serif;
        line-height: 1.35;
      }

      p {
        color: #6b7280;
        font-size: 13px;
        margin: 0;
        font-family: 'Inter', sans-serif;
      }
    }

    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 13px;
        font-weight: 500;
        color: #374151;
        font-family: 'Inter', sans-serif;
      }
    }

    .success-block {
      text-align: center;
      padding: 16px 0;

      i {
        font-size: 48px;
        color: #22c55e;
        display: block;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        font-weight: 700;
        color: $heading;
        margin: 0 0 8px;
        font-family: 'Inter', sans-serif;
      }

      p {
        color: #6b7280;
        font-size: 14px;
        margin: 0 0 24px;
        font-family: 'Inter', sans-serif;
      }
    }

    p-message { display: block; }
  `],
})
export class AcceptInviteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private auth  = inject(AuthService);
  router        = inject(Router);

  token   = '';
  loading = signal(false);
  error   = signal('');
  done    = signal(false);

  form = { name: '', lastName: '', phone: '', password: '', confirm: '' };

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  submit() {
    this.error.set('');
    if (!this.form.name) { this.error.set('Введіть імʼя'); return; }
    if (!this.form.password || this.form.password.length < 6) {
      this.error.set('Пароль має містити мінімум 6 символів'); return;
    }
    if (this.form.password !== this.form.confirm) {
      this.error.set('Паролі не збігаються'); return;
    }
    this.loading.set(true);
    this.auth.acceptInvite(this.token, {
      name:     this.form.name,
      lastName: this.form.lastName,
      phone:    this.form.phone,
      password: this.form.password,
    }).subscribe({
      next: () => { this.done.set(true); this.loading.set(false); },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Помилка реєстрації');
        this.loading.set(false);
      },
    });
  }
}
