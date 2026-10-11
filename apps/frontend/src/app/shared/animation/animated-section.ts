import { AfterViewInit, Directive, ElementRef, inject, OnDestroy } from '@angular/core';
import type { Scope } from 'animejs';
import { AnimeModule, AnimeService } from './anime.service';

/**
 * Base for landing sections animated with anime.js.
 * Subclasses implement `setup`, which runs inside an anime scope rooted at the
 * host element (so selectors are local and everything is reverted on destroy).
 */
@Directive()
export abstract class AnimatedSection implements AfterViewInit, OnDestroy {
  protected readonly host = inject(ElementRef<HTMLElement>);
  private readonly animeService = inject(AnimeService);
  private scope?: Scope;
  /** Loaded anime.js module, available once the section has initialised (browser only). */
  protected anime?: AnimeModule;
  private disposers: Array<() => void> = [];
  private destroyed = false;

  protected abstract setup(anime: AnimeModule, root: HTMLElement): void | (() => void);

  async ngAfterViewInit(): Promise<void> {
    if (!this.animeService.enabled) return;
    const anime = await this.animeService.load();
    if (this.destroyed) return;
    this.anime = anime;

    const root: HTMLElement = this.host.nativeElement;
    this.scope = anime.createScope({ root }).add(() => this.setup(anime, root));
  }

  /** Runs `play` inside the scope the first time `el` scrolls into view. */
  protected whenVisible(el: Element | null, play: () => void, threshold = 0.2): void {
    if (!el) return;
    this.disposers.push(this.animeService.onceVisible(el, () => this.scope?.add(() => play()), threshold));
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.disposers.forEach(dispose => dispose());
    this.scope?.revert();
  }
}
