import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ImportsModule } from '../../../shared/primeng-imports.module';
import { TestsGridComponent } from '../components/tests-grid/tests-grid.component';
import { Component, DestroyRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ALL_TESTS_CONTENT, TEST_CATEGORY_CONTENT, TestCategoryContent } from '../constants/test-category-content.constants';
import { ConditionContent, conditionForTestCategory } from '../../conditions/conditions.data';
import { SECTION } from '../../../shared/constants/section-ids.constants';
import { SeoService } from '../../../core/seo/seo.service';
import { AnimatedSection } from '../../../shared/animation/animated-section';
import { AnimeModule } from '../../../shared/animation/anime.service';

const BASE_URL = 'https://doctor-skripnik.com.ua';

@Component({
  standalone: true,
  imports: [CommonModule, ImportsModule, RouterLink, TestsGridComponent],
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent extends AnimatedSection implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly SECTION = SECTION;
  protected readonly CATEGORY_LINKS = Object.entries(TEST_CATEGORY_CONTENT).map(([slug, c]) => ({ slug, label: c.label }));

  type = '';
  content: TestCategoryContent = ALL_TESTS_CONTENT;
  /** Treatment page for this category — the next step after taking a test. */
  condition?: ConditionContent;

  ngOnInit(): void {
    // paramMap, not snapshot: the component is reused when switching between categories
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
      this.type = params.get('type') ?? '';
      this.content = TEST_CATEGORY_CONTENT[this.type] ?? ALL_TESTS_CONTENT;
      this.condition = conditionForTestCategory(this.type);
      this.updateSeo();
    });
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

  protected setup({ animate, stagger, utils }: AnimeModule): void {
    // the h1 text is bound and changes per category, so it is revealed as one block rather than split into words
    utils.set('.tests-hero__title-inner', { translateY: '105%' });
    utils.set(['.tests-hero__breadcrumb', '.tests-hero__lead'], { opacity: 0, translateY: 20 });
    utils.set('.tests-cats__item', { opacity: 0, translateY: 12 });

    animate('.tests-hero__breadcrumb', { opacity: 1, translateY: 0, duration: 280, ease: 'outExpo' });
    animate('.tests-hero__title-inner', { translateY: '0%', duration: 280, delay: 50, ease: 'outExpo' });
    animate('.tests-hero__lead', { opacity: 1, translateY: 0, duration: 280, delay: 133, ease: 'outExpo' });
    animate('.tests-cats__item', { opacity: 1, translateY: 0, duration: 280, delay: stagger(50, { start: 233 }), ease: 'outExpo' });
  }
}
