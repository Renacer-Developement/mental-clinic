import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Feedback, FeedbackService, FeedbackStatus } from '../../../core/services/feedback.service';
import { AuthService } from '../../../core/services/auth.service';
import { FeedbackSpecialist } from '../../../core/models/user.model';

type Filter = 'all' | FeedbackStatus;

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, TagModule, ToastModule,
    ConfirmDialogModule, DialogModule, TextareaModule, SkeletonModule, SelectModule, TooltipModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './request-list.component.html',
  styleUrl:    './request-list.component.scss',
})
export class RequestListComponent implements OnInit {
  private svc     = inject(FeedbackService);
  private toast   = inject(MessageService);
  private confirm = inject(ConfirmationService);
  private auth    = inject(AuthService);

  items       = signal<Feedback[]>([]);
  loading     = signal(true);
  filter      = signal<Filter>('new');
  /** Specialists this user may see (from the API); the switch shows only when there are two */
  specialists = signal<FeedbackSpecialist[]>([]);
  specialist  = signal<'all' | FeedbackSpecialist>('all');

  noteVisible = signal(false);
  noteItem    = signal<Feedback | null>(null);
  noteText    = signal('');
  saving      = signal(false);

  readonly isAdmin = computed(() => this.auth.currentUser()?.role === 'admin');

  readonly filterTabs: { label: string; value: Filter; color: string }[] = [
    { label: 'Нові',      value: 'new',         color: '#d97706' },
    { label: 'В роботі',  value: 'in_progress', color: '#2563eb' },
    { label: 'Оброблені', value: 'done',        color: '#16a34a' },
    { label: 'Спам',      value: 'spam',        color: '#6b7280' },
    { label: 'Всі',       value: 'all',         color: '#6b7280' },
  ];

  readonly statusOptions: { label: string; value: FeedbackStatus }[] = [
    { label: 'Нова',      value: 'new' },
    { label: 'В роботі',  value: 'in_progress' },
    { label: 'Оброблена', value: 'done' },
    { label: 'Спам',      value: 'spam' },
  ];

  readonly contactLabels: Record<Feedback['contactMethod'], string> = {
    phone: 'Дзвінок', telegram: 'Telegram', viber: 'Viber',
  };

  readonly specialistLabels: Record<FeedbackSpecialist, string> = {
    doctor: 'Лікар', psychologist: 'Психолог',
  };

  /** Requests of the selected specialist; status tabs and counts work within it */
  private scoped = computed(() => {
    const s = this.specialist();
    return s === 'all' ? this.items() : this.items().filter(i => i.specialist === s);
  });

  counts = computed(() => {
    const c: Record<FeedbackStatus, number> = { new: 0, in_progress: 0, done: 0, spam: 0 };
    this.scoped().forEach(i => c[i.status]++);
    return c;
  });

  filtered = computed(() => {
    const f = this.filter();
    return f === 'all' ? this.scoped() : this.scoped().filter(i => i.status === f);
  });

  filterOptions = computed(() => this.filterTabs.map(t => ({ label: `${t.label} (${this.countFor(t.value)})`, value: t.value })));

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: res => {
        this.items.set(res.items);
        this.specialists.set(res.specialists);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  countFor(f: Filter): number {
    const c = this.counts();
    return f === 'all' ? Object.values(c).reduce((a, b) => a + b, 0) : c[f];
  }

  setStatus(item: Feedback, status: FeedbackStatus) {
    if (item.status === status) return;
    this.svc.update(item._id, { status }).subscribe({
      next: updated => {
        this.replace(updated);
        this.syncBadge();
        this.toast.add({
          severity: 'success',
          summary: status === 'done' ? 'Заявку закрито' : 'Статус оновлено',
          life: 2000,
        });
      },
    });
  }

  openNote(item: Feedback) {
    this.noteItem.set(item);
    this.noteText.set(item.note);
    this.noteVisible.set(true);
  }

  saveNote() {
    const item = this.noteItem();
    if (!item) return;
    this.saving.set(true);
    this.svc.update(item._id, { note: this.noteText() }).subscribe({
      next: updated => {
        this.replace(updated);
        this.noteVisible.set(false);
        this.saving.set(false);
        this.toast.add({ severity: 'success', summary: 'Нотатку збережено', life: 2000 });
      },
      error: () => this.saving.set(false),
    });
  }

  delete(item: Feedback) {
    this.confirm.confirm({
      message: `Видалити заявку від «${item.name}»?`,
      header: 'Підтвердження',
      icon: 'pi pi-trash',
      acceptLabel: 'Видалити',
      rejectLabel: 'Скасувати',
      accept: () => {
        this.svc.delete(item._id).subscribe({
          next: () => {
            this.items.update(list => list.filter(x => x._id !== item._id));
            this.syncBadge();
            this.toast.add({ severity: 'success', summary: 'Видалено', life: 2000 });
          },
        });
      },
    });
  }

  /** tel:/Telegram/Viber link for the number, matching how the person asked to be contacted. */
  contactHref(item: Feedback): string {
    const digits = item.phone.replace(/[^\d+]/g, '');
    const intl = digits.startsWith('+') ? digits : digits.startsWith('0') ? `+38${digits}` : `+${digits}`;
    if (item.contactMethod === 'viber') return `viber://chat?number=${encodeURIComponent(intl)}`;
    if (item.contactMethod === 'telegram') return `https://t.me/${intl}`;
    return `tel:${intl}`;
  }

  statusLabel(s: FeedbackStatus): string {
    return this.statusOptions.find(o => o.value === s)?.label ?? s;
  }

  statusSeverity(s: FeedbackStatus): 'warn' | 'info' | 'success' | 'secondary' {
    return s === 'new' ? 'warn' : s === 'in_progress' ? 'info' : s === 'done' ? 'success' : 'secondary';
  }

  /** «Передзвонили»: the client was called back, close the request */
  markCalledBack(item: Feedback) {
    this.setStatus(item, 'done');
  }

  private syncBadge() {
    this.svc.newCount.set(this.items().filter(i => i.status === 'new').length);
  }

  private replace(updated: Feedback) {
    this.items.update(list => list.map(x => x._id === updated._id ? updated : x));
  }
}
