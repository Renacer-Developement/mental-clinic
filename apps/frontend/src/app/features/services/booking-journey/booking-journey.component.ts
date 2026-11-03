import { afterNextRender, Component, computed, ElementRef, inject, Injector, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { API_FEEDBACK } from '../../../app.constants';
import { GoogleAnalyticsService } from '../../../analytics/google-analytics.service';
import { EVENT_TRACK } from '../../../analytics/analytics.constants';
import { clinicContacts } from '../../shared/constants/contacts.constants';
import { ServiceContent } from '../services.data';

type ContactMethod = 'phone' | 'telegram' | 'viber';
type State = 'form' | 'sending' | 'sent';

const TIMES = [
  { id: 'morning', label: 'Зранку', hint: '8:00–12:00' },
  { id: 'day', label: 'Удень', hint: '12:00–17:00' },
  { id: 'evening', label: 'Увечері', hint: '17:00–22:00' },
  { id: 'any', label: 'Будь-коли', hint: 'найближчий вільний час' },
];

const METHODS: { value: ContactMethod; label: string }[] = [
  { value: 'phone', label: 'Дзвінок' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'viber', label: 'Viber' },
];

/** The feedback API names the two booking lines by specialist */
const SPECIALIST = { doctors: 'doctor', psychologists: 'psychologist' } as const;

/** +380665691677 → +38 (066) 569-16-77 */
const formatPhone = (p: string) => p.replace(/^\+38(\d{3})(\d{3})(\d{2})(\d{2})$/, '+38 ($1) $2-$3-$4');

/** Mid-sentence casing that keeps abbreviations like РДУГ intact */
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/**
 * Step-by-step booking on a service page: who the visit is for → what worries
 * them → when it suits → name and phone. The request goes to /api/feedback, the
 * same endpoint as the call-back widget: stored under «Заявки» in the admin and
 * sent to the doctors' or psychologists' Telegram bot. GA only gets step
 * numbers and the lead event, never the answers.
 */
@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-booking-journey',
  templateUrl: './booking-journey.component.html',
  styleUrl: './booking-journey.component.scss',
})
export class BookingJourneyComponent {
  private readonly http = inject(HttpClient);
  private readonly analytics = inject(GoogleAnalyticsService);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly injector = inject(Injector);

  readonly service = input.required<ServiceContent>();

  protected readonly TIMES = TIMES;
  protected readonly METHODS = METHODS;
  protected readonly STEPS = ['Для кого', 'Що турбує', 'Коли зручно', 'Контакти'];

  readonly step = signal(0);
  readonly who = signal<string | null>(null);
  readonly concerns = signal<string[]>([]);
  readonly time = signal<string | null>(null);

  readonly state = signal<State>('form');
  readonly error = signal('');
  /** Which field the error is about, for aria-invalid */
  readonly invalid = signal<'name' | 'phone' | null>(null);

  name = '';
  phoneInput = '';
  contactMethod: ContactMethod = 'phone';
  website = ''; // honeypot, hidden from people

  readonly phone = computed(() => clinicContacts[this.service().line].phone);
  readonly phoneText = computed(() => formatPhone(this.phone()));

  /** The answers as the request text the administrator reads in Telegram */
  readonly summary = computed(() => {
    const s = this.service();
    const who = s.journey.who.find(o => o.id === this.who())?.label;
    const time = TIMES.find(t => t.id === this.time());
    const lines = [`Послуга: ${s.specialist}`];
    if (who) lines.push(`Для кого: ${lowerFirst(who)}`);
    if (this.concerns().length) lines.push(`Що турбує: ${this.concerns().map(lowerFirst).join(', ')}`);
    if (time) lines.push(time.id === 'any' ? 'Час: найближчий вільний' : `Зручно: ${time.label.toLowerCase()} (${time.hint})`);
    return lines.join('\n');
  });

  pickWho(id: string): void {
    this.who.set(id);
    this.next();
  }

  toggleConcern(c: string): void {
    this.concerns.update(list => (list.includes(c) ? list.filter(x => x !== c) : [...list, c]));
  }

  pickTime(id: string): void {
    this.time.set(id);
    this.next();
  }

  next(): void {
    this.analytics.trackEvent(EVENT_TRACK.BOOKING_STEP, { step: this.step() + 1, service: this.service().slug });
    this.show(Math.min(this.step() + 1, this.STEPS.length - 1));
  }

  back(): void {
    this.show(Math.max(this.step() - 1, 0));
  }

  goTo(i: number): void {
    // Only back to answered steps; forward goes through the buttons
    if (i < this.step() && this.state() !== 'sent') this.show(i);
  }

  submit(): void {
    this.error.set('');
    this.invalid.set(null);
    const digits = this.phoneInput.replace(/\D/g, '');
    if (!this.name.trim()) return this.fail('name', 'Вкажіть, як до вас звертатися');
    if (digits.length < 9 || digits.length > 15) return this.fail('phone', 'Перевірте номер телефону');

    this.state.set('sending');
    this.http.post(API_FEEDBACK, {
      specialist: SPECIALIST[this.service().line],
      name: this.name.trim(),
      phone: this.phoneInput.trim(),
      contactMethod: this.contactMethod,
      message: this.summary(),
      pagePath: this.analytics.currentPath(),
      website: this.website,
    }).subscribe({
      next: () => {
        this.state.set('sent');
        this.analytics.trackLead('form', `service-journey:${this.service().slug}`);
        this.focusQuestion();
      },
      error: (err: HttpErrorResponse) => {
        this.state.set('form');
        this.error.set(err.error?.message || `Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте: ${this.phoneText()}`);
      },
    });
  }

  trackCall(): void {
    this.analytics.trackLead('phone', `service-journey:${this.service().slug}`);
  }

  private fail(field: 'name' | 'phone', message: string): void {
    this.invalid.set(field);
    this.error.set(message);
    this.host.nativeElement.querySelector<HTMLInputElement>(`#bj-${field}`)?.focus();
  }

  /**
   * The button that was pressed disappears with its step, so focus moves to
   * the new question — screen readers read it and Tab continues from there.
   */
  private show(i: number): void {
    this.error.set('');
    this.invalid.set(null);
    this.step.set(i);
    this.focusQuestion();
  }

  private focusQuestion(): void {
    afterNextRender(() => this.host.nativeElement.querySelector<HTMLElement>('.bj-q')?.focus(), { injector: this.injector });
  }
}
