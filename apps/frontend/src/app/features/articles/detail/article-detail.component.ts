import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';
import { ImportsModule } from '../../../shared/primeng-imports.module';
import { ArticleService } from '../services/article.service';
import { ArticleCardComponent } from '../components/article-card/article-card.component';
import { Article } from '../models/article.model';
import { SeoService } from '../../../core/seo/seo.service';
import { ClinicContactsService } from '../../shared/components/clinic-contacts-dialog/clinic-contacts.service';
import { clinicContacts } from '../../shared/constants/contacts.constants';
import { NotFoundComponent } from '../../not-found/not-found.component';

const BASE_URL = 'https://doctor-skripnik.com.ua';

interface TocItem { id: string; text: string; level: 2 | 3; }

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, ImportsModule, ArticleCardComponent, NotFoundComponent],
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  private readonly route     = inject(ActivatedRoute);
  private readonly service   = inject(ArticleService);
  private readonly seo       = inject(SeoService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly el        = inject(ElementRef);
  private readonly contacts  = inject(ClinicContactsService);
  private readonly document  = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  openContacts(): void {
    this.contacts.openDialog(clinicContacts);
  }

  // ── YouTube IFrame API state (static = shared across all instances) ─────────
  private static ytApiState: 'idle' | 'loading' | 'ready' = 'idle';
  private static ytApiQueue: Array<() => void> = [];

  article          = signal<Article | null>(null);
  loading          = signal(true);
  error            = signal(false);
  scrollProgress   = signal(0);
  showBackToTop    = signal(false);
  linkCopied       = signal(false);
  relatedArticles  = signal<Article[]>([]);
  safeContent      = signal<SafeHtml>('');
  tocItems         = signal<TocItem[]>([]);

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress.set(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    this.showBackToTop.set(scrollTop > 400);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

    this.route.params
      .pipe(switchMap(p => this.service.getById(p['id'])))
      .subscribe({
        next: (data) => {
          this.article.set(data);
          const { safeHtml, toc } = this.processContent(data.content);
          this.safeContent.set(safeHtml);
          this.tocItems.set(toc);
          this.loading.set(false);
          // Bootstrap custom YouTube players after Angular renders [innerHTML].
          // Double-rAF ensures the browser has actually painted the new nodes.
          // Browser-only: rAF and the YouTube IFrame API don't exist on the server.
          if (isPlatformBrowser(this.platformId)) {
            requestAnimationFrame(() =>
              requestAnimationFrame(() => this.initYtPlayers())
            );
          }
          this.updateSeo(data);
          // Load related articles (non-blocking)
          this.service.getRelated(data._id).subscribe({
            next: related => this.relatedArticles.set(related),
            error: () => {},
          });
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }

  ngOnDestroy(): void { }

  get formattedDate(): string {
    const raw = this.article()?.publishedAt ?? this.article()?.createdAt;
    if (!raw) return '';
    return new Date(raw).toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  shareOnTelegram(): void {
    const url  = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(this.article()?.title ?? '');
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank', 'noopener');
  }

  async copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.linkCopied.set(true);
      setTimeout(() => this.linkCopied.set(false), 2200);
    } catch { /* clipboard blocked by browser */ }
  }

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80; // navbar height
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Process raw article HTML:
   *  1. Inject id="sec-N" into h2/h3 headings → builds ToC
   *  2. Convert ANY YouTube reference into a responsive .video-embed iframe:
   *       a. <iframe src="…/embed/ID…">  (Quill VideoBlot)
   *       b. <a href="…youtube…">       (auto-link or manual paste)
   *       c. bare <p>https://youtu.be/…</p> text
   */
  /**
   * Decode HTML entities (e.g. &nbsp; → ' ') by letting the browser parse
   * a temporary element.  Used to clean up ToC heading text from Quill output.
   */
  private plainText(htmlFragment: string): string {
    const div = this.document.createElement('div');
    div.innerHTML = htmlFragment;
    return (div.textContent ?? '')
      .replace(/ /g, ' ')   // non-breaking space → regular space
      .replace(/\s+/g, ' ')      // collapse multiple spaces
      .trim();
  }

  private processContent(html: string): { safeHtml: SafeHtml; toc: TocItem[] } {
    const toc: TocItem[] = [];
    let idx = 0;

    // ── Step 0: Replace &nbsp; with regular spaces so words wrap normally ────
    // Quill often inserts &nbsp; between words which creates unbreakable runs.
    let processed = html
      .replace(/&nbsp;/gi, ' ')        // named entity
      .replace(/&#160;/g, ' ')         // decimal entity
      .replace(/&#xA0;/gi, ' ')        // hex entity
      .replace(/ /g, ' ');        // literal non-breaking space char

    // ── Step 1: ToC heading IDs ──────────────────────────────────────────────
    processed = processed.replace(
      /<(h[23])(\s[^>]*)?>(.+?)<\/h[23]>/gis,
      (_, tag: string, attrs: string | undefined, inner: string) => {
        const id   = `sec-${idx++}`;
        // Use DOM to strip tags AND decode entities (&nbsp;, &amp; …)
        const text = this.plainText(inner);
        toc.push({ id, text, level: tag.toLowerCase() === 'h2' ? 2 : 3 });
        return `<${tag}${attrs ?? ''} id="${id}">${inner}</${tag}>`;
      },
    );

    // ── Step 2: YouTube → custom player placeholder ──────────────────────────
    //   JS in initYtPlayers() builds the real thumbnail + play-button UI
    const embed = (id: string) =>
      `<div class="yt-player" data-video-id="${id}"></div>`;

    // 2a – Quill VideoBlot: <iframe … src="…/embed/ID…"></iframe>
    processed = processed.replace(
      /<iframe\b[^>]*?\bsrc="[^"]*youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{11})[^"]*"[^>]*?>\s*<\/iframe>/gi,
      (_, id: string) => embed(id),
    );

    // 2b – hyperlink wrapping any YouTube URL:
    //      <a href="https://youtu.be/ID">…</a>
    //      <a href="https://youtube.com/watch?v=ID">…</a>
    //      <a href="https://youtube.com/embed/ID">…</a>
    processed = processed.replace(
      /<a\b[^>]*?\bhref="([^"]*youtu[^"]*)"[^>]*>.*?<\/a>/gis,
      (_match, href: string) => {
        const id = this.ytIdFromUrl(href);
        return id ? embed(id) : _match;
      },
    );

    // 2c – bare paragraph containing only a YouTube URL (no link tag)
    processed = processed.replace(
      /<p>\s*(https?:\/\/(?:www\.)?(?:youtu\.be|youtube\.com)\/[^\s<"]+)\s*<\/p>/gi,
      (_match, url: string) => {
        const id = this.ytIdFromUrl(url);
        return id ? embed(id) : _match;
      },
    );

    return {
      safeHtml: this.sanitizer.bypassSecurityTrustHtml(processed),
      toc,
    };
  }

  // ── SVG icon constants ───────────────────────────────────────────────────────
  private static readonly ICON_PLAY =
    `<svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30">` +
    `<polygon points="6,3 20,12 6,21"/></svg>`;

  /**
   * Find every .yt-player placeholder rendered via [innerHTML] and build the
   * branded thumbnail poster.  On click the poster is replaced with the live player.
   */
  private initYtPlayers(): void {
    const host = this.el.nativeElement as HTMLElement;
    const players = host.querySelectorAll<HTMLElement>('.yt-player:not([data-ready])');

    players.forEach(player => {
      const videoId = player.dataset['videoId'];
      if (!videoId) return;
      player.dataset['ready'] = '1';

      // Thumbnail: try hi-res, fall back to hq
      const lo = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      const hi = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      const img = new Image();
      img.onload  = () => { player.style.backgroundImage = `url('${img.src}')`; };
      img.onerror = () => { player.style.backgroundImage = `url('${lo}')`; };
      img.src = hi;

      // Poster UI
      player.innerHTML = `
        <div class="yt-player__overlay">
          <button class="yt-player__play" type="button" aria-label="Відтворити відео">
            ${ArticleDetailComponent.ICON_PLAY}
          </button>
        </div>`;

      player.addEventListener('click', () => this.activatePlayer(player, videoId), { once: true });
    });
  }

  /**
   * Load the YouTube IFrame API script exactly once per page.
   * Subsequent calls resolve immediately once the API is ready.
   */
  private loadYtApi(): Promise<void> {
    return new Promise<void>(resolve => {
      // Already loaded globally (e.g. by another component instance)
      if ((window as any).YT?.Player) {
        ArticleDetailComponent.ytApiState = 'ready';
        resolve();
        return;
      }
      if (ArticleDetailComponent.ytApiState === 'ready') { resolve(); return; }
      ArticleDetailComponent.ytApiQueue.push(resolve);
      if (ArticleDetailComponent.ytApiState === 'idle') {
        ArticleDetailComponent.ytApiState = 'loading';
        (window as any)['onYouTubeIframeAPIReady'] = () => {
          ArticleDetailComponent.ytApiState = 'ready';
          ArticleDetailComponent.ytApiQueue.forEach(fn => fn());
          ArticleDetailComponent.ytApiQueue = [];
        };
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
      }
    });
  }

  /**
   * Replace the poster with the native YouTube player (controls=1).
   * No custom overlay — everything comes from YouTube's own UI.
   */
  private activatePlayer(container: HTMLElement, videoId: string): void {
    container.style.backgroundImage = '';
    container.innerHTML = '';

    const playerDiv = document.createElement('div');
    container.appendChild(playerDiv);

    this.loadYtApi().then(() => {
      const YT = (window as any).YT;
      new YT.Player(playerDiv, {
        videoId,
        width:  '100%',
        height: '100%',
        playerVars: {
          autoplay:       1,
          controls:       1,
          rel:            0,
          modestbranding: 1,
          iv_load_policy: 3,
          playsinline:    1,
        },
        events: {
          onReady: (event: any) => {
            const iframe = event.target.getIframe() as HTMLIFrameElement;
            Object.assign(iframe.style, {
              position: 'absolute',
              inset: '0',
              width: '100%',
              height: '100%',
              border: 'none',
            });
          },
        },
      });
    });
  }

  /** Extract YouTube video ID from any common URL format */
  private ytIdFromUrl(url: string): string | null {
    const patterns = [
      /youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{11})/,
      /youtube\.com\/watch\?[^"'\s]*v=([A-Za-z0-9_-]{11})/,
      /youtu\.be\/([A-Za-z0-9_-]{11})/,
      /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return null;
  }

  private updateSeo(a: Article): void {
    const canonical = `/articles/${a.slug ?? a._id}`;
    this.seo.updatePage({
      title: `${a.title} | Центр ментального здоров'я`,
      description: a.excerpt ?? a.title,
      canonical,
      ogType: 'article',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: a.title,
        description: a.excerpt ?? '',
        image: `${BASE_URL}/assets/logo.avif`,
        author: { '@type': 'Person', name: 'Євген Скрипник' },
        datePublished: a.publishedAt ?? a.createdAt,
        publisher: {
          '@type': 'Organization',
          name: "Центр ментального здоров'я Євгена Скрипника",
          url: BASE_URL,
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}${canonical}` },
        inLanguage: 'uk',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Головна', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Статті',  item: `${BASE_URL}/articles` },
            { '@type': 'ListItem', position: 3, name: a.title,   item: `${BASE_URL}${canonical}` },
          ],
        },
      },
    });
  }
}
