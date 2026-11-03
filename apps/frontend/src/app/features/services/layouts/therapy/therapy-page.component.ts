import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingJourneyComponent } from '../../booking-journey/booking-journey.component';
import { ServiceFaqComponent } from '../service-faq.component';
import { ServiceLayout } from '../service-layout';

/** Психотерапія: lilac banner with a speech bubble → centred hero, bubble cloud, vertical timeline. */
@Component({
  standalone: true,
  imports: [RouterLink, BookingJourneyComponent, ServiceFaqComponent],
  selector: 'app-therapy-page',
  templateUrl: './therapy-page.component.html',
  styleUrl: './therapy-page.component.scss',
})
export class TherapyPageComponent extends ServiceLayout {
  readonly compare = [
    { aspect: 'Хто це', therapist: 'Психолог із підготовкою в доказовому методі психотерапії', psychiatrist: 'Лікар зі спеціалізацією «психіатрія»' },
    { aspect: 'Як допомагає', therapist: 'Розмова, вправи, домашні завдання між сесіями', psychiatrist: 'Діагностика, за потреби — ліки' },
    { aspect: 'Як часто', therapist: 'Регулярні сесії, найчастіше раз на тиждень', psychiatrist: 'Консультації раз на кілька тижнів для контролю лікування' },
    { aspect: 'Коли обирати', therapist: 'Стрес, стосунки, тривога, повторювані сценарії', psychiatrist: 'Стан тримається тижнями, заважає жити, є думки про самогубство' },
  ];
}
