import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TopbarComponent } from './layout/topbar/topbar.component';
import { SupportFabComponent } from './shared/components/support-fab/support-fab.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, SupportFabComponent],
  template: `
    <div class="shell" [class.sidebar-open]="sidebarOpen()">
      <app-sidebar [open]="sidebarOpen()"
                   (closeRequest)="sidebarOpen.set(false)"
                   (logoutRequest)="showLogout.set(true)" />
      <div class="shell-overlay" (click)="sidebarOpen.set(false)"></div>
      <div class="shell-body">
        <app-topbar (toggleSidebar)="sidebarOpen.set(!sidebarOpen())" />
        <main class="shell-content">
          <router-outlet />
        </main>
      </div>
    </div>
    <app-support-fab />

    @if (showLogout()) {
      <div class="logout-overlay" (click)="showLogout.set(false)">
        <div class="logout-card" (click)="$event.stopPropagation()">
          <div class="logout-icon">
            <i class="pi pi-sign-out"></i>
          </div>
          <h3 class="logout-title">Вийти з системи?</h3>
          <p class="logout-desc">Ваша сесія буде завершена. Щоб продовжити роботу, потрібно буде увійти знову.</p>
          <div class="logout-actions">
            <button class="logout-btn-cancel" (click)="showLogout.set(false)">Скасувати</button>
            <button class="logout-btn-confirm" (click)="doLogout()">
              <i class="pi pi-sign-out"></i> Вийти
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .shell { display: flex; align-items: flex-start; }
    .shell-body { flex: 1; display: flex; flex-direction: column; min-width: 0; min-height: 100vh; background: #f2f3f3; }
    .shell-content { flex: 1; }

    .shell-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 150;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s;
    }

    @media (max-width: 768px) {
      .shell-overlay { display: block; }
      .shell.sidebar-open .shell-overlay { opacity: 1; pointer-events: all; }
    }

    /* ── Logout modal ─────────────────────────────────── */
    .logout-overlay {
      position: fixed;
      inset: 0;
      background: rgba(3, 10, 30, 0.5);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: overlayIn 0.2s ease;
    }

    .logout-card {
      background: #fff;
      border-radius: 24px;
      padding: 40px 32px 32px;
      width: 360px;
      max-width: calc(100vw - 32px);
      text-align: center;
      box-shadow: 0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04);
      animation: cardIn 0.28s cubic-bezier(0.34, 1.3, 0.64, 1);
    }

    .logout-icon {
      width: 72px; height: 72px; border-radius: 50%;
      background: linear-gradient(145deg, #fee2e2 0%, #fecaca 100%);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 22px;
      box-shadow: 0 4px 16px rgba(239,68,68,0.2);
      i { font-size: 28px; color: #dc2626; }
    }

    .logout-title {
      font-size: 20px; font-weight: 700; color: #111827;
      font-family: 'Inter', sans-serif; margin: 0 0 10px; letter-spacing: -0.3px;
    }

    .logout-desc {
      font-size: 14px; color: #6b7280;
      font-family: 'Inter', sans-serif; line-height: 1.65; margin: 0 0 30px;
    }

    .logout-actions { display: flex; gap: 10px; }

    .logout-btn-cancel, .logout-btn-confirm {
      flex: 1; padding: 12px 0; border-radius: 12px;
      font-size: 14px; font-weight: 600; font-family: 'Inter', sans-serif;
      cursor: pointer; border: none;
      transition: all 0.15s ease;
      display: flex; align-items: center; justify-content: center; gap: 6px;
    }

    .logout-btn-cancel {
      background: #f3f4f6; color: #374151;
      &:hover { background: #e5e7eb; }
    }

    .logout-btn-confirm {
      background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);
      color: #fff;
      box-shadow: 0 4px 14px rgba(220,38,38,0.4);
      i { font-size: 13px; }
      &:hover { background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); transform: translateY(-1px); }
      &:active { transform: translateY(0); }
    }

    @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes cardIn {
      from { opacity: 0; transform: scale(0.92) translateY(12px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
  `],
})
export class AppShellComponent {
  private auth = inject(AuthService);
  sidebarOpen  = signal(false);
  showLogout   = signal(false);

  doLogout() {
    this.showLogout.set(false);
    this.auth.logout();
  }
}
