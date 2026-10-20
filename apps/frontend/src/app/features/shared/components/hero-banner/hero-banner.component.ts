import { AfterViewInit, Component, ElementRef, inject, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Scope } from 'animejs';
import { AnimeService } from '../../../../shared/animation/anime.service';
import { TEST_ROUTES } from '../../../../shared/constants/routes.constants';
import { IS_AUTUMN } from '../../../../shared/constants/season.constants';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss'
})
export class HeroBannerComponent implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly animeService = inject(AnimeService);
  private scope?: Scope;
  private destroyed = false;

  protected readonly TEST_ROUTES = TEST_ROUTES;
  protected readonly autumn = IS_AUTUMN;

  async ngAfterViewInit(): Promise<void> {
    if (!this.animeService.enabled) return;
    const { createScope, createTimeline, animate, splitText, stagger, utils } =
      await this.animeService.load();
    if (this.destroyed) return;

    const root: HTMLElement = this.host.nativeElement;
    this.scope = createScope({ root }).add(() => {
      const title = splitText('[data-hero-title]', { words: { wrap: 'clip' } });
      utils.set('[data-hero-title]', { opacity: 1 });

      const counters = Array.from(root.querySelectorAll<HTMLElement>('[data-count]'));

      // ── Text entrance (the visual column is intentionally static) ─────
      createTimeline({ defaults: { ease: 'outExpo', duration: 1100 } })
        .add('.hero-tag', { opacity: [0, 1], translateX: [-40, 0], skewX: [-12, -12] }, 150)
        .add(title.words, { translateY: ['110%', '0%'], rotate: [6, 0], delay: stagger(55) }, 320)
        .add('.hero-lead', { opacity: [0, 1], translateY: [24, 0] }, 650)
        .add('.hero-actions', { opacity: [0, 1], translateY: [24, 0] }, 760)
        .add('[data-hero-stat]', { opacity: [0, 1], translateY: [30, 0], delay: stagger(110) }, 880)
        .call(() => counters.forEach(el => {
          const target = Number(el.dataset['count']);
          const state = { n: 0 };
          animate(state, {
            n: target,
            duration: 1600,
            ease: 'outExpo',
            onUpdate: () => (el.textContent = String(Math.round(state.n))),
          });
        }), 900);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.scope?.revert();
  }
}
