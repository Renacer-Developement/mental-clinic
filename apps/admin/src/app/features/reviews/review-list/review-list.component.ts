import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { RatingModule } from 'primeng/rating';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { ReviewService, Review } from '../../../core/services/review.service';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, TagModule,
    ToastModule, ConfirmDialogModule, DialogModule,
    InputTextModule, TextareaModule, RatingModule, SkeletonModule, SelectModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './review-list.component.html',
  styleUrl:    './review-list.component.scss',
})
export class ReviewListComponent implements OnInit {
  private svc     = inject(ReviewService);
  private toast   = inject(MessageService);
  private confirm = inject(ConfirmationService);

  reviews  = signal<Review[]>([]);
  loading  = signal(true);
  filter   = signal<string>('all');

  expandedId  = signal<string | null>(null);
  toggleExpand(id: string) { this.expandedId.update(cur => cur === id ? null : id); }

  editVisible = signal(false);
  editItem    = signal<Partial<Review>>({});
  saving      = signal(false);

  counts = computed(() => ({
    all:      this.reviews().length,
    pending:  this.reviews().filter(r => r.status === 'pending').length,
    approved: this.reviews().filter(r => r.status === 'approved').length,
    rejected: this.reviews().filter(r => r.status === 'rejected').length,
  }));

  readonly filterTabs = [
    { label: 'Всі',        value: 'all',      color: '#6b7280' },
    { label: 'Очікують',  value: 'pending',  color: '#d97706' },
    { label: 'Схвалені',  value: 'approved', color: '#16a34a' },
    { label: 'Відхилені', value: 'rejected',  color: '#dc2626' },
  ];

  filterOptions = computed(() => {
    const c = this.counts();
    return this.filterTabs.map(t => ({
      label: `${t.label} (${c[t.value as keyof typeof c] ?? 0})`,
      value: t.value,
    }));
  });

  filtered = computed(() => {
    const f = this.filter();
    if (f === 'all') return this.reviews();
    return this.reviews().filter(r => r.status === f);
  });

  pending = computed(() => this.reviews().filter(r => r.status === 'pending').length);

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: data => { this.reviews.set(data); this.loading.set(false); },
      error: ()   => this.loading.set(false),
    });
  }

  approve(r: Review) {
    this.svc.update(r._id, { status: 'approved' }).subscribe({
      next: updated => {
        this.reviews.update(list => list.map(x => x._id === r._id ? updated : x));
        this.toast.add({ severity: 'success', summary: 'Схвалено', life: 2000 });
      },
    });
  }

  reject(r: Review) {
    this.svc.update(r._id, { status: 'rejected' }).subscribe({
      next: updated => {
        this.reviews.update(list => list.map(x => x._id === r._id ? updated : x));
        this.toast.add({ severity: 'warn', summary: 'Відхилено', life: 2000 });
      },
    });
  }

  openEdit(r: Review) {
    this.editItem.set({ ...r });
    this.editVisible.set(true);
  }

  saveEdit() {
    const item = this.editItem();
    if (!item._id) return;
    this.saving.set(true);
    this.svc.update(item._id, item).subscribe({
      next: updated => {
        this.reviews.update(list => list.map(x => x._id === updated._id ? updated : x));
        this.editVisible.set(false);
        this.saving.set(false);
        this.toast.add({ severity: 'success', summary: 'Збережено', life: 2000 });
      },
      error: () => this.saving.set(false),
    });
  }

  delete(r: Review) {
    this.confirm.confirm({
      message: `Видалити відгук від «${r.name}»?`,
      header: 'Підтвердження',
      icon: 'pi pi-trash',
      acceptLabel: 'Видалити',
      rejectLabel: 'Скасувати',
      accept: () => {
        this.svc.delete(r._id).subscribe({
          next: () => {
            this.reviews.update(list => list.filter(x => x._id !== r._id));
            this.toast.add({ severity: 'success', summary: 'Видалено', life: 2000 });
          },
        });
      },
    });
  }

  statusSeverity(s: string): 'success' | 'warn' | 'secondary' {
    return s === 'approved' ? 'success' : s === 'rejected' ? 'warn' : 'secondary';
  }

  statusLabel(s: string): string {
    return s === 'approved' ? 'Схвалено' : s === 'rejected' ? 'Відхилено' : 'Очікує';
  }

  stars(n: number): number[] { return Array.from({ length: n }, (_, i) => i); }

  countFor(val: string): number {
    const c = this.counts();
    return c[val as keyof typeof c] ?? 0;
  }

  setField(field: keyof Review, value: any) {
    this.editItem.update(v => ({ ...v, [field]: value }));
  }
}
