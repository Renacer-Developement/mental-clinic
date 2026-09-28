import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ContractService } from '../../core/services/contract.service';

@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorModule, ButtonModule, ToastModule, CheckboxModule],
  providers: [MessageService],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss',
})
export class ContractComponent implements OnInit {
  private svc   = inject(ContractService);
  private toast = inject(MessageService);

  content  = '';
  visible  = true;
  loading  = signal(false);
  saving   = signal(false);
  lastSaved: string | null = null;

  ngOnInit() {
    this.loading.set(true);
    this.svc.get().subscribe({
      next: (doc) => {
        this.content  = doc.content;
        this.visible  = doc.visible ?? true;
        this.lastSaved = doc.updatedAt;
        this.loading.set(false);
      },
      error: () => {
        this.toast.add({ severity: 'error', summary: 'Не вдалося завантажити договір' });
        this.loading.set(false);
      },
    });
  }

  save() {
    this.saving.set(true);
    this.svc.update(this.content, this.visible).subscribe({
      next: (doc) => {
        this.lastSaved = doc.updatedAt;
        this.toast.add({ severity: 'success', summary: 'Договір збережено', life: 2500 });
        this.saving.set(false);
      },
      error: (err) => {
        this.toast.add({ severity: 'error', summary: err.error?.message ?? 'Помилка збереження' });
        this.saving.set(false);
      },
    });
  }
}
