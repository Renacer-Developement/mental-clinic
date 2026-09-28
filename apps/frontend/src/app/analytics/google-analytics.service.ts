import { DestroyRef, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

// GA4 measurement ID — single source of truth
export const GA_MEASUREMENT_ID = 'G-QL51QSPEPK';

// Proper typing: gtag is a global injected by the gtag.js snippet
declare function gtag(command: 'config', targetId: string, config?: Record<string, unknown>): void;
declare function gtag(command: 'event', eventName: string, params?: Record<string, unknown>): void;
declare function gtag(command: 'js', date: Date): void;

@Injectable({ providedIn: 'root' })
export class GoogleAnalyticsService {
  private readonly router   = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  /** Angular SPA path of the previous page — used as page_referrer. */
  private previousUrl = '';

  /**
   * Subscribe to Angular router events and send a GA4 page_view on every
   * completed navigation.  Must be called once from AppComponent.ngOnInit().
   *
   * index.html initialises gtag with `send_page_view: false` so the SDK
   * never fires an automatic page_view — this method owns all page_view hits.
   *
   * No-op on the server — gtag isn't loaded there and window/document aren't available.
   */
  initializeTracking(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(event => {
        const url = event.urlAfterRedirects;

        gtag('event', 'page_view', {
          // GA4 expects the full URL, not just the path
          page_location: `${window.location.origin}${url}`,
          page_title:    document.title,
          // For the first navigation use the browser's actual referrer;
          // for subsequent SPA navigations use the previous Angular route.
          page_referrer: this.previousUrl
            ? `${window.location.origin}${this.previousUrl}`
            : document.referrer,
        });

        this.previousUrl = url;
      });
  }

  /**
   * Send a custom GA4 event.
   *
   * Use flat, snake_case GA4-style params — do NOT pass `event_category` or
   * `event_label` (those are Universal Analytics concepts and are ignored in GA4).
   *
   * @example
   *   trackEvent('select_content', { content_type: 'test', item_id: id });
   *   trackEvent('search', { search_term: query });
   */
  trackEvent(eventName: string, params: Record<string, string | number | boolean> = {}): void {
    if (typeof gtag !== 'function') return;
    gtag('event', eventName, params);
  }
}
