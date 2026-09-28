import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import Fuse from 'fuse.js';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../core/models/article.model';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, TagModule,
            InputTextModule, SkeletonModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
})
export class ArticleListComponent implements OnInit {
  private svc     = inject(ArticleService);
  private router  = inject(Router);
  private confirm = inject(ConfirmationService);
  private toast   = inject(MessageService);

  private allArticles = signal<Article[]>([]);
  loading    = signal(true);
  search     = signal('');
  expandedId = signal<string | null>(null);
  toggleExpand(id: string) { this.expandedId.update(cur => cur === id ? null : id); }

  private fuse = computed(() =>
    new Fuse(this.allArticles(), {
      keys: ['title', 'categories', 'tags', 'author.name'],
      threshold: 0.35,
      ignoreLocation: true,
    })
  );

  articles = computed(() => {
    const q = this.search().trim();
    if (!q) return this.allArticles();
    return this.fuse().search(q).map(r => r.item);
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.svc.getAll({}).subscribe({
      next: (data) => { this.allArticles.set(data); this.loading.set(false); },
      error: ()    => this.loading.set(false),
    });
  }

  create() { this.router.navigate(['/articles/new']); }
  edit(id: string) { this.router.navigate(['/articles', id, 'edit']); }

  delete(article: Article) {
    this.confirm.confirm({
      message: `Видалити "${article.title}"?`,
      header: 'Підтвердження',
      icon: 'pi pi-trash',
      acceptLabel: 'Видалити',
      rejectLabel: 'Скасувати',
      accept: () => {
        this.svc.delete(article._id).subscribe({
          next: () => {
            this.toast.add({ severity: 'success', summary: 'Видалено', life: 2500 });
            this.allArticles.update(list => list.filter(a => a._id !== article._id));
          },
          error: (err) => this.toast.add({ severity: 'error', summary: err.error?.message }),
        });
      },
    });
  }

  statusLabel(status: string): string {
    return status === 'published' ? 'Опубліковано' : 'Чернетка';
  }

  statusSeverity(status: string): 'success' | 'warn' {
    return status === 'published' ? 'success' : 'warn';
  }
}
