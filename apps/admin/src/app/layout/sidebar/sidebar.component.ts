import { Component, DestroyRef, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { SupportService } from '../../core/services/support.service';
import { FeedbackService } from '../../core/services/feedback.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, startWith, switchMap } from 'rxjs';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[]; // if set, only these roles can see the item
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <img src="logo.avif" alt="Логотип" class="sidebar-logo-img" />
        <div class="sidebar-logo-text">
          <span class="sidebar-logo-title">Онлайн центр ментального здоров'я</span>
          <span class="sidebar-logo-sub">Євгена Скрипника</span>
        </div>
      </div>
      <nav>
        @for (item of items; track item.route) {
          <a [routerLink]="item.route" routerLinkActive="active" class="nav-item"
             (click)="closeRequest.emit()">
            <i [class]="'pi ' + item.icon"></i>
            <span>{{ item.label }}</span>
            @if (item.route === '/requests' && feedback.newCount() > 0) {
              <span class="nav-badge">{{ feedback.newCount() }}</span>
            }
          </a>
        }
      </nav>
      <div class="sidebar-footer">
        <button class="support-btn nav-item" (click)="support.toggle(); closeRequest.emit()">
          <i class="pi pi-headphones"></i>
          <span>Підтримка</span>
        </button>
        <div class="footer-divider"></div>
        <button class="logout-btn" (click)="logoutRequest.emit()">
          <i class="pi pi-sign-out"></i>
          <span>Вийти</span>
        </button>
      </div>
    </aside>
  `,
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  @Input() open = false;
  @Output() closeRequest  = new EventEmitter<void>();
  @Output() logoutRequest = new EventEmitter<void>();
  @HostBinding('class.is-open') get isOpen() { return this.open; }

  private auth = inject(AuthService);
  support      = inject(SupportService);
  feedback     = inject(FeedbackService);
  private destroyRef = inject(DestroyRef);

  /** Keeps the "Заявки" badge current: new requests arrive while the admin is open. */
  ngOnInit() {
    const role = this.auth.currentUser()?.role;
    if (role !== 'admin' && role !== 'doctor') return;
    interval(2 * 60_000).pipe(
      startWith(0),
      switchMap(() => this.feedback.getAll('new')),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({ error: () => {} });
  }

  private allItems: NavItem[] = [
    { label: 'Панель',      icon: 'pi-home',      route: '/dashboard' },
    { label: 'Статті',      icon: 'pi-file-edit', route: '/articles' },
    { label: 'Тести',       icon: 'pi-clipboard', route: '/tests' },
    { label: 'Команда',     icon: 'pi-id-card',   route: '/team',  roles: ['admin'] },
    { label: 'Заявки',      icon: 'pi-inbox',     route: '/requests', roles: ['admin', 'doctor'] },
    { label: 'Відгуки',     icon: 'pi-star',      route: '/reviews' },
    { label: 'Договір',     icon: 'pi-file-edit', route: '/contract', roles: ['admin'] },
    { label: 'Користувачі', icon: 'pi-users',     route: '/users', roles: ['admin'] },
  ];

  get items(): NavItem[] {
    const role = this.auth.currentUser()?.role;
    return this.allItems.filter(item => !item.roles || item.roles.includes(role ?? ''));
  }

  doLogout() { this.auth.logout(); }
}
