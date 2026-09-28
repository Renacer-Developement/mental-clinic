import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ImportsModule } from '../../../shared/primeng-imports.module';
import { ArticleCardComponent } from '../components/article-card/article-card.component';
import { ArticleService } from '../services/article.service';
import { PaginatedArticlesResponse } from '../models/article.model';
import { SeoService } from '../../../core/seo/seo.service';

const BASE_URL  = 'https://doctor-skripnik.com.ua';
const PAGE_SIZE = 10;

const CATEGORY_SEO: Record<string, { title: string; description: string }> = {
  'депресія':   {
    title:       'Статті про депресію — симптоми, лікування | Центр ментального здоров\'я',
    description: 'Читайте статті психіатра Євгена Скрипника про депресію: причини, симптоми, методи лікування та поради з профілактики. Доказова медицина.',
  },
  'тривога':    {
    title:       'Статті про тривогу та тривожні розлади | Центр ментального здоров\'я',
    description: 'Корисні матеріали про тривожні розлади, панічні атаки та ГТР від психіатра Євгена Скрипника. Як впоратись із тривогою — читайте безкоштовно.',
  },
  'птср':       {
    title:       'Статті про ПТСР — посттравматичний стресовий розлад | Центр ментального здоров\'я',
    description: 'Статті про ПТСР: що таке посттравматичний стрес, симптоми, діагностика та лікування. Від психіатра Євгена Скрипника.',
  },
  'залежності': {
    title:       'Статті про залежності — алкоголь, наркотики, ігри | Центр ментального здоров\'я',
    description: 'Матеріали про залежності (алкогольну, наркотичну, ігрову) від психіатра Євгена Скрипника. Лікування та реабілітація.',
  },
  'сон':        {
    title:       'Статті про розлади сну та безсоння | Центр ментального здоров\'я',
    description: 'Статті психіатра Євгена Скрипника про безсоння, порушення сну та методи їх лікування. Доказовий підхід.',
  },
  'стрес':      {
    title:       'Статті про стрес та його подолання | Центр ментального здоров\'я',
    description: 'Читайте про хронічний стрес, вигорання та способи відновлення від психіатра Євгена Скрипника.',
  },
};

const ARTICLE_CATEGORIES = [
  { name: 'Всі',        value: '' },
  { name: 'Депресія',   value: 'депресія' },
  { name: 'Тривога',    value: 'тривога' },
  { name: 'ПТСР',       value: 'птср' },
  { name: 'Залежності', value: 'залежності' },
  { name: 'Сон',        value: 'сон' },
  { name: 'Стрес',      value: 'стрес' },
];

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, ImportsModule, ArticleCardComponent],
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss'],
})
export class ArticlesListComponent implements OnInit {
  private readonly articleService = inject(ArticleService);
  private readonly seo            = inject(SeoService);
  private readonly route          = inject(ActivatedRoute);
  private readonly platformId     = inject(PLATFORM_ID);

  categories    = ARTICLE_CATEGORIES;
  skeletonItems = Array(6);

  // ── State signals ──────────────────────────────────────────────────────────
  loading        = signal(true);
  articlesResult = signal<PaginatedArticlesResponse | null>(null);

  searchForm = new FormGroup({
    text:     new FormControl(''),
    category: new FormControl<{ name: string; value: string }>({ name: 'Всі', value: '' }),
  });

  private readonly query$ = new BehaviorSubject<{ text: string; category: string; page: number }>({
    text: '', category: '', page: 1,
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

    // Pre-filter from category route param (/articles/category/:cat)
    const routeCat = this.route.snapshot.paramMap.get('cat') ?? '';
    if (routeCat) {
      const found = ARTICLE_CATEGORIES.find(c => c.value === routeCat);
      if (found) this.searchForm.patchValue({ category: found }, { emitEvent: false });
    }

    // React to form changes → reset to page 1
    this.searchForm.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(),
    ).subscribe(({ text, category }) => {
      const cat = typeof category === 'string' ? category : (category as any)?.value ?? '';
      this.query$.next({ text: text?.trim() ?? '', category: cat, page: 1 });
    });

    // Drive HTTP calls from the query subject
    this.query$.pipe(
      tap(() => this.loading.set(true)),
      switchMap(({ text, category, page }) =>
        this.articleService.getAll(text, category, page, PAGE_SIZE),
      ),
    ).subscribe({
      next: result => {
        this.articlesResult.set(result);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    // Set initial query (after subscription is set up)
    this.query$.next({ text: '', category: routeCat, page: 1 });

    const catSeo     = routeCat ? CATEGORY_SEO[routeCat] : null;
    const catName    = routeCat ? ARTICLE_CATEGORIES.find(c => c.value === routeCat)?.name ?? routeCat : null;
    const canonical  = routeCat ? `/articles/category/${encodeURIComponent(routeCat)}` : '/articles';
    const pageTitle  = catSeo?.title  ?? "Статті про ментальне здоров'я | Центр ментального здоров'я";
    const pageDesc   = catSeo?.description ?? "Корисні статті про психічне здоров'я, депресію, тривогу, ПТСР та інші розлади від психіатра Євгена Скрипника. Доказова медицина. Читайте безкоштовно.";
    const breadcrumbs = [
      { '@type': 'ListItem', position: 1, name: 'Головна', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Статті',  item: `${BASE_URL}/articles` },
      ...(catName ? [{ '@type': 'ListItem', position: 3, name: catName, item: `${BASE_URL}${canonical}` }] : []),
    ];

    this.seo.updatePage({
      title:       pageTitle,
      description: pageDesc,
      canonical,
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name:        pageTitle,
        url:         `${BASE_URL}${canonical}`,
        description: pageDesc,
        inLanguage:  'uk',
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: breadcrumbs },
      },
    });
  }

  isActiveCategory(cat: { name: string; value: string }): boolean {
    const current    = this.searchForm.get('category')?.value;
    const currentVal = typeof current === 'string' ? current : (current as any)?.value;
    return currentVal === cat.value;
  }

  selectCategory(cat: { name: string; value: string }): void {
    this.searchForm.patchValue({ category: cat });
  }

  resetSearch(): void {
    this.searchForm.patchValue({ text: '', category: { name: 'Всі', value: '' } });
  }

  goToPage(page: number): void {
    const current = this.query$.value;
    this.query$.next({ ...current, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  pagesArray(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i + 1);
  }
}
