import { AfterViewInit, Directive, ElementRef, inject, Input, OnDestroy, PLATFORM_ID, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type RevealVariant = 'up' | 'left' | 'right' | 'zoom' | 'fade';

/**
 * Fades an element in when it scrolls into view.
 * Runs only in the browser, so SSR output (and crawlers) always get visible content.
 *
 * <div appReveal="left" [revealDelay]="i * 80">…</div>
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  @Input('appReveal') variant: RevealVariant | '' = 'up';
  @Input() revealDelay = 0;

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') return;

    const host = this.el.nativeElement;
    this.renderer.addClass(host, 'reveal');
    this.renderer.addClass(host, `reveal--${this.variant || 'up'}`);
    if (this.revealDelay) {
      this.renderer.setStyle(host, '--reveal-delay', `${this.revealDelay}ms`, RendererStyleFlags2.DashCase);
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        this.renderer.addClass(host, 'is-visible');
        this.observer?.disconnect();
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
