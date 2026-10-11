import { Component, effect, inject, signal } from '@angular/core';
import { ConsentService } from '../../../../analytics/consent.service';

@Component({
  standalone: true,
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.scss',
})
export class CookieConsentComponent {
  protected readonly consent = inject(ConsentService);

  protected readonly showSettings = signal(false);
  protected readonly analytics = signal(false);
  protected readonly marketing = signal(false);

  constructor() {
    // Re-opening from the footer starts from the visitor's current choice.
    effect(() => {
      if (!this.consent.bannerOpen()) return;
      const c = this.consent.choice();
      this.analytics.set(c?.analytics ?? false);
      this.marketing.set(c?.marketing ?? false);
      this.showSettings.set(!!c);
    });
  }

  acceptAll(): void {
    this.consent.save({ analytics: true, marketing: true });
  }

  rejectAll(): void {
    this.consent.save({ analytics: false, marketing: false });
  }

  saveSelection(): void {
    this.consent.save({ analytics: this.analytics(), marketing: this.marketing() });
  }
}
