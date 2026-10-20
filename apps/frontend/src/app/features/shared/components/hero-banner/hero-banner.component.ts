import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Scope } from 'animejs';
import { AnimeService } from '../../../../shared/animation/anime.service';
import { ROUTES, TEST_ROUTES } from '../../../../shared/constants/routes.constants';
import { ReviewService } from '../../../reviews/review.service';

interface HeroRating {
  avg: string;
  total: number;
  noun: string;
}

// 1 відгук · 2–4 відгуки · 5+ (and 11–14) відгуків
function reviewNoun(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'відгук';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'відгуки';
  return 'відгуків';
}

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss'
})
export class HeroBannerComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly animeService = inject(AnimeService);
  private readonly reviewService = inject(ReviewService);
  private scope?: Scope;
  private destroyed = false;

  protected readonly ROUTES = ROUTES;
  protected readonly TEST_ROUTES = TEST_ROUTES;

  // Real numbers from the reviews API; the proof item falls back to plain text until they arrive.
  protected readonly rating = signal<HeroRating | null>(null);

  ngOnInit(): void {
    this.reviewService.getPublic(1, 1).subscribe({
      next: ({ total, avgRating }) => {
        if (!total || !avgRating) return;
        this.rating.set({
          avg: avgRating.toFixed(1).replace('.', ','),
          total,
          noun: reviewNoun(total),
        });
      },
    });
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.animeService.enabled) return;
    const { createScope, createTimeline, splitText, stagger, utils } =
      await this.animeService.load();
    if (this.destroyed) return;

    const root: HTMLElement = this.host.nativeElement;
    this.scope = createScope({ root }).add(() => {
      const title = splitText('[data-hero-title]', { words: { wrap: 'clip' } });
      utils.set('[data-hero-title]', { opacity: 1 });

      // ── Text entrance (the visual column is intentionally static) ─────
      createTimeline({ defaults: { ease: 'outExpo', duration: 280 } })
        .add('.hero-tag', { opacity: [0, 1], translateY: [8, 0] }, 0)
        .add(title.words, { translateY: ['110%', '0%'], delay: stagger(40) }, 60)
        .add('.hero-lead', { opacity: [0, 1], translateY: [10, 0] }, 200)
        .add('.hero-actions', { opacity: [0, 1], translateY: [10, 0] }, 260)
        .add('.hero-proof', { opacity: [0, 1], translateY: [10, 0] }, 320);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.scope?.revert();
  }
}
