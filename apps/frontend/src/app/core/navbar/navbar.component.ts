import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, inject, OnDestroy, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ClinicContactsService } from '../../features/shared/components/clinic-contacts-dialog/clinic-contacts.service';
import { clinicContacts } from '../../features/shared/constants/contacts.constants';
import { GoogleAnalyticsService } from '../../analytics/google-analytics.service';
import { EVENT_TRACK } from '../../analytics/analytics.constants';
import { SECTION } from '../../shared/constants/section-ids.constants';
import { TEST_ROUTES, ROUTES } from '../../shared/constants/routes.constants';
import { CATEGORY_SECTIONS } from '../../features/tests/constants/test-sections.constants';
import { TEST_CATEGORY_CONTENT } from '../../features/tests/constants/test-category-content.constants';
import { sectionAnchor } from '../../features/tests/constants/test-sections.constants';
import { ARTICLE_CATEGORIES } from '../../features/articles/constants/article-categories.constants';
import { CONDITIONS } from '../../features/conditions/conditions.data';
import { NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly contactsService = inject(ClinicContactsService);
  private readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly platformId = inject(PLATFORM_ID);

  isMenuOpen = false;
  /** Which accordion is expanded in the mobile menu. */
  mobileSection: 'conditions' | 'tests' | 'articles' | null = null;
  /** Which desktop dropdown is open. A signal, because it is also changed from a
   *  timer (delayed close) and the app runs without zone.js change detection. */
  readonly mega = signal<'conditions' | 'tests' | 'articles' | null>(null);
  private megaCloseTimer?: ReturnType<typeof setTimeout>;

  /** Test categories with their sections, for the tests mega menu. */
  readonly testMenu = Object.entries(CATEGORY_SECTIONS).map(([slug, cfg]) => ({
    slug,
    label: TEST_CATEGORY_CONTENT[slug]?.label ?? slug,
    sections: cfg.sections.map(title => ({ title, anchor: sectionAnchor(title) })),
  }));

  readonly articleMenu = ARTICLE_CATEGORIES.filter(c => c.value);

  /** Condition pages (/likuvannya-*), for the "Що лікуємо" menu. */
  readonly conditionMenu = CONDITIONS.map(c => ({ slug: c.slug, label: c.label }));

  readonly phone = clinicContacts.doctors.phone;
  /** +380665691677 → +38 (066) 569-16-77 */
  readonly phoneLabel = this.phone.replace(/^\+38(\d{3})(\d{3})(\d{2})(\d{2})$/, '+38 ($1) $2-$3-$4');

  constructor() {
    // close dropdowns whenever navigation starts
    this.router.events.pipe(filter(e => e instanceof NavigationStart), takeUntilDestroyed()).subscribe(() => {
      this.closeMega(true);
      this.closeMenu();
    });
  }

  openMega(which: 'conditions' | 'tests' | 'articles'): void {
    clearTimeout(this.megaCloseTimer);
    this.mega.set(which);
  }

  /**
   * Click/tap opens the panel. It deliberately doesn't toggle: on desktop the pointer has
   * already opened it via mouseenter, so a toggle would immediately close it again.
   * Closing happens on mouseleave, Escape, backdrop click or navigation.
   */
  onTriggerClick(which: 'conditions' | 'tests' | 'articles'): void {
    clearTimeout(this.megaCloseTimer);
    this.mega.set(which);
  }

  /** Small delay so the pointer can travel from the trigger into the panel. */
  closeMega(immediate = false): void {
    clearTimeout(this.megaCloseTimer);
    if (immediate) {
      this.mega.set(null);
      return;
    }
    this.megaCloseTimer = setTimeout(() => this.mega.set(null), 120);
  }

  trackNav(route: string, label: string): void {
    this.googleAnalyticsService.trackEvent(EVENT_TRACK.NAV_CLICK, { link_text: label, destination: route });
  }

  trackPhone(source: string): void {
    this.googleAnalyticsService.trackLead('phone', source);
  }

  openContactsDesktop(): void {
    this.contactsService.openDialog(clinicContacts, 'navbar');
  }
  protected readonly SECTION = SECTION;
  protected readonly ROUTES = ROUTES;
  protected readonly TEST_ROUTES = TEST_ROUTES;

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  /**
   * Toggles the navigation menu state and tracks the event.
   */
  toggleMenu(): void {
    this.setMenu(!this.isMenuOpen);
    this.googleAnalyticsService.trackEvent(EVENT_TRACK.MENU_TOGGLE, {
      menu_state: this.isMenuOpen ? 'open' : 'closed',
    });
  }

  closeMenu(): void {
    if (this.isMenuOpen) this.setMenu(false);
  }

  toggleMobileSection(which: 'conditions' | 'tests' | 'articles'): void {
    this.mobileSection = this.mobileSection === which ? null : which;
  }

  /** Opens/closes the mobile menu and locks page scroll while it is open. */
  private setMenu(open: boolean): void {
    this.isMenuOpen = open;
    if (!open) this.mobileSection = null;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = open ? 'hidden' : '';
    }
  }

  /**
   * Redirects to the main page and tracks the logo click event.
   */
  redirectToMainPage(): void {
    this.googleAnalyticsService.trackEvent(EVENT_TRACK.LOGO_CLICK, { cta_location: 'navbar' });
    this.router.navigate(['/']);
  }

  /**
   * Navigates to a specified route, tracks navigation, and closes the menu.
   * @param route - The target route
   * @param label - The label for tracking (e.g., 'Тести', 'Перевірка ліків')
   */
  navigateTo(route: string, label: string): void {
    this.googleAnalyticsService.trackEvent(EVENT_TRACK.NAV_CLICK, {
      link_text: label,
      destination: route,
    });
    this.router.navigate([route]);
    this.closeMenu();
  }

  /**
   * Opens the contact dialog and tracks the click event.
   */
  openContacts(): void {
    this.contactsService.openDialog(clinicContacts, 'navbar-mobile');
    this.closeMenu();
  }
}
