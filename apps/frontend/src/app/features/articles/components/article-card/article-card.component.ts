import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Article } from '../../models/article.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
})
export class ArticleCardComponent {
  @Input() article!: Article;

  get formattedDate(): string {
    const raw = this.article.publishedAt ?? this.article.createdAt;
    if (!raw) return '';
    return new Date(raw).toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  get formattedViews(): string {
    const v = this.article.views ?? 0;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
    return v.toString();
  }
}
