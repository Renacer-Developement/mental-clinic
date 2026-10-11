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
import { TESTS_PRIORITY } from '../../constants/test-categories.constants';
import { CATEGORY_SECTIONS, OTHER_SECTION, sectionOf, TEST_SECTIONS } from '../../constants/test-sections.constants';
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

export const sectionAnchor = (title: string): string =>
  'tests-' + title.toLowerCase().replace(/[^a-zа-яіїєґ0-9]+/gi, '-');

@Component({
  standalone: true,
  imports: [CommonModule, ImportsModule, CardComponent],
  selector: 'app-tests-grid',
  templateUrl: './tests-grid.component.html',
  styleUrls: ['./tests-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestsGridComponent implements OnInit {
  private readonly testService = inject(TestService);
  private readonly destroyRef = inject(DestroyRef);

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
    this.testService.getTests()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: tests => {
          this.allTests.set(sortByPriority(tests));
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
