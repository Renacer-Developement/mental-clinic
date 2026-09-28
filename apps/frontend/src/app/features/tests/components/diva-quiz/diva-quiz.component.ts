import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, OnInit, Output, PLATFORM_ID, signal } from '@angular/core';
import { Question, Test, TestDomain } from '../../models/test.model';

type Period = 'adult' | 'child';
type Domain = 'A1' | 'A2';

export interface DivaCollateral {
  label: string;
  value: number | undefined; // 1 = Так, 0 = Ні, -1 = Н/д
}

export interface DivaResult {
  a1Adult: number;
  a1Child: number;
  a2Adult: number;
  a2Child: number;
  // Supplement criterion A: more symptoms than peers
  suppA1Adult: boolean;
  suppA1Child: boolean;
  suppA2Adult: boolean;
  suppA2Child: boolean;
  adultThreshold: boolean;
  childThreshold: boolean;
  onset: boolean;
  onsetAge: string;
  impairAdult: boolean;
  impairChild: boolean;
  notOther: boolean;
  otherDisorder: string;
  collateral: DivaCollateral[];
  met: boolean;
  form: string;
}

type Step =
  | { kind: 'item'; question: Question }
  | { kind: 'supplement'; domain: Domain; adult?: Question; child?: Question }
  | { kind: 'domain'; domain: TestDomain }
  | { kind: 'criteria' };

// Official DIVA-5 thresholds (DSM-5): childhood ≥6, adulthood (17+) ≥5 in a domain
const CHILD_THRESHOLD = 6;
const ADULT_THRESHOLD = 5;

@Component({
  standalone: true,
  imports: [NgTemplateOutlet],
  selector: 'app-diva-quiz',
  templateUrl: './diva-quiz.component.html',
  styleUrls: ['../../detail-page/detail-page.component.scss', './diva-quiz.component.scss'],
})
export class DivaQuizComponent implements OnInit {
  @Input({ required: true }) test!: Test;
  @Output() completed = new EventEmitter<DivaResult>();

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  steps: Step[] = [];
  items: Question[] = [];
  bySection: Record<string, Question | undefined> = {};
  collateral: Question[] = [];

  index = signal(0);
  showError = signal(false);
  // A items: `${questionId}:adult|child`; single questions: `${questionId}`. 1 = Так, 0 = Ні, -1 = Н/д
  answers = signal<Record<string, number>>({});
  checks = signal<Record<string, true>>({});
  // Free-text "Інше" per column / domain, plus age of onset and the disorder named for criterion E
  notes = signal<Record<string, string>>({});
  onsetAge = signal('');

  step = computed(() => this.steps[this.index()]);
  isLast = computed(() => this.index() === this.steps.length - 1);

  ngOnInit(): void {
    const questions = this.test.questions ?? [];
    for (const q of questions) {
      if (q.section) this.bySection[q.section] = q;
    }
    this.items = questions.filter(q => q.section === 'A1' || q.section === 'A2');
    this.collateral = questions.filter(q => q.section?.startsWith('COLLATERAL_'));

    const itemSteps = (domain: Domain): Step[] => {
      const steps: Step[] = this.items.filter(q => q.section === domain).map(question => ({ kind: 'item', question }));
      const adult = this.bySection[`SUPP_${domain}_ADULT`];
      const child = this.bySection[`SUPP_${domain}_CHILD`];
      if (adult || child) steps.push({ kind: 'supplement', domain, adult, child });
      return steps;
    };

    this.steps = [
      ...itemSteps('A1'),
      ...itemSteps('A2'),
      ...(this.test.domains ?? []).map(domain => ({ kind: 'domain' as const, domain })),
      { kind: 'criteria' as const },
    ];
  }

  partLabel(section: string | undefined): string {
    return section === 'A1' ? 'Частина 1 — Дефіцит уваги' : 'Частина 2 — Гіперактивність / імпульсивність';
  }

  answer(key: string): number | undefined {
    return this.answers()[key];
  }

  setAnswer(key: string, value: number): void {
    this.answers.update(a => ({ ...a, [key]: value }));
    this.showError.set(false);
  }

  isChecked(key: string): boolean {
    return !!this.checks()[key];
  }

