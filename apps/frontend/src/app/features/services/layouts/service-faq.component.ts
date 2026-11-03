import { Component, input } from '@angular/core';
import { ConditionFaq } from '../../conditions/conditions.data';

/** FAQ accordion; pages theme it with --faq-ink, --faq-line and --faq-text. */
@Component({
  standalone: true,
  selector: 'app-service-faq',
  template: `
    @for (f of faqs(); track f.q) {
      <details>
        <summary>{{ f.q }}<span class="icon" aria-hidden="true"></span></summary>
        <p>{{ f.a }}</p>
      </details>
    }
  `,
  styles: `
    :host { display: block; --faq-ink: #2d2e2e; --faq-line: rgba(45, 46, 46, 0.16); --faq-text: #4a4542; }
    details { border-bottom: 1px solid var(--faq-line); }
    details:first-child { border-top: 1px solid var(--faq-line); }
    summary {
      display: flex; justify-content: space-between; align-items: center; gap: 1rem;
      min-height: 64px; padding: 1rem 0; list-style: none; cursor: pointer;
      font-size: 1.05rem; font-weight: 600; color: var(--faq-ink);
    }
    summary::-webkit-details-marker { display: none; }
    .icon { position: relative; flex: none; width: 14px; height: 14px; }
    .icon::before, .icon::after {
      content: ''; position: absolute; inset: 6px 0 auto; height: 2px; border-radius: 1px; background: var(--faq-ink);
      transition: transform 0.2s;
    }
    .icon::after { transform: rotate(90deg); }
    details[open] .icon::after { transform: rotate(0deg); }
    p { margin: 0 0 1.25rem; max-width: 46rem; line-height: 1.65; color: var(--faq-text); }
  `,
})
export class ServiceFaqComponent {
  readonly faqs = input.required<ConditionFaq[]>();
}
