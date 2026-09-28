import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImportsModule } from '../../../../shared/primeng-imports.module';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, ImportsModule],
  selector: 'app-latest-articles',
  templateUrl: './latest-articles.component.html',
  styleUrls: ['./latest-articles.component.scss'],
})
export class LatestArticlesComponent implements OnInit {
  private readonly articleService = inject(ArticleService);

  articles  = signal<Article[]>([]);
  loading   = signal(true);
  skeletons = Array(3);

  ngOnInit(): void {
    this.articleService.getAll('', '', 1, 3).subscribe({
      next: res => {
        this.articles.set(res.articles ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  formatDate(raw?: string): string {
    if (!raw) return '';
    return new Date(raw).toLocaleDateString('uk-UA', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }
}
