import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type AnimeModule = typeof import('animejs');

/**
 * Lazy-loads anime.js in the browser only, so SSR never touches it and the
 * library lands in its own chunk instead of the main bundle.
 */
@Injectable({ providedIn: 'root' })
export class AnimeService {
  private readonly platformId = inject(PLATFORM_ID);
  private module?: Promise<AnimeModule>;

  /** False on the server and for visitors who asked the OS for reduced motion. */
  get enabled(): boolean {
    return isPlatformBrowser(this.platformId)
      && typeof IntersectionObserver !== 'undefined'
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  load(): Promise<AnimeModule> {
    return (this.module ??= import('animejs'));
  }

  /**
   * Calls `play` once when `el` scrolls into view; returns a disposer.
   * `play` runs immediately if the element is already on screen.
   */
  onceVisible(el: Element, play: () => void, threshold = 0.2): () => void {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      play();
    }, { threshold, rootMargin: '0px 0px -60px 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }
}
