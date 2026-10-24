import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ScrollKeeper } from '../../../shared/scroll-keeper.service';
import { TestsGridComponent } from '../components/tests-grid/tests-grid.component';
import { afterNextRender, Component, DestroyRef, inject, Injector, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ALL_TESTS_CONTENT, TEST_CATEGORY_CONTENT, TestCategoryContent } from '../constants/test-category-content.constants';
import { pluralQuestions } from '../models/test.model';
import { ConditionContent, conditionForTestCategory } from '../../conditions/conditions.data';
import { SECTION } from '../../../shared/constants/section-ids.constants';
import { SeoService } from '../../../core/seo/seo.service';
import { AnimatedSection } from '../../../shared/animation/animated-section';
import { AnimeModule } from '../../../shared/animation/anime.service';

const BASE_URL = 'https://doctor-skripnik.com.ua';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, TestsGridComponent],
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent extends AnimatedSection implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly scrollKeeper = inject(ScrollKeeper);
  private readonly injector = inject(Injector);

  protected readonly SECTION = SECTION;
  protected readonly pluralQuestions = pluralQuestions;
  protected readonly CATEGORY_LINKS = Object.entries(TEST_CATEGORY_CONTENT).map(([slug, c]) => ({ slug, label: c.label }));

  type = '';
  content: TestCategoryContent = ALL_TESTS_CONTENT;
  /** Treatment page for this category — the next step after taking a test. */
  condition?: ConditionContent;

  ngOnInit(): void {
    // paramMap, not snapshot: the component is reused when switching between categories
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.type = params.get('type') ?? '';
      this.content = TEST_CATEGORY_CONTENT[this.type] ?? ALL_TESTS_CONTENT;
      this.condition = conditionForTestCategory(this.type);
      this.updateSeo();
      // a tab click (possibly on the previous instance of this page) asked to keep the tabs in place
      const anchor = isPlatformBrowser(this.platformId) ? this.scrollKeeper.takeAnchor() : undefined;
      if (anchor) afterNextRender({ read: () => this.alignTabs(anchor.header, anchor.pastAnchor) }, { injector: this.injector });
    });
  }

  /**
   * Switching category tabs keeps the page still: the router's usual scroll-to-top is
   * skipped for this navigation. If the reader was at the tabs or below, the tabs stay
   * parked under the sticky header even when the new category's intro has another length.
   */
  keepTabsInPlace(tabs: HTMLElement): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const header = Math.max(document.querySelector('app-navbar')?.getBoundingClientRect().bottom ?? 0, 0);
    this.scrollKeeper.keepNextPosition({ header, pastAnchor: tabs.getBoundingClientRect().top <= header + 1 });
  }

  /** Runs after the new category has rendered but before the browser paints it, so nothing jumps. */
  private alignTabs(header: number, pastTabs: boolean): void {
    const tabs = this.host.nativeElement.querySelector('.tl-cats') as HTMLElement | null;
    if (!tabs) return;

    if (pastTabs) {
      const shift = tabs.getBoundingClientRect().top - header;
      if (Math.abs(shift) > 1) window.scrollBy({ top: shift, behavior: 'instant' });
    }
    // bring the newly active tab fully into the horizontal strip
    const list = tabs.querySelector<HTMLElement>('.tl-cats__list');
    const active = list?.querySelector<HTMLElement>('.is-active');
    if (list && active) {
      const left = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
      list.scrollTo({ left: Math.max(left, 0), behavior: 'smooth' });
    }
  }

  private updateSeo(): void {
    const { title, description, label, faq } = this.content;
    const canonical = this.type ? `/test/list/${this.type}` : '/test/list';
    const breadcrumbs = [
      { '@type': 'ListItem', position: 1, name: 'Головна', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Психологічні тести', item: `${BASE_URL}/test/list` },
      ...(this.type ? [{ '@type': 'ListItem', position: 3, name: label, item: `${BASE_URL}${canonical}` }] : []),
    ];

    const schema: object[] = [{
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: this.content.h1,
      url: `${BASE_URL}${canonical}`,
      description,
      inLanguage: 'uk',
      isPartOf: { '@id': `${BASE_URL}/#website` },
      breadcrumb: { '@type': 'BreadcrumbList', itemListElement: breadcrumbs },
    }];
    if (faq?.length) {
      schema.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      });
    }

    this.seo.updatePage({ title, description, canonical, schema });
  }

  protected setup({ animate, utils }: AnimeModule): void {
    // the h1 text is bound and changes per category, so it is revealed as one block rather than split into words
    utils.set('.tl-hero__title-inner', { translateY: '105%' });
    utils.set('.tl-hero__lead', { opacity: 0, translateY: 12 });
    animate('.tl-hero__title-inner', { translateY: '0%', duration: 280, ease: 'outExpo' });
    animate('.tl-hero__lead', { opacity: 1, translateY: 0, duration: 280, delay: 80, ease: 'outExpo' });
  }
}
