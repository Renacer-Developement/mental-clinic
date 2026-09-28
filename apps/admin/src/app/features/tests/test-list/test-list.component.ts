import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import Fuse from 'fuse.js';
import { TestService } from '../../../core/services/test.service';
import { TestListItem } from '../../../core/models/test.model';

@Component({
  selector: 'app-test-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule,
            InputTextModule, TagModule, SkeletonModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './test-list.component.html',
  styleUrl: './test-list.component.scss',
})
export class TestListComponent implements OnInit {
  private svc     = inject(TestService);
  private router  = inject(Router);
  private confirm = inject(ConfirmationService);
  private toast   = inject(MessageService);

  private allTests = signal<TestListItem[]>([]);
  loading    = signal(true);
  search     = signal('');
  typeFilter = signal('');
  expandedId = signal<string | null>(null);
  toggleExpand(id: string) { this.expandedId.update(cur => cur === id ? null : id); }

  private fuse = computed(() =>
    new Fuse(this.allTests(), {
      keys: ['name', 'type', 'specialTest', 'duration'],
      threshold: 0.35,
      ignoreLocation: true,
    })
  );

  // Unique types actually present in the data, sorted by count desc
  availableTypes = computed(() => {
    const counts: Record<string, number> = {};
    for (const t of this.allTests()) {
      counts[t.type] = (counts[t.type] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([type]) => ({ type, label: this.typeLabel(type) }));
  });

  tests = computed(() => {
    const q      = this.search().trim();
    const filter = this.typeFilter();
    let list = q
      ? this.fuse().search(q).map(r => r.item)
      : this.allTests();
    if (filter) list = list.filter(t => t.type === filter);
    return list;
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.svc.getAll({}).subscribe({
      next: (data) => { this.allTests.set(data); this.loading.set(false); },
      error: ()    => this.loading.set(false),
    });
  }

  private typeLabels: Record<string, string> = {
    anxiety:                      'Тривожність',
    depression:                   'Депресія',
    stress:                       'Стрес',
    ocd:                          'ОКР',
    ptsd:                         'ПТСР',
    bipolar:                      'Біполярний розлад',
    personality:                  'Розлад особистості',
    'personality-disorders':      'Розлад особистості',
    eating:                       'Харчова поведінка',
    addiction:                    'Залежності',
    addictions:                   'Залежності',
    cognitive:                    'Когнітивна функція',
    selfesteem:                   'Самооцінка',
    specialized:                  'Спеціалізований',
    adhd:                         'РДУГ',
    'behavioral-disorders':       'Поведінкові розлади',
    behavioral_disorders:         'Поведінкові розлади',
    neurodevelopmental_assessment:'Нейророзвиток',
    neurodevelopmental:           'Нейророзвиток',
    repetitive_behavior:          'Повторювана поведінка',
    'repetitive-behavior':        'Повторювана поведінка',
    schizophrenia:                'Шизофренія',
    trauma:                       'Травма',
    sleep:                        'Сон',
    anger:                        'Злість',
    grief:                        'Горе',
  };

  typeLabel(value: string): string {
    return this.typeLabels[value] ?? value;
  }

  create() { this.router.navigate(['/tests/new']); }
  edit(id: string) { this.router.navigate(['/tests', id, 'edit']); }

  delete(test: TestListItem) {
    this.confirm.confirm({
      message: `Видалити тест «${test.name}»?`,
      header: 'Підтвердження',
      icon: 'pi pi-trash',
      acceptLabel: 'Видалити',
      rejectLabel: 'Скасувати',
      accept: () => {
        this.svc.delete(test._id).subscribe({
          next: () => {
            this.toast.add({ severity: 'success', summary: 'Видалено', life: 2500 });
            this.allTests.update(list => list.filter(t => t._id !== test._id));
          },
          error: (err) => this.toast.add({ severity: 'error', summary: err.error?.message }),
        });
      },
    });
  }
}
