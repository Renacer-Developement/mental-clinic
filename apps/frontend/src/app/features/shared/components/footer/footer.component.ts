import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../../../shared/primeng-imports.module';
import { RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { ClinicContactsService } from '../clinic-contacts-dialog/clinic-contacts.service';
import { clinicContacts } from '../../constants/contacts.constants';
import { GoogleAnalyticsService } from '../../../../analytics/google-analytics.service';
import { ConsentService } from '../../../../analytics/consent.service';
import { EVENT_TRACK } from '../../../../analytics/analytics.constants';
import { TEST_CATEGORY_CONTENT } from '../../../tests/constants/test-category-content.constants';
import { CONDITIONS } from '../../../conditions/conditions.data';

@Component({
  standalone: true,
  imports: [CommonModule, ImportsModule, RouterLink],
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  private readonly contactsService = inject(ClinicContactsService);
  private readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly consentService = inject(ConsentService);

  openCookieSettings(): void {
    this.consentService.reopen();
  }

  readonly conditions = CONDITIONS.map(c => ({ slug: c.slug, label: c.label }));

  readonly testCategories = Object.entries(TEST_CATEGORY_CONTENT).map(([slug, c]) => ({ slug, label: c.label }));

  /** Both clinic lines, formatted for display: +380665691677 → +38 (066) 569-16-77 */
  readonly phones = Object.values(clinicContacts).map(c => ({
    ...c,
    label: c.phone.replace(/^\+38(\d{3})(\d{3})(\d{2})(\d{2})$/, '+38 ($1) $2-$3-$4'),
  }));

  /**
   * Tracks social media link clicks
   * @param platform - Social media platform (Facebook, Instagram, Telegram)
   * @param url - The destination URL
   */
  trackSocialClick(platform: string, url: string) {
    this.googleAnalyticsService.trackEvent(EVENT_TRACK.SOCIAL_CLICK, {
      platform,
      destination_url: url,
    });
  }

  /**
   * Tracks clicks on footer links
   * @param linkName - The name of the link (e.g., "Публічний договір")
   * @param url - The destination URL
   */
  trackLinkClick(linkName: string, url: string) {
    this.googleAnalyticsService.trackEvent(EVENT_TRACK.FOOTER_LINK, {
      link_text: linkName,
      destination_url: url,
    });
  }

  /**
   * Opens the contacts dialog and tracks the event
   */
  openContacts() {
    this.contactsService.openDialog(clinicContacts);
    this.googleAnalyticsService.trackEvent(EVENT_TRACK.CONTACTS_OPEN, { source: 'footer' });
  }

  /** Smoothly returns to the top of the page (instant for reduced-motion users). */
  scrollToTop() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }
}
