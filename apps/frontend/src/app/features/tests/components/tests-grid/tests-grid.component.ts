import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ImportsModule } from '../../../../shared/primeng-imports.module';
import { CardComponent } from '../test-card/card.component';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TESTS_PRIORITY } from '../../constants/test-categories.constants';
import { OTHER_SECTION, SECTION_BY_TYPE, sectionOf, TEST_SECTIONS } from '../../constants/test-sections.constants';
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
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  skeletonItems = Array(6);
  loading = signal(true);
  private allTests = signal<Test[]>([]);

  groups = computed(() => {
    const tests = this.allTests();
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
          this.scrollToLinkedSection();
        },
        error: () => this.loading.set(false),
      });
  }

  private scrollToLinkedSection(): void {
    const section = SECTION_BY_TYPE[this.route.snapshot.paramMap.get('type') ?? ''];
    if (!section || !this.isBrowser) return;
    setTimeout(() => document.getElementById(sectionAnchor(section))?.scrollIntoView({ behavior: 'smooth' }));
  }
}
