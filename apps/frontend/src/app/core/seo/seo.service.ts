import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

export interface PageSeoConfig {
  title: string;
  description: string;
  /** Search phrases for the keywords meta; pages without them drop the tag. */
  keywords?: string[];
  canonical?: string;
  schema?: object | object[];
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  /** Absolute URL or site path of the share image; defaults to the logo. */
  ogImage?: string;
  ogImageAlt?: string;
  robots?: string;
}

const BASE_URL      = 'https://doctor-skripnik.com.ua';
const OG_IMAGE      = `${BASE_URL}/assets/og-image.jpg`;
const OG_IMAGE_ALT  = 'Центр ментального здоров\'я Євгена Скрипника';
const PAGE_SCRIPT_ID = 'json-ld-page';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updatePage(config: PageSeoConfig): void {
    const ogTitle = config.ogTitle       ?? config.title;
    const ogDesc  = config.ogDescription ?? config.description;
    const ogType  = config.ogType        ?? 'website';
    const ogImage = config.ogImage ? this.fullUrl(config.ogImage) : OG_IMAGE;
    const ogAlt   = config.ogImageAlt    ?? OG_IMAGE_ALT;

    this.title.setTitle(config.title);

    this.meta.updateTag({ name: 'description', content: config.description });
    if (config.keywords?.length) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords.join(', ') });
    } else {
      this.meta.removeTag('name="keywords"');
    }
    this.meta.updateTag({ property: 'og:title',       content: ogTitle });
    this.meta.updateTag({ property: 'og:description', content: ogDesc });
    this.meta.updateTag({ property: 'og:image',       content: ogImage });
    this.meta.updateTag({ property: 'og:image:alt',   content: ogAlt });
    // the size is only known for the default logo
    if (config.ogImage) {
      this.meta.removeTag('property="og:image:width"');
      this.meta.removeTag('property="og:image:height"');
    } else {
      this.meta.updateTag({ property: 'og:image:width',  content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }
    this.meta.updateTag({ property: 'og:type',        content: ogType });
    this.meta.updateTag({ property: 'og:url',         content: config.canonical ? this.fullUrl(config.canonical) : BASE_URL });

    this.meta.updateTag({ name: 'twitter:title',       content: ogTitle });
    this.meta.updateTag({ name: 'twitter:description', content: ogDesc });
    this.meta.updateTag({ name: 'twitter:image',       content: ogImage });
    this.meta.updateTag({ name: 'twitter:image:alt',   content: ogAlt });

    this.meta.updateTag({ name: 'robots', content: config.robots ?? 'index, follow' });

    if (config.canonical) {
      this.setCanonical(config.canonical);
    } else {
      this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.remove();
    }

    if (config.schema) {
      this.setJsonLd(Array.isArray(config.schema) ? config.schema : [config.schema]);
    } else {
      this.document.getElementById(PAGE_SCRIPT_ID)?.remove();
    }
  }

  /** Replaces only the page's JSON-LD — for pages whose schema depends on data loaded after updatePage. */
  setSchema(schema: object | object[]): void {
    this.setJsonLd(Array.isArray(schema) ? schema : [schema]);
  }

  /** Overrides the robots meta set by updatePage (e.g. noindex once a listing turns out empty). */
  setRobots(content: string): void {
    this.meta.updateTag({ name: 'robots', content });
  }

  private setCanonical(path: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.href = this.fullUrl(path);
  }

  private setJsonLd(schemas: object[]): void {
    const existing = this.document.getElementById(PAGE_SCRIPT_ID);
    if (existing) existing.remove();

    const script = this.document.createElement('script');
    script.id = PAGE_SCRIPT_ID;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
    this.document.head.appendChild(script);
  }

  private fullUrl(path: string): string {
    return path.startsWith('http') ? path : `${BASE_URL}${path}`;
  }
}
