import { RouterOutlet } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from './analytics/google-analytics.service';
import { ConsentService } from './analytics/consent.service';
import { CookieConsentComponent } from './features/shared/components/cookie-consent/cookie-consent.component';
import { ClinicContactsDialogComponent } from './features/shared/components/clinic-contacts-dialog/clinic-contacts-dialog.component';
@Component({
  standalone: true,
  imports: [RouterOutlet, ClinicContactsDialogComponent, CookieConsentComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly consentService = inject(ConsentService);

  ngOnInit() {
    this.googleAnalyticsService.initializeTracking();
    this.consentService.init();
  }
}
