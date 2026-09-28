import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { TeamService } from '../../../core/services/team.service';
import { TeamMember } from '../../../core/models/team.model';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TableModule, SkeletonModule, ToastModule, TooltipModule],
  providers: [MessageService],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.scss',
})
export class TeamListComponent implements OnInit {
  private svc   = inject(TeamService);
  private router = inject(Router);
  private toast  = inject(MessageService);

  members    = signal<TeamMember[]>([]);
  loading    = signal(true);
  expandedId = signal<string | null>(null);
  toggleExpand(id: string) { this.expandedId.update(cur => cur === id ? null : id); }

  // Delete confirm
  deleteTarget  = signal<TeamMember | null>(null);
  deleteVisible = signal(false);
  deleteLoading = signal(false);

  ngOnInit() { this.load(); }

  private load() {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: (m) => { this.members.set(m); this.loading.set(false); },
      error: ()  => { this.toast.add({ severity: 'error', summary: 'Помилка завантаження' }); this.loading.set(false); },
    });
  }

  edit(id: string) { this.router.navigate(['/team', id, 'edit']); }
  create()         { this.router.navigate(['/team/new']); }

  promptDelete(member: TeamMember) {
    this.deleteTarget.set(member);
    this.deleteVisible.set(true);
  }

  confirmDelete() {
    const m = this.deleteTarget()!;
    this.deleteLoading.set(true);
    this.svc.remove(m._id).subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: 'Видалено', life: 2000 });
        this.members.update(list => list.filter(x => x._id !== m._id));
        this.deleteVisible.set(false);
        this.deleteLoading.set(false);
      },
      error: () => {
        this.toast.add({ severity: 'error', summary: 'Помилка видалення' });
        this.deleteLoading.set(false);
      },
    });
  }

  toggleVisibility(member: TeamMember) {
    const next = !member.isActive;
    this.svc.patch(member._id, { isActive: next } as any).subscribe({
      next: (updated) => {
        this.members.update(list => list.map(m => m._id === updated._id ? updated : m));
        this.toast.add({
          severity: 'success',
          summary: next ? 'Відображається на сайті' : 'Приховано з сайту',
          life: 2000,
        });
      },
      error: () => this.toast.add({ severity: 'error', summary: 'Помилка' }),
    });
  }

  saveOrder(member: TeamMember, event: Event) {
    const val = parseInt((event.target as HTMLInputElement).value);
    const order = isNaN(val) ? 0 : val;
    if (order === member.order) return;
    this.svc.patch(member._id, { order } as any).subscribe({
      next: (updated) => {
        this.members.update(list =>
          list.map(m => m._id === updated._id ? updated : m)
              .sort((a, b) => a.order - b.order)
        );
      },
      error: () => this.toast.add({ severity: 'error', summary: 'Помилка збереження порядку' }),
    });
  }
}
