import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, CardComponent],
  selector: 'app-tests-grid',
  templateUrl: './tests-grid.component.html',
  styleUrls: ['./tests-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestsGridComponent implements OnInit {
  private readonly testService = inject(TestService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  /** Category slug (/test/list/:type) — limits the grid to that category's sections; empty shows all tests. */
  readonly category = input('');

  skeletonItems = Array(6);
  loading = signal(true);
  readonly query = signal('');
  private allTests = signal<Test[]>([]);

  /** PHQ-9 and GAD-7: the usual first screeners, offered on the all-tests page. */
  readonly starters = computed(() => {
    if (this.category()) return [];
    return [/PHQ-9/i, /GAD-7/i]
      .map(re => this.allTests().find(t => re.test(t.name ?? '')))
      .filter((t): t is Test => !!t);
  });

  readonly total = computed(() => this.groups().reduce((n, g) => n + g.tests.length, 0));

  groups = computed(() => {
    const filter = CATEGORY_SECTIONS[this.category()];
    const q = this.query().trim().toLowerCase();
    const tests = (filter
      ? this.allTests().filter(t => filter.sections.includes(sectionOf(t)) || filter.extra?.test(t.name ?? ''))
      : this.allTests()
    ).filter(t => !q || `${t.name} ${t.description}`.toLowerCase().includes(q));
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
          setTimeout(() => this.scrollToFragment(this.route.snapshot.fragment));   // after the sections render
        },
        error: () => this.loading.set(false),
      });
  }

  private scrollToFragment(fragment: string | null): void {
    if (!fragment || typeof document === 'undefined') return;
    const el = document.getElementById(fragment);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
