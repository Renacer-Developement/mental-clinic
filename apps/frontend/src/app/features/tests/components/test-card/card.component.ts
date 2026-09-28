import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../../../shared/primeng-imports.module';
import { Component, inject, Input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Test } from '../../models/test.model';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from '../../../../analytics/google-analytics.service';
import { EVENT_TRACK } from '../../../../analytics/analytics.constants';

@Component({
  standalone: true,
  imports: [CommonModule, ImportsModule],
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() testData: any;
  protected readonly JSON = JSON;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  copied = signal(false);

  constructor(private router: Router, private googleAnalyticsService: GoogleAnalyticsService) {}

  ngOnInit(): void {}

  /**
   * Handles test card click, tracking analytics before navigation.
   * @param testId - The ID of the selected test.
   */
  redirectToTest(testId: string): void {
    // Track test card click event with structured analytics data
    this.googleAnalyticsService.trackEvent(EVENT_TRACK.SELECT_CONTENT, {
      content_type: 'test',
      item_id:      testId,
      item_name:    this.testData?.name ?? 'unknown',
    });

    // Navigate to test detail page
    this.router.navigate([`/test/detail`, testId]);
  }

  /** Native share sheet where available (mobile), otherwise copy the link. */
  async share(): Promise<void> {
    if (!this.isBrowser) return;
    const url = `${location.origin}/test/detail/${this.testData?._id}`;
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
