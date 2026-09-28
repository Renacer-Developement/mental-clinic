import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { Component, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ClinicContactsService } from '../../features/shared/components/clinic-contacts-dialog/clinic-contacts.service';
import { clinicContacts } from '../../features/shared/constants/contacts.constants';
import { GoogleAnalyticsService } from '../../analytics/google-analytics.service';
import { EVENT_TRACK } from '../../analytics/analytics.constants';
import { SECTION } from '../../shared/constants/section-ids.constants';
import { TEST_ROUTES, ROUTES } from '../../shared/constants/routes.constants';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, Button],
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
    this.isMenuOpen = !this.isMenuOpen;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }
    this.googleAnalyticsService.trackEvent(EVENT_TRACK.MENU_TOGGLE, {
      menu_state: this.isMenuOpen ? 'open' : 'closed',
    });
  }

  /**
   * Redirects to the main page and tracks the logo click event.
   */
  redirectToMainPage(): void {
    this.googleAnalyticsService.trackEvent(EVENT_TRACK.LOGO_CLICK, { source: 'navbar' });
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
    this.toggleMenu(); // Close menu after navigation
  }

  /**
   * Opens the contact dialog and tracks the click event.
   */
  openContacts(): void {
    this.googleAnalyticsService.trackEvent(EVENT_TRACK.CONTACTS_OPEN, { source: 'navbar' });
    this.contactsService.openDialog(clinicContacts);
    this.toggleMenu(); // Close menu after opening the dialog
  }
}
