import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { AddictionPageComponent } from './layouts/addiction/addiction-page.component';
import { TherapyPageComponent } from './layouts/therapy/therapy-page.component';
import { DoctorsPageComponent } from './layouts/doctors/doctors-page.component';
import { ChildPageComponent } from './layouts/child/child-page.component';
import { AdhdPageComponent } from './layouts/adhd/adhd-page.component';
import { SERVICES_BY_SLUG, ServiceContent } from './services.data';

const BASE_URL = 'https://doctor-skripnik.com.ua';

// Route shell: SEO here, markup in one layout per service. The pages share
// content shape and the booking journey but deliberately not their design.
@Component({
  standalone: true,
  imports: [AddictionPageComponent, TherapyPageComponent, DoctorsPageComponent, ChildPageComponent, AdhdPageComponent],
  selector: 'app-service-page',
  templateUrl: './service-page.component.html',
})
export class ServicePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  readonly service: ServiceContent = SERVICES_BY_SLUG[this.route.snapshot.data['slug']];

  ngOnInit(): void {
    this.updateSeo();
  }

  private updateSeo(): void {
    const s = this.service;
    const url = `${BASE_URL}/${s.slug}`;

    this.seo.updatePage({
      title: s.title,
      description: s.description,
      canonical: `/${s.slug}`,
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'MedicalWebPage',
          url,
          name: s.h1,
          description: s.description,
          inLanguage: 'uk',
          about: { '@type': 'MedicalTherapy', name: s.label },
          audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
          reviewedBy: { '@id': `${BASE_URL}/#physician` },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Головна', item: `${BASE_URL}/` },
              { '@type': 'ListItem', position: 2, name: s.label, item: url },
            ],
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: s.faqs.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    });
  }
}
