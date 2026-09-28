import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SupportService } from '../../../core/services/support.service';
import { AuthService } from '../../../core/services/auth.service';

type SubStep = 'form' | 'success';

@Component({
  selector: 'app-support-fab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-fab.component.html',
  styleUrl: './support-fab.component.scss',
})
export class SupportFabComponent {
  private http    = inject(HttpClient);
  private support = inject(SupportService);
  private auth    = inject(AuthService);

  private localStep = signal<SubStep>('form');
  step = computed(() => this.support.panelOpen() ? this.localStep() : 'closed');

  sending = signal(false);
  error   = signal('');
  message = '';

  close() { this.support.close(); }

  send() {
    if (!this.message.trim()) {
      this.error.set('Введіть повідомлення.');
      return;
    }
    this.sending.set(true);
    this.error.set('');

    const user = this.auth.currentUser();
    const fullName = [user?.name, user?.lastName].filter(Boolean).join(' ') || 'Admin Panel';

    this.http.post(`${environment.apiUrl}/support/message`, {
      name:    fullName,
      email:   user?.email ?? '',
      phone:   user?.phone ?? '',
      message: this.message.trim(),
    }).subscribe({
      next: () => {
        this.sending.set(false);
        this.localStep.set('success');
        this.message = '';
      },
      error: () => {
        this.sending.set(false);
        this.error.set('Помилка надсилання. Спробуйте пізніше.');
      },
    });
  }

  again() { this.localStep.set('form'); }
}
