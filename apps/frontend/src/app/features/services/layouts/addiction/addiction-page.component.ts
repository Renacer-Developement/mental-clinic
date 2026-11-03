import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingJourneyComponent } from '../../booking-journey/booking-journey.component';
import { ServiceFaqComponent } from '../service-faq.component';
import { ServiceLayout } from '../service-layout';

/** Адиктолог: sunset-and-mountains banner → warm sky hero, navy ink, editorial list. */
@Component({
  standalone: true,
  imports: [RouterLink, BookingJourneyComponent, ServiceFaqComponent],
  selector: 'app-addiction-page',
  templateUrl: './addiction-page.component.html',
  styleUrl: './addiction-page.component.scss',
})
export class AddictionPageComponent extends ServiceLayout {
  /** "Ігрова залежність: азартні ігри…" → title + detail, for the numbered rows */
  readonly kinds = computed(() =>
    this.service().helps.map(h => {
      const [title, detail] = h.split(/:\s(.+)/);
      return { title, detail };
    }),
  );
}
