import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImportsModule } from '../../../../shared/primeng-imports.module';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { AnimatedSection } from '../../../../shared/animation/animated-section';
import { AnimeModule } from '../../../../shared/animation/anime.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, ImportsModule],
  selector: 'app-latest-articles',
  templateUrl: './latest-articles.component.html',
  styleUrls: ['./latest-articles.component.scss'],
})
export class LatestArticlesComponent extends AnimatedSection implements OnInit {
  private readonly articleService = inject(ArticleService);

  articles  = signal<Article[]>([]);
  loading   = signal(true);
  skeletons = Array(3);
  private articlesRevealed = false;

  ngOnInit(): void {
    this.articleService.getAll('', '', 1, 3).subscribe({
      next: res => {
        this.articles.set(res.articles ?? []);
        this.loading.set(false);
        // wait for the list to render before animating it
        setTimeout(() => this.revealArticles());
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

  protected setup({ animate, stagger, utils }: AnimeModule, root: HTMLElement): void {
    utils.set(['.la-head__eyebrow', '.la-head__title', '.la-head__all'], { opacity: 0, translateY: 30 });
    this.whenVisible(root.querySelector('.la-head'), () => {
      animate(['.la-head__eyebrow', '.la-head__title', '.la-head__all'], {
        opacity: 1, translateY: 0, duration: 1000, delay: stagger(120), ease: 'outExpo',
      });
    });
    // articles may already be on the page if the request beat anime.js loading
    this.revealArticles();
  }

  /** Image curtains lift, then text and hairlines follow. Runs once, when both data and anime.js are ready. */
  private revealArticles(): void {
    const root: HTMLElement = this.host.nativeElement;
    const grid = root.querySelector('.la-grid');
    if (!this.anime || this.articlesRevealed || !root.querySelector('.art')) return;
    this.articlesRevealed = true;

    const { animate, stagger, utils } = this.anime;
    utils.set('.la-grid .art__img-wrap', { clipPath: 'inset(100% 0% 0% 0%)' });
    utils.set('.la-grid .art__img', { scale: 1.25 });
    utils.set(['.la-grid .art__meta', '.la-grid .art__title', '.la-grid .art__excerpt'], { opacity: 0, translateY: 20 });
    utils.set('.la-item__line', { scaleX: 0 });

    this.whenVisible(grid, () => {
      animate('.la-grid .art__img-wrap', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1300, delay: stagger(180), ease: 'inOutQuart' });
      animate('.la-grid .art__img', { scale: 1, duration: 1800, delay: stagger(180), ease: 'outExpo' });
      animate('.la-item__line', { scaleX: 1, duration: 1000, delay: stagger(180, { start: 300 }), ease: 'inOutQuart' });
      animate(['.la-grid .art__meta', '.la-grid .art__title', '.la-grid .art__excerpt'], {
        opacity: 1, translateY: 0, duration: 900, delay: stagger(70, { start: 500 }), ease: 'outExpo',
      });
    }, 0.15);
  }
}
