import { Component, DestroyRef, ElementRef, inject, OnInit, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, catchError, tap } from 'rxjs';
import { SeoService } from '../../core/seo/seo.service';
import { GoogleAnalyticsService } from '../../analytics/google-analytics.service';
import { EVENT_TRACK } from '../../analytics/analytics.constants';
import { SiteSearchService, SearchResult } from './search.service';

const KIND_LABEL: Record<SearchResult['kind'], string> = {
  article: 'Стаття',
  test: 'Тест',
  page: 'Сторінка',
};

// Site search: one box, live results as you type, ?q= in the URL so a search can
// be shared or reopened. Results come from the backend's hybrid (vector + keyword)
// index of articles, tests and the static pages.
@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly analytics = inject(GoogleAnalyticsService);
  private readonly api = inject(SiteSearchService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly input = viewChild<ElementRef<HTMLInputElement>>('box');
  private readonly queries = new Subject<string>();
  /** Last ?q= this page wrote itself, so the echo from the router is ignored */
  private written = '';

  protected readonly KIND_LABEL = KIND_LABEL;
  protected readonly suggestions = ['Депресія', 'Тривога', 'Панічні атаки', 'РДУГ у дорослих', 'Безсоння', 'Психіатр онлайн'];

  readonly query = signal('');
  readonly results = signal<SearchResult[]>([]);
  readonly loading = signal(false);
  readonly error = signal(false);
  /** The query the shown results belong to — "nothing found" waits for it */
  readonly searched = signal('');

  ngOnInit(): void {
    this.seo.updatePage({
      title: 'Пошук по сайту — Центр ментального здоров’я',
      description: 'Пошук статей, психологічних тестів і сторінок про лікування на сайті центру ментального здоров’я Євгена Скрипника.',
      canonical: '/search',
      // Result pages are thin and endless; keep them out of Google
      robots: 'noindex, follow',
    });

    if (!this.isBrowser) return;

    this.queries.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      tap(q => {
        this.written = q;
        this.router.navigate([], { queryParams: { q: q || null }, replaceUrl: true });
        this.error.set(false);
        this.loading.set(q.length >= 2);
      }),
      switchMap(q => q.length < 2
        ? of({ q, results: [] as SearchResult[] })
        : this.api.search(q).pipe(
            tap(() => this.analytics.trackEvent(EVENT_TRACK.SEARCH, { search_term: q })),
            switchMap(r => of({ q, results: r.results })),
            catchError(() => { this.error.set(true); return of({ q, results: [] as SearchResult[] }); }),
          )),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(({ q, results }) => {
      this.results.set(results);
      this.searched.set(q);
      this.loading.set(false);
    });

    // ?q= on arrival, and again when the menu's search box sends a new query to this
    // already open page; the page's own replaceUrl updates are skipped
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const q = (params.get('q') ?? '').trim();
      if (q === this.written || q === this.query().trim()) return;
      this.query.set(q);
      this.queries.next(q.trim());
    });
    setTimeout(() => this.input()?.nativeElement.focus());
  }

  onInput(value: string): void {
    this.query.set(value);
    this.queries.next(value.trim());
  }

  pick(term: string): void {
    this.onInput(term);
    this.input()?.nativeElement.focus();
  }

  clear(): void {
    this.onInput('');
    this.input()?.nativeElement.focus();
  }
}
