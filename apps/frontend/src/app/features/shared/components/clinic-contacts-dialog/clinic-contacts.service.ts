import {Injectable, inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {GoogleAnalyticsService} from '../../../../analytics/google-analytics.service';
import {EVENT_TRACK} from '../../../../analytics/analytics.constants';

@Injectable({
  providedIn: 'root'
})
export class ClinicContactsService {
  private readonly analytics = inject(GoogleAnalyticsService);

  private dialogVisibility = new BehaviorSubject<boolean>(false);
  isVisible$ = this.dialogVisibility.asObservable();
  private contactsData = new BehaviorSubject<Record<string, { name: string; phone: string }>>({});
  contacts$ = this.contactsData.asObservable();

  /** Where the dialog was last opened from — attached to the generate_lead it leads to. */
  source = '';

  /** @param source button location, e.g. 'navbar', 'visit', 'condition-page' — sent to GA4 */
  openDialog(contacts: Record<string, { name: string; phone: string }>, source: string) {
    this.source = source;
    this.analytics.trackEvent(EVENT_TRACK.CONTACTS_OPEN, { cta_location: source, page_path: this.analytics.currentPath() });
    this.contactsData.next(contacts);
    this.dialogVisibility.next(true);
  }

  closeDialog() {
    this.dialogVisibility.next(false);
  }
}