  toggleCheck(key: string): void {
    this.checks.update(c => {
      const next = { ...c };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  }

  note(key: string): string {
    return this.notes()[key] ?? '';
  }

  setNote(key: string, value: string): void {
    this.notes.update(n => ({ ...n, [key]: value }));
  }

  next(): void {
    if (!this.isStepAnswered()) {
      this.showError.set(true);
      return;
    }
    this.showError.set(false);

    if (this.isLast()) {
      this.completed.emit(this.buildResult());
      return;
    }
    this.index.update(i => i + 1);
    this.scrollToQuiz();
  }

  prev(): void {
    if (this.index() === 0) return;
    this.showError.set(false);
    this.index.update(i => i - 1);
    this.scrollToQuiz();
  }

  private isStepAnswered(): boolean {
    const step = this.step();
    const a = this.answers();
    const answered = (q?: Question) => !q || a[q._id] !== undefined;

    switch (step.kind) {
      case 'item':
        return a[`${step.question._id}:adult`] !== undefined && a[`${step.question._id}:child`] !== undefined;
      case 'supplement':
        return answered(step.adult) && answered(step.child);
      case 'criteria':
        return ['B', 'IMPAIR_ADULT', 'IMPAIR_CHILD', 'E'].every(s => answered(this.bySection[s]))
          && this.collateral.every(q => answered(q));
      default:
        return true;
    }
  }

  private count(domain: Domain, period: Period): number {
    const a = this.answers();
    return this.items.filter(q => q.section === domain && a[`${q._id}:${period}`] === 1).length;
  }

  private isYes(section: string): boolean {
    const q = this.bySection[section];
    return !!q && this.answers()[q._id] === 1;
  }

  // Older seeds without the supplement questions: don't block the criterion
  private supplement(section: string): boolean {
    return this.bySection[section] ? this.isYes(section) : true;
  }

  private buildResult(): DivaResult {
    const a1Adult = this.count('A1', 'adult');
    const a1Child = this.count('A1', 'child');
    const a2Adult = this.count('A2', 'adult');
    const a2Child = this.count('A2', 'child');

    const suppA1Adult = this.supplement('SUPP_A1_ADULT');
    const suppA1Child = this.supplement('SUPP_A1_CHILD');
    const suppA2Adult = this.supplement('SUPP_A2_ADULT');
    const suppA2Child = this.supplement('SUPP_A2_CHILD');

    // Criterion A per domain: enough symptoms AND more than in peers
    const adultA1 = a1Adult >= ADULT_THRESHOLD && suppA1Adult;
    const adultA2 = a2Adult >= ADULT_THRESHOLD && suppA2Adult;
    const childA1 = a1Child >= CHILD_THRESHOLD && suppA1Child;
    const childA2 = a2Child >= CHILD_THRESHOLD && suppA2Child;

    const adultThreshold = adultA1 || adultA2;
    const childThreshold = childA1 || childA2;

    // Criterion B: "always had the symptoms" or onset age given as < 12
    const age = parseInt(this.onsetAge(), 10);
    const onset = this.isYes('B') || (age > 0 && age < 12);
    const impairAdult = this.isYes('IMPAIR_ADULT');
    const impairChild = this.isYes('IMPAIR_CHILD');
    const notOther = !this.isYes('E');
    const met = adultThreshold && childThreshold && onset && impairAdult && impairChild && notOther;

    // DSM-5 presentation is based on current (adult) symptoms
    let form = 'не визначається — критерії не зібрані';
    if (met) {
      if (adultA1 && adultA2) form = 'комбінований тип';
      else if (adultA1) form = 'переважно неуважний тип';
      else form = 'переважно гіперактивно-імпульсивний тип';
    }

    const e = this.bySection['E'];
    return {
      a1Adult, a1Child, a2Adult, a2Child,
      suppA1Adult, suppA1Child, suppA2Adult, suppA2Child,
      adultThreshold, childThreshold, onset, onsetAge: this.onsetAge(),
      impairAdult, impairChild, notOther,
      otherDisorder: e ? this.note(`${e._id}:other`) : '',
      collateral: this.collateral.map(q => ({ label: q.question ?? '', value: this.answers()[q._id] })),
      met,
      form,
    };
  }

  private scrollToQuiz(): void {
    if (!this.isBrowser) return;
    document.querySelector('.dp-quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
