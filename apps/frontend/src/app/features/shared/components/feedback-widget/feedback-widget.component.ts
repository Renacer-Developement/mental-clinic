import { Component, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { API_FEEDBACK } from '../../../../app.constants';
import { GoogleAnalyticsService } from '../../../../analytics/google-analytics.service';
import { EVENT_TRACK } from '../../../../analytics/analytics.constants';

type ContactMethod = 'phone' | 'telegram' | 'viber';
type State = 'form' | 'sending' | 'sent';

/**
 * Floating "request a call back" button on every page. Requests are stored by the
 * API (/api/feedback), shown in the admin under «Заявки» and announced in Telegram.
 */
@Component({
  selector: 'app-feedback-widget',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './feedback-widget.component.html',
  styleUrl: './feedback-widget.component.scss',
})
export class FeedbackWidgetComponent {
  private readonly http = inject(HttpClient);
  private readonly analytics = inject(GoogleAnalyticsService);
  private readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');

  readonly open = signal(false);
  readonly state = signal<State>('form');
  readonly error = signal('');

  name = '';
  phone = '';
  contactMethod: ContactMethod = 'phone';
  message = '';
  website = ''; // honeypot, hidden from people

  readonly methods: { value: ContactMethod; label: string }[] = [
    { value: 'phone', label: 'Дзвінок' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'viber', label: 'Viber' },
  ];

  toggle(): void {
    this.open() ? this.close() : this.show();
  }

  show(): void {
    if (this.state() === 'sent') this.reset();
    this.open.set(true);
    this.analytics.trackEvent(EVENT_TRACK.FEEDBACK_OPEN, { page_path: this.analytics.currentPath() });
    setTimeout(() => this.nameInput()?.nativeElement.focus(), 50);
  }

  close(): void {
    this.open.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.close();
  }

  submit(): void {
    this.error.set('');
    const digits = this.phone.replace(/\D/g, '');
    if (!this.name.trim()) return this.error.set('Вкажіть, як до вас звертатися');
    if (digits.length < 9 || digits.length > 15) return this.error.set('Перевірте номер телефону');

    this.state.set('sending');
    this.http.post(API_FEEDBACK, {
      name: this.name.trim(),
      phone: this.phone.trim(),
      contactMethod: this.contactMethod,
      message: this.message.trim(),
      pagePath: this.analytics.currentPath(),
      website: this.website,
    }).subscribe({
      next: () => {
        this.state.set('sent');
        this.analytics.trackLead('form', 'feedback-widget');
      },
      error: (err: HttpErrorResponse) => {
        this.state.set('form');
        this.error.set(err.error?.message
          || 'Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте: +38 (066) 569-16-77');
      },
    });
  }

  private reset(): void {
    this.name = this.phone = this.message = this.website = '';
    this.contactMethod = 'phone';
    this.error.set('');
    this.state.set('form');
  }
}
