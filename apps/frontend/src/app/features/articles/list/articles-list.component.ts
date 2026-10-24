import { Component, computed, DestroyRef, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ImportsModule } from '../../../shared/primeng-imports.module';
import { ArticleCardComponent } from '../components/article-card/article-card.component';
import { ArticleService } from '../services/article.service';
import { Article, ArticleFacets, ArticleSort } from '../models/article.model';
import { SeoService } from '../../../core/seo/seo.service';
import { ARTICLE_CATEGORIES } from '../constants/article-categories.constants';
import { GoogleAnalyticsService } from '../../../analytics/google-analytics.service';
import { EVENT_TRACK } from '../../../analytics/analytics.constants';

const BASE_URL = 'https://doctor-skripnik.com.ua';
// First batch: a featured article plus three full rows of three; "show more" adds rows of three
const FIRST_BATCH_WITH_FEATURED = 10;
const BATCH = 9;
// Every article carries this catch-all category, so it is no use as a filter
const GENERIC_CATEGORY = 'інформація';

const SORT_OPTIONS: { value: ArticleSort; label: string }[] = [
  { value: 'newest',  label: 'Спершу нові' },
  { value: 'popular', label: 'Найпопулярніші' },
  { value: 'short',   label: 'Швидке читання' },
];

const CATEGORY_SEO: Record<string, { title: string; description: string; lead: string }> = {
  'депресія': {
    title:       'Статті про депресію — симптоми, лікування | Центр ментального здоров\'я',
    description: 'Статті про депресію: причини, симптоми, діагностика та лікування. Доказовий підхід психіатра Євгена Скрипника та фахівців центру.',
    lead:        'Як розпізнати депресію, чим вона відрізняється від смутку чи втоми і як її лікують — простою мовою, з опорою на дослідження.',
  },
  'тривога': {
    title:       'Статті про тривогу та тривожні розлади | Центр ментального здоров\'я',
    description: 'Матеріали про тривожні розлади, панічні атаки, ОКР і соціальну тривогу від психіатра Євгена Скрипника та фахівців центру.',
    lead:        'Тривожні розлади, панічні атаки, нав’язливі думки: як вони проявляються, коли звертатися до лікаря і що допомагає.',
  },
  'птср': {
    title:       'Статті про ПТСР — посттравматичний стресовий розлад | Центр ментального здоров\'я',
    description: 'Статті про ПТСР: симптоми, діагностика та лікування посттравматичного стресового розладу від фахівців центру Євгена Скрипника.',
    lead:        'Що таке посттравматичний стресовий розлад, як його розпізнати і як допомогти собі та близьким.',
  },
  'залежності': {
    title:       'Статті про залежності — алкоголь, наркотики, ігри | Центр ментального здоров\'я',
    description: 'Матеріали про алкогольну, наркотичну та ігрову залежність: ознаки, лікування й реабілітація. Психіатр Євген Скрипник.',
    lead:        'Ранні ознаки залежності, як говорити про неї з близькою людиною і які методи лікування мають доказову базу.',
  },
  'сон': {
    title:       'Статті про розлади сну та безсоння | Центр ментального здоров\'я',
    description: 'Статті про безсоння, порушення сну та методи їх лікування. Доказовий підхід психіатра Євгена Скрипника.',
    lead:        'Чому порушується сон, як він пов’язаний з тривогою та депресією і що реально допомагає при безсонні.',
  },
  'стрес': {
    title:       'Статті про стрес та його подолання | Центр ментального здоров\'я',
    description: 'Про хронічний стрес, вигорання та способи відновлення — матеріали психіатра Євгена Скрипника та фахівців центру.',
    lead:        'Хронічний стрес і вигорання: як помітити їх вчасно і що робити, щоб відновитися.',
  },
};

