import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { ReviewService, Review, ReviewsPage, SubmitReview } from './review.service';
import { ClinicContactsService } from '../shared/components/clinic-contacts-dialog/clinic-contacts.service';
import { clinicContacts } from '../shared/constants/contacts.constants';

const BASE_URL = 'https://doctor-skripnik.com.ua';

/** The API caps a page at 50; the first page is rendered on the server, the rest load in the browser. */
const API_PAGE = 50;
/** Reviews shown per "show more" step. */
const STEP = 10;
/** Longer texts collapse to a few lines with a "read in full" toggle. */
const LONG_TEXT = 420;

interface Facet {
  key: string;
  label: string;
  pattern: RegExp;
}

// What patients most often single out. Counted live from the review texts, so the numbers are real.
// JS \b only knows Latin letters, so Cyrillic words need explicit edges.
const L = 'А-ЯІЇЄҐа-яіїєґʼ\'’';
const word = (w: string, flags = 'i') => new RegExp(`(^|[^${L}])(${w})(?=[^${L}]|$)`, flags);

const THEMES: Facet[] = [
  { key: 'contact',   label: 'Лікар на зв\'язку між прийомами', pattern: /на з[вʼ'’]*[ʼ'’]?язку|відповіда|відповів/i },
  { key: 'heard',     label: 'Уважно вислухали, не знецінили',  pattern: /вислуха|почули|почута|почув|чує|не знеціню|без знецін|не насварил/i },
  { key: 'diagnosis', label: 'Правильний діагноз після інших лікарів', pattern: /правильн.{0,20}(діагноз|лікуван|схем)|(поставив|встановив|поставила).{0,10}діагноз|перший, хто/i },
  { key: 'explain',   label: 'Зрозуміло пояснюють',             pattern: /поясн|розʼясн|роз'ясн|зрозуміл/i },
];

// What the review is about.
const TOPICS: Facet[] = [
  { key: 'anxiety',   label: 'Тривога і панічні атаки', pattern: /тривог|панічн|ГТР/i },
  { key: 'depression',label: 'Депресія',                pattern: /депрес/i },
  { key: 'meds',      label: 'Антидепресанти',          pattern: new RegExp(`антидеп|${word('АД', '').source}`, 'i') },
  { key: 'kids',      label: 'Діти та підлітки',        pattern: new RegExp(`дитин|доньк|доч(ка|ки|ці|кою)|підліт|дитяч|${word('син(а|ові|ом)?').source}`, 'i') },
  { key: 'adhd',      label: 'РДУГ',                    pattern: /РДУГ/ },
  { key: 'bipolar',   label: 'Біполярний розлад',       pattern: new RegExp(`біполяр|${word('БАР', '').source}`, 'i') },
  { key: 'addiction', label: 'Залежності',              pattern: /алкогол|кинути пити|залежн/i },
];

// Doctors named in a review get a small "about" tag on the card.
const DOCTORS: { name: string; pattern: RegExp }[] = [
  { name: 'Євген Скрипник',     pattern: /скрипник|євген[уа]? васильович|скріпнік/i },
  { name: 'Дмитро Мацібора',    pattern: /мац[іи]бор|міцібор|дмитр[оау]? олександрович/i },
  { name: 'Ольга Єрьоменко',    pattern: /єрьоменко/i },
  { name: 'Ірина Пасько',       pattern: /пасько/i },
  { name: 'Наталія Мікова',     pattern: /мікова|міковій|налією міковою/i },
  { name: 'Людмила Заволока',   pattern: /заволок/i },
  { name: 'Ганна Ліходєєва',    pattern: /ліходєєв/i },
  { name: 'Іван Попик',         pattern: /попик/i },
  { name: 'К. В. Решетнікова',  pattern: /решетніков/i },
  { name: 'Аліна Вовк',         pattern: /аліна вовк/i },
];

export type SortKey = 'new' | 'detailed' | 'critical';

export interface ReviewView extends Review {
  key: string;
  body: string;
  displayName: string;
  source: string | null;
  date: string | null;
  doctors: string[];
  topics: string[];
  themes: string[];
  long: boolean;
}

export interface TextPart {
  text: string;
  hit: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  private readonly seo        = inject(SeoService);
  private readonly service    = inject(ReviewService);
  private readonly contacts   = inject(ClinicContactsService);
  private readonly isBrowser  = isPlatformBrowser(inject(PLATFORM_ID));

  // ── Data ────────────────────────────────────────────────────────────────────
  private readonly raw = signal<Review[]>([]);
  loading     = signal(true);
  loadError   = signal(false);
  /** All pages fetched, so filters and counts cover every review. */
  complete    = signal(false);
  totalCount  = signal(0);
  avgRating   = signal(0);

  // ── Controls ────────────────────────────────────────────────────────────────
  query        = signal('');
  sort         = signal<SortKey>('new');
  ratingFilter = signal<number | null>(null);
  facetFilter  = signal<string | null>(null);
  visible      = signal(STEP);
  expanded     = signal<ReadonlySet<string>>(new Set());

  protected readonly Math = Math;
  readonly themes = THEMES;
  readonly topics = TOPICS;
  readonly sortOptions: { key: SortKey; label: string }[] = [
    { key: 'new',      label: 'Найновіші' },
    { key: 'detailed', label: 'Найдетальніші' },
    { key: 'critical', label: 'Спочатку критичні' },
  ];

  readonly items = computed<ReviewView[]>(() =>
    this.raw().map((r, i) => {
      const fromInstagram = /інстаграм/i.test(r.name);
      const anonymous = fromInstagram || /^відгук$/i.test(r.name.trim());
      return {
        ...r,
        key: r._id ?? `r${i}`,
        body: tidy(r.text),
        displayName: anonymous ? 'Анонімний відгук' : r.name,
        source: fromInstagram ? 'з Instagram' : null,
        date: formatDate(r.createdAt),
        doctors: DOCTORS.filter(d => d.pattern.test(r.text)).map(d => d.name),
        topics: TOPICS.filter(t => t.pattern.test(r.text)).map(t => t.key),
        themes: THEMES.filter(t => t.pattern.test(r.text)).map(t => t.key),
        long: tidy(r.text).length > LONG_TEXT,
      };
    }),
  );

  /** 5★…1★ histogram over the loaded reviews. */
  readonly distribution = computed(() => {
    const all = this.items();
    return [5, 4, 3, 2, 1].map(stars => {
      const count = all.filter(r => Math.round(r.rating) === stars).length;
      return { stars, count, share: all.length ? count / all.length : 0 };
    });
  });

  readonly facetCounts = computed(() => {
    const counts: Record<string, number> = {};
    for (const f of [...THEMES, ...TOPICS]) counts[f.key] = 0;
    for (const r of this.items()) for (const k of [...r.themes, ...r.topics]) counts[k]++;
    return counts;
  });

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const rating = this.ratingFilter();
    const facet = this.facetFilter();

    const list = this.items().filter(r =>
      (!rating || Math.round(r.rating) === rating) &&
      (!facet || r.themes.includes(facet) || r.topics.includes(facet)) &&
      (!q || r.body.toLowerCase().includes(q) || r.displayName.toLowerCase().includes(q) || r.doctors.some(d => d.toLowerCase().includes(q))),
    );

    const time = (r: ReviewView) => (r.createdAt ? Date.parse(r.createdAt) : 0);
    switch (this.sort()) {
      case 'detailed': return [...list].sort((a, b) => b.body.length - a.body.length);
      case 'critical': return [...list].sort((a, b) => a.rating - b.rating || time(b) - time(a));
      default:         return [...list].sort((a, b) => time(b) - time(a));
    }
  });

  readonly shown = computed(() => this.filtered().slice(0, this.visible()));
  readonly hasActiveFilters = computed(() => !!(this.query().trim() || this.ratingFilter() || this.facetFilter()));
  readonly activeFacetLabel = computed(() => [...THEMES, ...TOPICS].find(f => f.key === this.facetFilter())?.label ?? null);
  readonly avgLabel = computed(() => this.avgRating().toFixed(1).replace('.', ','));

  // ── Form ────────────────────────────────────────────────────────────────────
  submitLoading = signal(false);
  submitDone    = signal(false);
  submitError   = signal('');

  formName   = '';
  formText   = '';
  formRating = 5;
  nameTouched = false;
  textTouched = false;

  readonly stars = [1, 2, 3, 4, 5];
  readonly ratingWords = ['', 'Погано', 'Задовільно', 'Нормально', 'Добре', 'Відмінно'];

  ngOnInit(): void {
    this.updateSeo();
    this.loadAll();
  }

  // ── Loading ─────────────────────────────────────────────────────────────────

  private loadAll(): void {
    this.service.getPublic(1, API_PAGE).subscribe({
      next: first => {
        this.raw.set(first.data);
        this.totalCount.set(first.total);
        this.avgRating.set(first.avgRating);
        this.loading.set(false);
        this.updateSeo(first);

        const pages = Math.ceil(first.total / API_PAGE);
        if (!this.isBrowser || pages <= 1) {
          this.complete.set(pages <= 1);
          return;
        }
        this.loadRest(2, pages);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }

  private loadRest(page: number, pages: number): void {
    this.service.getPublic(page, API_PAGE).subscribe({
      next: res => {
        const seen = new Set(this.raw().map(r => r._id));
        this.raw.update(prev => [...prev, ...res.data.filter(r => !seen.has(r._id))]);
        if (page < pages && res.hasMore) this.loadRest(page + 1, pages);
        else this.complete.set(true);
      },
      // Keep what we have; the counts then describe the loaded part only.
      error: () => this.complete.set(true),
    });
  }

  retry(): void {
    this.loadError.set(false);
    this.loading.set(true);
    this.loadAll();
  }

  // ── Controls ────────────────────────────────────────────────────────────────

  setQuery(value: string): void {
    this.query.set(value);
    this.visible.set(STEP);
  }

  setSort(value: SortKey): void {
    this.sort.set(value);
    this.visible.set(STEP);
  }

  toggleRating(stars: number): void {
    this.ratingFilter.update(cur => (cur === stars ? null : stars));
    this.visible.set(STEP);
  }

  toggleFacet(key: string): void {
    this.facetFilter.update(cur => (cur === key ? null : key));
    this.visible.set(STEP);
  }

  resetFilters(): void {
    this.query.set('');
    this.ratingFilter.set(null);
    this.facetFilter.set(null);
    this.visible.set(STEP);
  }

  showMore(): void {
    this.visible.update(v => v + STEP);
  }

  toggleExpanded(key: string): void {
    this.expanded.update(set => {
      const next = new Set(set);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  /** Splits text around search matches so the template can wrap them in <mark> without innerHTML. */
  parts(text: string): TextPart[] {
    const q = this.query().trim();
    if (q.length < 2) return [{ text, hit: false }];
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.split(re).filter(Boolean).map(t => ({ text: t, hit: t.toLowerCase() === q.toLowerCase() }));
  }

  starsFor(rating: number): boolean[] {
    const full = Math.round(rating);
    return [1, 2, 3, 4, 5].map(i => i <= full);
  }

  reviewsNoun(n: number): string {
    const mod10 = n % 10, mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'відгук';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'відгуки';
    return 'відгуків';
  }

  scrollToForm(): void {
    document.getElementById('leave-review')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  openContacts(): void {
    this.contacts.openDialog(clinicContacts, 'reviews');
  }

  // ── Form ────────────────────────────────────────────────────────────────────

  isFormValid(): boolean {
    return this.formName.trim().length >= 2 && this.formText.trim().length >= 10 && this.formRating >= 1;
  }

  onSubmit(): void {
    this.nameTouched = true;
    this.textTouched = true;
    if (!this.isFormValid()) return;

    const payload: SubmitReview = {
      name:   this.formName.trim(),
      text:   this.formText.trim(),
      rating: this.formRating,
    };

    this.submitLoading.set(true);
    this.submitError.set('');

    this.service.submit(payload).subscribe({
      next: () => {
        this.submitLoading.set(false);
        this.submitDone.set(true);
        this.formName = '';
        this.formText = '';
        this.formRating = 5;
        this.nameTouched = false;
        this.textTouched = false;
      },
      error: () => {
        this.submitLoading.set(false);
        this.submitError.set('Не вдалося надіслати відгук. Перевірте з\'єднання і спробуйте ще раз.');
      },
    });
  }

  // ── SEO ─────────────────────────────────────────────────────────────────────

  /**
   * Page meta + JSON-LD. Called once up front and again when the first page of
   * reviews arrives, so the markup carries the real rating and review texts.
   */
  private updateSeo(result?: ReviewsPage): void {
    const url = `${BASE_URL}/reviews`;
    const schema: object[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        url,
        name: "Відгуки про Євгена Скрипника та лікарів-психіатрів Центру ментального здоров'я",
        about: [
          { '@id': `${BASE_URL}/#physician` },
          { '@id': `${BASE_URL}/#organization` },
        ],
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Головна', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Відгуки', item: url },
          ],
        },
      },
    ];

    if (result?.total) {
      schema.push({
        '@context': 'https://schema.org',
        '@type': 'MedicalOrganization',
        '@id': `${BASE_URL}/#organization`,
        name: "Онлайн центр ментального здоров'я Євгена Скрипника",
        url: `${BASE_URL}/`,
        medicalSpecialty: 'https://schema.org/Psychiatric',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: result.avgRating,
          reviewCount: result.total,
          bestRating: 5,
          worstRating: 1,
        },
        // A sample is enough for rich results; the full list would bloat the page head.
        review: result.data.slice(0, 10).map(r => ({
          '@type': 'Review',
          author: { '@type': 'Person', name: r.name },
          ...(r.createdAt && { datePublished: r.createdAt.slice(0, 10) }),
          reviewBody: r.text,
          reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
        })),
      });
    }

    this.seo.updatePage({
      title: "Відгуки про психіатра Євгена Скрипника та лікарів центру ментального здоров'я",
      description: "Відгуки пацієнтів про Євгена Скрипника та лікарів-психіатрів Центру ментального здоров'я Євгена Скрипника: онлайн консультації, лікування депресії, тривоги, ПТСР.",
      canonical: '/reviews',
      ogType: 'website',
      schema,
    });
  }
}

/** Keeps the author's paragraphs but joins the stray single line breaks phones insert mid-sentence. */
function tidy(text: string): string {
  return text
    .replace(/\r/g, '')
    .replace(/([^\n])\n(?!\n)/g, '$1 ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/\s?р\.$/, '');
}
