import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { ROUTES, TEST_ROUTES } from '../../shared/constants/routes.constants';
import { CONDITIONS } from '../conditions/conditions.data';
import { clinicContacts } from '../shared/constants/contacts.constants';
import { ReviewService } from '../reviews/review.service';

const BASE_URL = 'https://doctor-skripnik.com.ua';
const PAGE_URL = `${BASE_URL}/${ROUTES.CENTER}`;

/** +380665691677 → +38 (066) 569-16-77 */
const formatPhone = (p: string) => p.replace(/^\+38(\d{3})(\d{3})(\d{2})(\d{2})$/, '+38 ($1) $2-$3-$4');

// 1 відгук · 2–4 відгуки · 5+ (and 11–14) відгуків
function reviewNoun(n: number): string {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'відгук';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'відгуки';
  return 'відгуків';
}

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrl: './center.component.scss',
})
export class CenterComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly reviews = inject(ReviewService);

  protected readonly ROUTES = ROUTES;

  protected readonly mainPhone = { href: 'tel:' + clinicContacts.doctors.phone, text: formatPhone(clinicContacts.doctors.phone) };

  /** Live from the reviews API; the proof row shows a plain link until it arrives. */
  protected readonly rating = signal<{ avg: string; total: number; noun: string } | null>(null);

  // Real words, quoted from patient reviews on /reviews
  protected readonly quotes = [
    { text: 'Я дійсно була почута по справжньому, а не ігнорована і висміяна, отримала лікування яке справді допомагає.', author: 'Наталія' },
    { text: 'Лікар завжди вичерпно і однозначно відповідає на запитання, завдяки чому я подолала багато негативних упереджень і страхів щодо антидепресантів', author: 'Ольга' },
    { text: 'Євген Васильович із самого початку не обіцяв мені швидкого одужання. Він чесно говорив, що хронічні захворювання лікувати складно.', author: 'Галина' },
  ];

  protected readonly credentials = [
    'Лікар-психіатр вищої категорії, понад 20 років практики',
    'Лікар-експерт Національного превентивного механізму при Уповноваженому Верховної Ради з прав людини',
    'Номінант «Лікар року» 2021',
    'Засновник спільнот «Доказові психіатри, психотерапевти та психологи» та «Доказові лікарі України»',
  ];

  protected readonly principles = [
    {
      title: 'Доказова медицина',
      text: 'Діагностика та лікування лише за міжнародними клінічними протоколами — без псевдонаукових методів.',
    },
    {
      title: 'Конфіденційність',
      text: 'Лікарська таємниця суворо дотримується: жодна інформація не передається третім особам без вашої згоди.',
    },
    {
      title: 'Доступність',
      text: 'Відеоконсультація в Telegram, Viber, Google Meet або Zoom — без дороги, у зручний для вас час.',
    },
    {
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
    { title: 'Консультація психіатра', text: 'Діагностика, призначення та план лікування на відеозустрічі.', link: '/' + ROUTES.VISIT },
    { title: 'Консультація психолога', text: 'Психологічне консультування та психотерапія без медикаментів.', link: '/' + ROUTES.VISIT }, // was ROUTES.TEAM — team page hidden until specialists are added
    { title: 'Безкоштовна підтримка', text: 'Чати підтримки пн–сб, 10:00–12:00 та 19:00–21:00: лікарі й психологи відповідають на запитання.', link: '/' + ROUTES.VISIT },
    { title: 'Психологічні тести', text: 'Клінічно валідовані шкали для самоперевірки перед консультацією.', link: '/' + TEST_ROUTES.LIST },
    { title: 'Перевірка ліків', text: 'Довідник препаратів і перевірка їхньої взаємодії.', link: '/' + ROUTES.DRUGS },
    { title: 'Статті', text: 'Матеріали про психічне здоров’я, написані з позицій доказової медицини.', link: '/' + ROUTES.ARTICLES },
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
    this.reviews.getPublic(1, 1).subscribe({
      next: ({ total, avgRating }) => {
        if (total && avgRating) this.rating.set({ avg: avgRating.toFixed(1).replace('.', ','), total, noun: reviewNoun(total) });
      },
    });

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
