import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { TeamService } from '../../../core/services/team.service';
import { TeamMember } from '../../../core/models/team.model';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, TextareaModule,
            ButtonModule, ToastModule, ToggleButtonModule, InputNumberModule],
  providers: [MessageService],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.scss',
})
export class TeamFormComponent implements OnInit {
  private svc    = inject(TeamService);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private toast  = inject(MessageService);

  id      = signal<string | null>(null);
  loading = signal(false);
  saving  = signal(false);

  form: Partial<TeamMember> = {
    name: '', role: '', bio: '', experience: '',
    email: '', phone: '', photo: '',
    specializations: [], education: [],
    isActive: true, order: 0,
  };

  get isEdit() { return !!this.id(); }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(id);
      this.loading.set(true);
      this.svc.getById(id).subscribe({
        next: (m) => { this.form = { ...m }; this.loading.set(false); },
        error: ()  => { this.toast.add({ severity: 'error', summary: 'Помилка завантаження' }); this.loading.set(false); },
      });
    }
  }

  specializationsText(): string { return (this.form.specializations ?? []).join(', '); }
  setSpecializations(val: string) {
    this.form.specializations = val.split(',').map(s => s.trim()).filter(Boolean);
  }

  educationText(): string { return (this.form.education ?? []).join('\n'); }
  setEducation(val: string) {
    this.form.education = val.split('\n').map(s => s.trim()).filter(Boolean);
  }

  save() {
    if (!this.form.name || !this.form.role) {
      this.toast.add({ severity: 'warn', summary: 'Заповніть обов\'язкові поля: Ім\'я та Посада' });
      return;
    }
    this.saving.set(true);
    const req = this.isEdit
      ? this.svc.update(this.id()!, this.form)
      : this.svc.create(this.form);

    req.subscribe({
      next: () => {
        this.toast.add({ severity: 'success', summary: this.isEdit ? 'Збережено' : 'Додано', life: 2000 });
        setTimeout(() => this.router.navigate(['/team']), 1500);
      },
      error: (err) => {
        this.toast.add({ severity: 'error', summary: err.error?.message ?? 'Помилка збереження' });
        this.saving.set(false);
      },
    });
  }

  cancel() { this.router.navigate(['/team']); }
}
