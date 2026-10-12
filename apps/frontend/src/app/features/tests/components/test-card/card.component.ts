import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../../../shared/primeng-imports.module';
import { Component, inject, Input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Test, testKey } from '../../models/test.model';
import { RouterLink } from '@angular/router';
import { GoogleAnalyticsService } from '../../../../analytics/google-analytics.service';
import { EVENT_TRACK } from '../../../../analytics/analytics.constants';

@Component({
  standalone: true,
  imports: [CommonModule, ImportsModule, RouterLink],
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() testData: any;
  protected readonly JSON = JSON;
  protected readonly testKey = testKey;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  copied = signal(false);

  constructor(private googleAnalyticsService: GoogleAnalyticsService) {}

  ngOnInit(): void {}

  /**
   * Tracks a test card click; navigation itself is a real <a routerLink> so crawlers can follow it.
   * @param testId - The ID of the selected test.
   */
  trackSelect(testId: string): void {
    // Track test card click event with structured analytics data
    this.googleAnalyticsService.trackEvent(EVENT_TRACK.SELECT_CONTENT, {
      content_type: 'test',
      item_id:      testId,
      item_name:    this.testData?.name ?? 'unknown',
    });
  }

  /** Native share sheet where available (mobile), otherwise copy the link. */
  async share(): Promise<void> {
    if (!this.isBrowser) return;
    const url = `${location.origin}/test/detail/${testKey(this.testData)}`;
    const title = this.testData?.name ?? 'Тест';

    this.googleAnalyticsService.trackEvent('share', { content_type: 'test', item_id: this.testData?._id });

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch { /* user dismissed the sheet */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch { /* clipboard unavailable */ }
  }
}
