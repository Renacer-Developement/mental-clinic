import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, TableModule, ButtonModule,
            InputTextModule, SelectButtonModule, ToastModule,
            TooltipModule, SkeletonModule],
  providers: [MessageService],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  private auth  = inject(AuthService);
  private toast = inject(MessageService);

  users      = signal<User[]>([]);
  loading    = signal(true);
  visible    = signal(false);
  saving     = signal(false);
  currentId  = this.auth.currentUser()?._id;

  // Filters
  searchQuery  = signal('');
  roleFilter   = signal('');
  statusFilter = signal('');

  filteredUsers = computed(() => {
    const q      = this.searchQuery().toLowerCase().trim();
    const role   = this.roleFilter();
    const status = this.statusFilter();
    return this.users().filter(u => {
      const matchSearch = !q ||
        `${u.name} ${u.lastName ?? ''}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchRole   = !role   || u.role   === role;
      const matchStatus = !status || u.status === status;
      return matchSearch && matchRole && matchStatus;
    });
  });

  // Confirm dialog
  confirmVisible = signal(false);
  confirmTarget  = signal<User | null>(null);
  confirmAction  = signal<'delete' | 'deactivate' | 'activate' | 'role-change'>('delete');
  pendingRole    = signal<'admin' | 'user' | 'doctor' | null>(null);
  actionLoading  = signal(false);

  expandedId = signal<string | null>(null);
  toggleExpand(id: string) {
    this.expandedId.update(cur => cur === id ? null : id);
  }

  inviteEmail = '';
  inviteRole: 'admin' | 'user' | 'doctor' = 'user';

  roleOptions = [
    { label: 'Користувач', value: 'user'   },
    { label: 'Лікар',      value: 'doctor' },
    { label: 'Адмін',      value: 'admin'  },
  ];

  ngOnInit() {
    this.auth.getUsers().subscribe({
      next: (users) => { this.users.set(users); this.loading.set(false); },
      error: ()      => this.loading.set(false),
    });
  }

  openDialog() {
    this.inviteEmail = '';
    this.inviteRole  = 'user';
    this.visible.set(true);
  }

  sendInvite() {
    if (!this.inviteEmail) {
      this.toast.add({ severity: 'warn', summary: 'Введіть email' }); return;
    }
    this.saving.set(true);
    this.auth.inviteUser(this.inviteEmail, this.inviteRole).subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: `Запрошення надіслано на ${this.inviteEmail}`, life: 4000 });
        this.visible.set(false);
        this.saving.set(false);
        // add pending placeholder to the list
        this.users.update(list => [{
          _id: Date.now().toString(),
          name: this.inviteEmail.split('@')[0],
          email: this.inviteEmail,
          role: this.inviteRole,
          status: 'pending',
          createdAt: new Date().toISOString(),
        } as User, ...list]);
      },
      error: (err) => {
        this.toast.add({ severity: 'error', summary: err.error?.message ?? 'Помилка надсилання' });
        this.saving.set(false);
      },
    });
  }

  onRoleSelectChange(user: User, event: Event) {
    const role = (event.target as HTMLSelectElement).value as 'admin' | 'user' | 'doctor';
    if (role === user.role) return;
    this.promptRoleChange(user, role);
  }

  promptRoleChange(user: User, role: 'admin' | 'user' | 'doctor') {
    this.confirmTarget.set(user);
    this.confirmAction.set('role-change');
    this.pendingRole.set(role);
    this.confirmVisible.set(true);
  }

  cancelConfirm() {
    this.confirmVisible.set(false);
    this.users.update(list => [...list]);
  }

  promptAction(user: User, action: 'delete' | 'deactivate' | 'activate') {
    this.confirmTarget.set(user);
    this.confirmAction.set(action);
    this.confirmVisible.set(true);
  }

  executeAction() {
    const user   = this.confirmTarget()!;
    const action = this.confirmAction();
    this.actionLoading.set(true);

    if (action === 'role-change') {
      const role = this.pendingRole()!;
      this.auth.updateUserRole(user._id, role).subscribe({
        next: (updated) => {
          this.users.update(list => list.map(u => u._id === updated._id ? updated : u));
          this.toast.add({ severity: 'success', summary: 'Роль змінено', life: 2000 });
          this.confirmVisible.set(false);
          this.actionLoading.set(false);
        },
        error: (err) => {
          this.toast.add({ severity: 'error', summary: err.error?.message ?? 'Помилка' });
          this.actionLoading.set(false);
        },
      });
    } else if (action === 'delete') {
      this.auth.deleteUser(user._id).subscribe({
        next: () => {
          this.users.update(list => list.filter(u => u._id !== user._id));
          this.toast.add({ severity: 'success', summary: 'Користувача видалено', life: 3000 });
          this.confirmVisible.set(false);
          this.actionLoading.set(false);
        },
        error: (err) => {
          this.toast.add({ severity: 'error', summary: err.error?.message ?? 'Помилка видалення' });
          this.actionLoading.set(false);
        },
      });
    } else {
      const status = action === 'deactivate' ? 'inactive' : 'active';
      this.auth.updateUserStatus(user._id, status).subscribe({
        next: (updated) => {
          this.users.update(list => list.map(u => u._id === updated._id ? updated : u));
          this.toast.add({
            severity: 'success',
            summary: action === 'deactivate' ? 'Акаунт деактивовано' : 'Акаунт активовано',
            life: 3000,
          });
          this.confirmVisible.set(false);
          this.actionLoading.set(false);
        },
        error: (err) => {
          this.toast.add({ severity: 'error', summary: err.error?.message ?? 'Помилка' });
          this.actionLoading.set(false);
        },
      });
    }
  }

  roleLabel(role: string) {
    return role === 'admin' ? 'Адмін' : role === 'doctor' ? 'Лікар' : 'Користувач';
  }
  roleClass(role: string) {
    return role === 'admin' ? 'badge badge-danger' : role === 'doctor' ? 'badge badge-success' : 'badge badge-info';
  }
  nextRole(role: string): 'admin' | 'user' | 'doctor' {
    return role === 'user' ? 'doctor' : role === 'doctor' ? 'admin' : 'user';
  }
  nextRoleLabel(role: string) {
    return role === 'user' ? 'Змінити на Лікаря' : role === 'doctor' ? 'Змінити на Адміна' : 'Змінити на Користувача';
  }
  statusLabel(s: string) {
    if (s === 'pending')  return 'Очікує';
    if (s === 'inactive') return 'Неактивний';
    return 'Активний';
  }
  statusClass(s: string) {
    if (s === 'pending')  return 'badge badge-warn';
    if (s === 'inactive') return 'badge badge-secondary';
    return 'badge badge-success';
  }
}