const DEFAULT_SEO = {
  title:       "Статті про ментальне здоров'я | Центр ментального здоров'я",
  description: "Статті про психічне здоров'я: депресія, тривога, РДУГ, розлади особистості. Доказовий підхід психіатра Євгена Скрипника та фахівців центру. Читайте безкоштовно.",
  lead:        'Пояснюємо симптоми, діагностику та лікування психічних розладів простою мовою — для тих, хто шукає відповіді для себе чи близьких.',
};

export interface ArticleTopic { name: string; slug: string; count: number }

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
  private readonly router         = inject(Router);
  private readonly platformId     = inject(PLATFORM_ID);
  private readonly analytics      = inject(GoogleAnalyticsService);
  private readonly destroyRef     = inject(DestroyRef);

  protected readonly SORT_OPTIONS = SORT_OPTIONS;
  protected readonly skeletonItems = Array(6);

  // ── State ──────────────────────────────────────────────────────────────────
  readonly category    = signal('');           // route slug, lowercase ("депресія")
  readonly query       = signal('');
  readonly sort        = signal<ArticleSort>('newest');
  readonly articles    = signal<Article[]>([]);
  readonly total       = signal(0);
  readonly loading     = signal(true);
  readonly loadingMore = signal(false);
  readonly facets      = signal<ArticleFacets | null>(null);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly sortControl   = new FormControl<ArticleSort>('newest', { nonNullable: true });

  /** Topics that have published articles (plus the current one), most used first. */
  readonly topics = computed<ArticleTopic[]>(() => {
    const list = (this.facets()?.categories ?? [])
      .filter(c => c.name.toLowerCase() !== GENERIC_CATEGORY)
      .map(c => ({ name: c.name, slug: c.name.toLowerCase(), count: c.count }));
    const current = this.category();
    if (current && !list.some(t => t.slug === current)) {
      list.push({ name: this.categoryName() ?? current, slug: current, count: 0 });
    }
    return list;
  });

  readonly categoryName = computed(() => {
    const slug = this.category();
    if (!slug) return null;
    return ARTICLE_CATEGORIES.find(c => c.value === slug)?.name
      ?? this.facets()?.categories.find(c => c.name.toLowerCase() === slug)?.name
      ?? slug.charAt(0).toUpperCase() + slug.slice(1);
  });

  /** "теми: депресія, тривога" for the hero facts. */
  readonly topicNames = computed(() => {
    const names = this.topics().map(t => t.name.toLowerCase());
    return `${names.length === 1 ? 'тема' : 'теми'}: ${names.slice(0, 3).join(', ')}${names.length > 3 ? '…' : ''}`;
  });

  readonly lead = computed(() => (CATEGORY_SEO[this.category()] ?? DEFAULT_SEO).lead);

  readonly hasFilters = computed(() => !!(this.category() || this.query() || this.sort() !== 'newest'));

  /** The unfiltered page opens with the newest article as a large card. */
  readonly showFeatured = computed(() => !this.category() && !this.query() && this.sort() === 'newest');
  readonly featured     = computed(() => (this.showFeatured() ? this.articles()[0] ?? null : null));
  readonly gridArticles = computed(() => (this.featured() ? this.articles().slice(1) : this.articles()));
  readonly canLoadMore  = computed(() => this.articles().length < this.total());

  private request?: Subscription;
  private lastTrackedSearch = '';

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) window.scrollTo(0, 0);

    this.articleService.getFacets().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: f => this.facets.set(f),
      error: () => this.facets.set(null),
    });

    // The URL is the single source of truth: /articles/category/:cat?q=…&sort=…
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([params, query]) => {
        const cat  = (params.get('cat') ?? '').toLowerCase();
        const q    = (query.get('q') ?? '').trim();
        const sort = SORT_OPTIONS.some(o => o.value === query.get('sort')) ? query.get('sort') as ArticleSort : 'newest';
        const catChanged = cat !== this.category();

        this.category.set(cat);
        this.query.set(q);
        this.sort.set(sort);
        if (this.searchControl.value !== q) this.searchControl.setValue(q, { emitEvent: false });
        if (this.sortControl.value !== sort) this.sortControl.setValue(sort, { emitEvent: false });

        if (catChanged || !this.seoSet) this.updateSeo();
        this.load();
      });

    this.searchControl.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(text => this.setQueryParams({ q: text.trim() || null }));

    this.sortControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(sort => this.setQueryParams({ sort: sort === 'newest' ? null : sort }));
  }

  /** Category API values are capitalised ("Депресія"); the route slug is lowercase. */
  private apiCategory(): string {
    const slug = this.category();
    if (!slug) return '';
    return this.facets()?.categories.find(c => c.name.toLowerCase() === slug)?.name
      ?? ARTICLE_CATEGORIES.find(c => c.value === slug)?.name
      ?? slug;
  }

  private load(): void {
    this.request?.unsubscribe();
    this.loading.set(true);
    const first = this.showFeatured() ? FIRST_BATCH_WITH_FEATURED : BATCH;
    this.request = this.articleService
      .getAll(this.query(), this.apiCategory(), 1, first, this.sort(), 0)
      .subscribe({
        next: res => {
          this.articles.set(res.articles);
          this.total.set(res.total);
          this.loading.set(false);
          this.trackSearch(res.total);
          // An empty category page is thin content — keep it out of the index until it has articles
          if (this.category() && !this.query() && !res.total) this.seo.setRobots('noindex, follow');
        },
        error: () => this.loading.set(false),
      });
  }

  loadMore(): void {
    if (this.loadingMore() || !this.canLoadMore()) return;
    this.loadingMore.set(true);
    this.articleService
      .getAll(this.query(), this.apiCategory(), 1, BATCH, this.sort(), this.articles().length)
      .subscribe({
        next: res => {
          this.articles.update(list => [...list, ...res.articles]);
          this.total.set(res.total);
          this.loadingMore.set(false);
        },
        error: () => this.loadingMore.set(false),
      });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  /** Back to all articles, newest first, no search. */
  resetFilters(): void {
    this.router.navigate(['/articles']);
  }

  private setQueryParams(params: Record<string, string | null>): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: params, queryParamsHandling: 'merge', replaceUrl: true });
  }

  private trackSearch(results: number): void {
    const term = this.query();
    if (term.length < 2 || term === this.lastTrackedSearch) return;
    this.analytics.trackEvent(EVENT_TRACK.SEARCH, { search_term: term.slice(0, 100), results });
    this.lastTrackedSearch = term;
  }

  private seoSet = false;

  private updateSeo(): void {
    this.seoSet = true;
    const cat       = this.category();
    const catSeo    = cat ? CATEGORY_SEO[cat] : null;
    const catName   = this.categoryName();
    const canonical = cat ? `/articles/category/${encodeURIComponent(cat)}` : '/articles';
    const title     = catSeo?.title ?? (catName ? `Статті: ${catName} | Центр ментального здоров'я` : DEFAULT_SEO.title);
    const desc      = catSeo?.description ?? DEFAULT_SEO.description;
    const breadcrumbs = [
      { '@type': 'ListItem', position: 1, name: 'Головна', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Статті',  item: `${BASE_URL}/articles` },
      ...(catName ? [{ '@type': 'ListItem', position: 3, name: catName, item: `${BASE_URL}${canonical}` }] : []),
    ];
    this.seo.updatePage({
      title,
      description: desc,
      canonical,
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        url: `${BASE_URL}${canonical}`,
        description: desc,
        inLanguage: 'uk',
        breadcrumb: { '@type': 'BreadcrumbList', itemListElement: breadcrumbs },
      },
    });
  }

  formatDate(raw?: string): string {
    return raw ? new Date(raw).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  }

  /** "1 стаття", "3 статті", "8 статей". */
  articlesWord(n: number): string {
    const d = n % 10, h = n % 100;
    if (d === 1 && h !== 11) return 'стаття';
    if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return 'статті';
    return 'статей';
  }
}
