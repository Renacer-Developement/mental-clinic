import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../../../shared/primeng-imports.module';
import { CardComponent } from '../test-card/card.component';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TESTS_PRIORITY } from '../../constants/test-categories.constants';
import { CATEGORY_SECTIONS, OTHER_SECTION, sectionAnchor, sectionOf, TEST_SECTIONS } from '../../constants/test-sections.constants';
export { sectionAnchor } from '../../constants/test-sections.constants';
import { TestService } from '../../services/test.service';
import { Test } from '../../models/test.model';
import { AnimatedSection } from '../../../../shared/animation/animated-section';
import { AnimeModule } from '../../../../shared/animation/anime.service';

const priorityOf = (test: Test): number => {
  const idx = TESTS_PRIORITY.findIndex(re => re.test(test.name ?? ''));
  return idx === -1 ? TESTS_PRIORITY.length : idx;
};

// Stable sort: prioritised tests first, the rest keep the API order
const sortByPriority = (tests: Test[]): Test[] =>
  tests
    .map((test, i) => ({ test, i, p: priorityOf(test) }))
    .sort((a, b) => a.p - b.p || a.i - b.i)
    .map(({ test }) => test);


@Component({
  standalone: true,
  imports: [CommonModule, ImportsModule, CardComponent],
  selector: 'app-tests-grid',
  templateUrl: './tests-grid.component.html',
  styleUrls: ['./tests-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestsGridComponent extends AnimatedSection implements OnInit {
  private readonly testService = inject(TestService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  /** Category slug (/test/list/:type) — limits the grid to that category's sections; empty shows all tests. */
  readonly category = input('');

  skeletonItems = Array(6);
  loading = signal(true);
  private allTests = signal<Test[]>([]);

  groups = computed(() => {
    const filter = CATEGORY_SECTIONS[this.category()];
    const tests = filter
      ? this.allTests().filter(t => filter.sections.includes(sectionOf(t)) || filter.extra?.test(t.name ?? ''))
      : this.allTests();
    return [...TEST_SECTIONS.map(s => s.title), OTHER_SECTION]
      .map(title => ({ title, anchor: sectionAnchor(title), tests: tests.filter(t => sectionOf(t) === title) }))
      .filter(g => g.tests.length);
  });

  ngOnInit() {
    // Section links from the navbar (/test/list/:type#tests-…) — sections render
    // only after the tests load, so the router's own anchor scrolling can't reach them.
    this.route.fragment
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(fragment => { if (!this.loading()) setTimeout(() => this.scrollToFragment(fragment)); });

    this.testService.getTests()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: tests => {
          this.allTests.set(sortByPriority(tests));
          this.loading.set(false);
          setTimeout(() => {   // after the sections render
            this.revealSections();
            this.scrollToFragment(this.route.snapshot.fragment);
          });
        },
        error: () => this.loading.set(false),
      });
  }

  protected setup(): void {
    this.revealSections(); // tests may have loaded before anime.js
  }

  private revealed = false;

  /** Each section's cards rise in, in order, as the section scrolls into view (first load only). */
  private revealSections(): void {
    const root: HTMLElement = this.host.nativeElement;
    if (!this.anime || this.revealed || !root.querySelector('.tgrid__section')) return;
    this.revealed = true;

    const { animate, stagger, utils }: AnimeModule = this.anime;
    root.querySelectorAll<HTMLElement>('.tgrid__section').forEach(section => {
      const title = section.querySelector('.tgrid__section-title');
      const cards = section.querySelectorAll('app-card');
      utils.set(title!, { opacity: 0, translateY: 24 });
      utils.set(cards, { opacity: 0, translateY: 30 });

      this.whenVisible(section, () => {
        animate(title!, { opacity: 1, translateY: 0, duration: 900, ease: 'outExpo' });
        animate(cards, { opacity: 1, translateY: 0, duration: 900, delay: stagger(70, { start: 150 }), ease: 'outExpo' });
      }, 0.05);
    });
  }

  private scrollToFragment(fragment: string | null): void {
    if (!fragment || typeof document === 'undefined') return;
    const el = document.getElementById(fragment);
    if (!el) return;
    // reveal at once so the section isn't invisible when we land on it
    el.querySelectorAll<HTMLElement>('.tgrid__section-title, app-card').forEach(n => (n.style.opacity = '1', n.style.transform = 'none'));
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
