import { DestroyRef, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { loadAnalyticsTags, loadMarketingTags, trackVirtualPageView } from './tracking-loader';

export interface ConsentChoice {
  /** Behaviour analytics: GA4 cookies, GTM, Hotjar, Plerdy */
  analytics: boolean;
  /** Ad pixels: Google Ads, Meta, TikTok, LinkedIn, X */
  marketing: boolean;
}

// index.html reads the same key before GA boots to restore Consent Mode early.
export const CONSENT_STORAGE_KEY = 'tracking-consent-v1';

declare function gtag(command: 'consent', action: 'update', params: Record<string, string>): void;

@Injectable({ providedIn: 'root' })
export class ConsentService {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly choice = signal<ConsentChoice | null>(null);
  readonly bannerOpen = signal(false);

  /** Call once from AppComponent. */
  init(): void {
    if (!this.isBrowser) return;

    const stored = this.read();
    if (stored) {
      this.choice.set(stored);
      this.apply(stored);
    } else {
      this.bannerOpen.set(true);
    }

    // The initial navigation (id 1) is counted by each tag when it loads.
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd && e.id > 1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(e => trackVirtualPageView(e.urlAfterRedirects));
  }

  save(next: ConsentChoice): void {
    const prev = this.choice();
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
    } catch { /* storage blocked — the choice still applies for this visit */ }
    this.choice.set(next);
    this.bannerOpen.set(false);
    this.apply(next);

    // Loaded vendor scripts can't be unloaded; a reload is the only clean way to stop them.
    if ((prev?.analytics && !next.analytics) || (prev?.marketing && !next.marketing)) {
      location.reload();
    }
  }

  reopen(): void {
    this.bannerOpen.set(true);
  }

  private apply(c: ConsentChoice): void {
    const state = (granted: boolean) => (granted ? 'granted' : 'denied');
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        analytics_storage: state(c.analytics),
        ad_storage: state(c.marketing),
        ad_user_data: state(c.marketing),
        ad_personalization: state(c.marketing),
      });
    }
    if (c.analytics) loadAnalyticsTags();
    if (c.marketing) loadMarketingTags();
  }

  private read(): ConsentChoice | null {
    try {
      const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!raw) return null;
      const v = JSON.parse(raw);
      return { analytics: !!v.analytics, marketing: !!v.marketing };
    } catch {
      return null;
    }
  }
}
