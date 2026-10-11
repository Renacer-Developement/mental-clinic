import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ROUTES } from '../../shared/constants/routes.constants';
import { ClinicContactsService } from '../shared/components/clinic-contacts-dialog/clinic-contacts.service';
import { clinicContacts } from '../shared/constants/contacts.constants';
import { CONDITIONS, CONDITIONS_BY_SLUG, ConditionContent } from './conditions.data';

const BASE_URL = 'https://doctor-skripnik.com.ua';

@Component({
  standalone: true,
  imports: [RouterLink, RevealDirective],
  selector: 'app-condition-page',
  templateUrl: './condition-page.component.html',
  // Reuses the visit page's design system (v-* classes) so both pages look alike.
  styleUrls: ['../visit/visit-page.component.scss', './condition-page.component.scss'],
})
export class ConditionPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly contacts = inject(ClinicContactsService);

  protected readonly ROUTES = ROUTES;

  readonly condition: ConditionContent = CONDITIONS_BY_SLUG[this.route.snapshot.data['slug']];
  readonly related = CONDITIONS.filter(c => c.slug !== this.condition.slug);

  ngOnInit(): void {
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

  openContacts(): void {
    this.contacts.openDialog(clinicContacts, 'condition-page');
  }
}
