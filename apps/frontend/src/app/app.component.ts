import { RouterOutlet } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from './analytics/google-analytics.service';
import { ClinicContactsDialogComponent } from './features/shared/components/clinic-contacts-dialog/clinic-contacts-dialog.component';
@Component({
  standalone: true,
  imports: [RouterOutlet, ClinicContactsDialogComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly googleAnalyticsService = inject(GoogleAnalyticsService);

  ngOnInit() {
    this.googleAnalyticsService.initializeTracking();
  }
}
