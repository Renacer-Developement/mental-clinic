import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { ROUTES } from '../../shared/constants/routes.constants';
import { ClinicContactsService } from '../shared/components/clinic-contacts-dialog/clinic-contacts.service';
import { clinicContacts } from '../shared/constants/contacts.constants';
import { Review, ReviewService } from '../reviews/review.service';
import { CONDITIONS, CONDITIONS_BY_SLUG, ConditionContent } from './conditions.data';

const BASE_URL = 'https://doctor-skripnik.com.ua';

// JS \b only knows Latin letters, so short Cyrillic abbreviations need explicit edges.
const L = 'А-ЯІЇЄҐа-яіїєґʼ\'’';
const word = (w: string) => `(^|[^${L}])(${w})(?=[^${L}]|$)`;

/** Which real patient reviews talk about this condition. */
const REVIEW_TOPICS: Record<string, RegExp> = {
  'likuvannya-depresii': /депрес/i,
  'likuvannya-tryvohy': /тривог|панічн|ГТР/i,
  'likuvannya-ptsr': new RegExp(`${word('ПТСР')}|психотравм|війн`, 'i'),
  'likuvannya-okr': new RegExp(`${word('ОКР')}|нав.язлив`, 'i'),
  'likuvannya-zalezhnostei': /алкогол|кинути пити|залежн/i,
  'likuvannya-rduh': /РДУГ/,
  'likuvannya-bipolyarnoho-rozladu': new RegExp(`біполяр|${word('БАР')}`, 'i'),
};

/** +380665691677 → +38 (066) 569-16-77 */
const formatPhone = (p: string) => p.replace(/^\+38(\d{3})(\d{3})(\d{2})(\d{2})$/, '+38 ($1) $2-$3-$4');

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-condition-page',
  templateUrl: './condition-page.component.html',
  styleUrl: './condition-page.component.scss',
})
export class ConditionPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly contacts = inject(ClinicContactsService);
  private readonly reviewService = inject(ReviewService);

  protected readonly ROUTES = ROUTES;
  protected readonly phone = { href: 'tel:' + clinicContacts.doctors.phone, text: formatPhone(clinicContacts.doctors.phone) };

  readonly condition: ConditionContent = CONDITIONS_BY_SLUG[this.route.snapshot.data['slug']];
  readonly related = CONDITIONS.filter(c => c.slug !== this.condition.slug);

  /** Up to three real reviews that mention this condition; the block hides when there are none. */
  readonly reviews = signal<Review[]>([]);

  ngOnInit(): void {
    this.updateSeo();
    this.loadReviews();
  }

  jump(id: string): void {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    // <base href="/"> would resolve a bare '#id' against the site root
    history.replaceState(null, '', location.pathname + '#' + id);
  }

  openContacts(): void {
    this.contacts.openDialog(clinicContacts, 'condition-page');
  }

  private loadReviews(): void {
    const topic = REVIEW_TOPICS[this.condition.slug];
    if (!topic) return;

    // The API caps a page at 50; two pages cover today's ~100 reviews.
    const picked: Review[] = [];
    const take = (data: Review[]) => {
      for (const r of data) {
        if (picked.length >= 3) break;
        // short enough to read in a card, long enough to say something
        if (r.rating >= 4 && r.text.length >= 80 && r.text.length <= 520 && topic.test(r.text)) picked.push(r);
      }
      this.reviews.set([...picked]);
    };

    this.reviewService.getPublic(1, 50).subscribe({
      next: first => {
        take(first.data);
        if (picked.length < 3 && first.hasMore) {
          this.reviewService.getPublic(2, 50).subscribe({ next: second => take(second.data) });
        }
      },
    });
  }

  private updateSeo(): void {
    const c = this.condition;
    const url = `${BASE_URL}/${c.slug}`;

    this.seo.updatePage({
      title: c.title,
      description: c.description,
      canonical: `/${c.slug}`,
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'MedicalWebPage',
          url,
          name: c.h1,
          description: c.description,
          inLanguage: 'uk',
          about: { '@type': 'MedicalCondition', name: c.label },
          audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
          reviewedBy: { '@id': `${BASE_URL}/#physician` },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Головна', item: `${BASE_URL}/` },
              { '@type': 'ListItem', position: 2, name: c.label, item: url },
            ],
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: c.faqs.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    });
  }
}
