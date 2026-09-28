import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImportsModule } from '../../shared/primeng-imports.module';
import { Component, inject, OnInit } from '@angular/core';
import { ClinicContactsService } from '../shared/components/clinic-contacts-dialog/clinic-contacts.service';
import { clinicContacts } from '../shared/constants/contacts.constants';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  standalone: true,
  imports: [CommonModule, ImportsModule, RouterLink],
  selector: 'app-visit-page',
  templateUrl: './visit-page.component.html',
  styleUrl: './visit-page.component.scss',
})
export class VisitPageComponent implements OnInit {
  private readonly contactsService = inject(ClinicContactsService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updatePage({
      title: "Онлайн запис до психіатра Євгена Скрипника — консультація щодня 8:00–22:00",
      description: "Запишіться на онлайн консультацію до психіатра Євгена Скрипника. Відеоконсультація щодня 8:00–22:00. Конфіденційно, безпечно. Перший крок до психічного здоров'я.",
      canonical: '/visit',
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'MedicalClinic',
          name: "Онлайн центр ментального здоров'я Євгена Скрипника",
          url: 'https://doctor-skripnik.com.ua/visit',
          telephone: '+380665691677',
          openingHours: 'Mo-Su 08:00-22:00',
          description: 'Онлайн консультація психіатра щодня з 8:00 до 22:00. Відеозустріч, конфіденційно, доступно з будь-якого місця.',
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Послуги психіатра',
            itemListElement: [
              {
                '@type': 'Offer',
                name: 'Ознайомча онлайн консультація',
                description: 'Перша консультація: збір анамнезу, оцінка клінічної картини, план лікування',
                availability: 'https://schema.org/InStock',
                areaServed: { '@type': 'Country', name: 'Ukraine' },
              },
              {
                '@type': 'Offer',
                name: 'Безкоштовна психологічна підтримка',
                description: 'Чат підтримки пн–сб 10:00–12:00 та 19:00–21:00',
                price: '0',
                priceCurrency: 'UAH',
              },
            ],
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Головна', item: 'https://doctor-skripnik.com.ua/' },
              { '@type': 'ListItem', position: 2, name: 'Онлайн запис', item: 'https://doctor-skripnik.com.ua/visit' },
            ],
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Що таке ознайомча консультація?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Перша комунікація дозволяє визначити стан клієнта та порекомендувати індивідуальний курс лікування. Лікар збирає анамнез, оцінює клінічну картину і формулює план подальшої роботи.',
              },
            },
            {
              '@type': 'Question',
              name: 'Чи є безкоштовна психологічна підтримка?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Так. З понеділка по суботу з 10:00 до 12:00 та з 19:00 до 21:00 доказові та кваліфіковані лікарі й психологи працюють у чатах підтримки, аби відповісти на ваші запитання та надати потрібні поради.',
              },
            },
            {
              '@type': 'Question',
              name: 'Як скасувати або перенести консультацію?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Скасувати або перенести консультацію можна без втрат. Ми повертаємо кошти на рахунок або залишаємо їх на балансі для наступного запису — на ваш розсуд.',
              },
            },
            {
              '@type': 'Question',
              name: 'Чому онлайн-консультації ефективні?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Спілкуйтесь з фахівцем з будь-якого місця. Обирайте зручний час без витрат на дорогу. Ваші дані повністю конфіденційні. Доступно для всіх регіонів України та для українців за кордоном.",
              },
            },
          ],
        },
      ],
    });
  }

  openContacts() {
    this.contactsService.openDialog(clinicContacts);
  }
}
