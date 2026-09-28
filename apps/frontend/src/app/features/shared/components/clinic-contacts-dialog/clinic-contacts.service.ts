import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClinicContactsService {
  private dialogVisibility = new BehaviorSubject<boolean>(false);
  isVisible$ = this.dialogVisibility.asObservable();
  private contactsData = new BehaviorSubject<Record<string, { name: string; phone: string }>>({});
  contacts$ = this.contactsData.asObservable();

  openDialog(contacts: Record<string, { name: string; phone: string }>) {
    this.contactsData.next(contacts);
    this.dialogVisibility.next(true);
  }

  closeDialog() {
    this.dialogVisibility.next(false);
  }
}
