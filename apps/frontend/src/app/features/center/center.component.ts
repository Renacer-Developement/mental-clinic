import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { ROUTES, TEST_ROUTES } from '../../shared/constants/routes.constants';
import { CONDITIONS } from '../conditions/conditions.data';
import { clinicContacts } from '../shared/constants/contacts.constants';

const BASE_URL = 'https://doctor-skripnik.com.ua';
const PAGE_URL = `${BASE_URL}/${ROUTES.CENTER}`;

/** +380665691677 → +38 (066) 569-16-77 */
const formatPhone = (p: string) => p.replace(/^\+38(\d{3})(\d{3})(\d{2})(\d{2})$/, '+38 ($1) $2-$3-$4');

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrl: './center.component.scss',
})
export class CenterComponent implements OnInit {
  private readonly seo = inject(SeoService);

  protected readonly ROUTES = ROUTES;

  protected readonly facts = [
    { icon: 'pi-check-circle', value: 'Ліцензія МОЗ', label: '№ 1285 від 17.07.2023' },
    { icon: 'pi-star', value: '20+ років', label: 'досвіду засновника' },
    { icon: 'pi-clock', value: 'Пн–Сб', label: 'з 8:00 до 22:00' },
    { icon: 'pi-globe', value: 'Онлайн', label: 'з будь-якого місця' },
  ];

  protected readonly principles = [
    {
      icon: 'pi-book',
      title: 'Доказова медицина',
      text: 'Діагностика та лікування лише за міжнародними клінічними протоколами — без псевдонаукових методів.',
    },
    {
      icon: 'pi-lock',
      title: 'Конфіденційність',
      text: 'Лікарська таємниця суворо дотримується: жодна інформація не передається третім особам без вашої згоди.',
    },
    {
      icon: 'pi-video',
      title: 'Доступність',
      text: 'Відеоконсультація в Telegram, Viber, Google Meet або Zoom — без черг і дороги, у зручний для вас час.',
    },
    {
      icon: 'pi-heart',
      title: 'Чесність',
      text: 'Пояснюємо діагноз і лікування зрозумілою мовою. Скасувати чи перенести запис можна без втрат.',
    },
  ];

  // first sentence of each condition page's lead, as a teaser
  protected readonly conditions = CONDITIONS.map(c => ({
    slug: c.slug,
    label: c.label,
    text: c.lead.split(/(?<=[.!?])\s/)[0],
  }));

  protected readonly services = [
    { icon: 'pi-user', title: 'Консультація психіатра', text: 'Діагностика, призначення та план лікування на відеозустрічі.', link: '/' + ROUTES.VISIT },
    { icon: 'pi-comments', title: 'Консультація психолога', text: 'Психологічне консультування та психотерапія без медикаментів.', link: '/' + ROUTES.VISIT }, // was ROUTES.TEAM — team page hidden until specialists are added
    { icon: 'pi-comment', title: 'Безкоштовна підтримка', text: 'Чати підтримки пн–сб, 10:00–12:00 та 19:00–21:00: лікарі й психологи відповідають на запитання.', link: '/' + ROUTES.VISIT },
    { icon: 'pi-list-check', title: 'Психологічні тести', text: 'Клінічно валідовані шкали для самоперевірки перед консультацією.', link: '/' + TEST_ROUTES.LIST },
    { icon: 'pi-shield', title: 'Перевірка ліків', text: 'Довідник препаратів і перевірка їхньої взаємодії.', link: '/' + ROUTES.DRUGS },
    { icon: 'pi-file-edit', title: 'Статті', text: 'Матеріали про психічне здоров’я, написані з позицій доказової медицини.', link: '/' + ROUTES.ARTICLES },
  ];

  protected readonly steps = [
    { title: 'Запис', text: 'Зателефонуйте або напишіть — адміністратор підбере зручний час.' },
    { title: 'Знайомство', text: 'Фахівець збирає анамнез і уважно вислуховує, що вас турбує.' },
    { title: 'Оцінка стану', text: 'Структурована клінічна оцінка за доказовими протоколами.' },
    { title: 'План лікування', text: 'Призначення, розгорнуті рекомендації та план подальшої роботи.' },
  ];

  protected readonly phones = [
    { label: 'Запис до лікарів', phone: clinicContacts.doctors.phone, text: formatPhone(clinicContacts.doctors.phone) },
    { label: 'Запис до психологів', phone: clinicContacts.psychologists.phone, text: formatPhone(clinicContacts.psychologists.phone) },
  ];

  ngOnInit(): void {
    this.seo.updatePage({
      title: "Про центр ментального здоров'я Євгена Скрипника | Ліцензія МОЗ",
      description: "Онлайн центр ментального здоров'я Євгена Скрипника: ліцензія МОЗ № 1285, психіатри та психологи, доказова медицина. Консультації онлайн пн–сб 8:00–22:00.",
      keywords: ["центр ментального здоров'я", 'психіатр онлайн', 'Євген Скрипник', 'ліцензія МОЗ'],
      canonical: '/' + ROUTES.CENTER,
      ogImage: '/assets/founder.jpg',
      ogImageAlt: "Онлайн центр ментального здоров'я Євгена Скрипника",
      schema: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'AboutPage',
            '@id': `${PAGE_URL}#webpage`,
            url: PAGE_URL,
            name: "Про центр ментального здоров'я Євгена Скрипника",
            inLanguage: 'uk',
            isPartOf: { '@id': `${BASE_URL}/#website` },
            about: { '@id': `${BASE_URL}/#organization` },
            breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${PAGE_URL}#breadcrumb`,
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Головна', item: `${BASE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Про центр', item: PAGE_URL },
            ],
          },
          // same @id and types as the global node in index.html, so crawlers merge the two
          {
            '@type': ['Physician', 'LocalBusiness'],
            '@id': `${BASE_URL}/#organization`,
            name: "Онлайн центр ментального здоров'я Євгена Скрипника",
            url: BASE_URL,
            logo: `${BASE_URL}/assets/logo.avif`,
            telephone: clinicContacts.doctors.phone,
            founder: { '@id': `${BASE_URL}/#physician` },
            hasCredential: {
              '@type': 'EducationalOccupationalCredential',
              credentialCategory: 'Ліцензія МОЗ України на медичну практику',
              name: 'Рішення МОЗ № 1285 від 17.07.2023',
              url: `${BASE_URL}/assets/docs/license-moz.pdf`,
            },
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'вул. Терещенків, 56',
              addressLocality: 'Глухів',
              addressRegion: 'Сумська область',
              addressCountry: 'UA',
            },
            areaServed: { '@type': 'Country', name: 'Ukraine' },
            medicalSpecialty: ['https://schema.org/Psychiatric'],
          },
        ],
      },
    });
  }
}
