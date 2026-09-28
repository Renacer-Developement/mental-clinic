import { Component, EventEmitter, inject, computed, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, TooltipModule],
  template: `
    <header class="topbar">
      <div class="topbar-left">
        <button class="menu-toggle" (click)="toggleSidebar.emit()" aria-label="Меню">
          <i class="pi pi-bars"></i>
        </button>
        <span class="page-title">Панель адміністратора</span>
      </div>
      <div class="topbar-right">
        <a routerLink="/account" class="user-info">
          <div class="avatar">{{ initials() }}</div>
          <div class="user-meta">
            <span class="user-name">{{ auth.currentUser()?.name }}</span>
            <span class="user-role">{{ auth.currentUser()?.role === 'admin' ? 'Адміністратор' : 'Користувач' }}</span>
          </div>
        </a>
      </div>
    </header>
  `,
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  auth = inject(AuthService);

  initials = computed(() => {
    const name = this.auth.currentUser()?.name ?? '';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'A';
  });
}
