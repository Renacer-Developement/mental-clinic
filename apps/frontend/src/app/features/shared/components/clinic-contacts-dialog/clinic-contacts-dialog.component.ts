import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../../../shared/primeng-imports.module';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { ClinicContactsService } from './clinic-contacts.service';

@Component({
  standalone: true,
  imports: [CommonModule, ImportsModule],
  selector: 'app-clinic-contacts-dialog',
  templateUrl: './clinic-contacts-dialog.component.html',
  styleUrls: ['./clinic-contacts-dialog.component.scss'],
})
export class ClinicContactsDialogComponent implements OnInit {
  private readonly contactsService = inject(ClinicContactsService);
  private readonly destroyRef = inject(DestroyRef);

  visible = false;
  contacts$: Observable<Record<string, { name: string; phone: string }>> = this.contactsService.contacts$;

  ngOnInit() {
    this.contactsService.isVisible$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(isVisible => {
        this.visible = isVisible;
      });
  }

  openTelegram(phone: string) {
    window.open(`https://t.me/${phone}`, '_blank');
  }

  openViber(phone: string) {
    window.open(`viber://chat?number=${phone}`, '_blank');
  }

  close() {
    this.contactsService.closeDialog();
  }
}
