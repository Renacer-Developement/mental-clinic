import { RouterLink } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { ClinicContactsService } from '../shared/components/clinic-contacts-dialog/clinic-contacts.service';
import { clinicContacts } from '../shared/constants/contacts.constants';
import { SeoService } from '../../core/seo/seo.service';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { TEST_ROUTES } from '../../shared/constants/routes.constants';

/** +380665691677 → +38 (066) 569-16-77 */
const formatPhone = (phone: string) =>
  phone.replace(/^\+38(\d{3})(\d{3})(\d{2})(\d{2})$/, '+38 ($1) $2-$3-$4');

@Component({
  standalone: true,
  imports: [RouterLink, RevealDirective],
  selector: 'app-visit-page',
  templateUrl: './visit-page.component.html',
  styleUrl: './visit-page.component.scss',
})
export class VisitPageComponent implements OnInit {
  private readonly contactsService = inject(ClinicContactsService);
  private readonly seo = inject(SeoService);

  protected readonly TEST_ROUTES = TEST_ROUTES;

  readonly phones = Object.values(clinicContacts).map(c => ({ ...c, label: formatPhone(c.phone) }));

  readonly facts = [
    { title: 'Щодня 8:00–22:00', text: 'Запис у зручний час без черг, зокрема у вихідні' },
    { title: 'Відеоконсультація', text: 'Telegram, Viber, Google Meet або Zoom — як вам зручніше' },
    { title: 'Скасування без втрат', text: 'Перенесемо запис або повернемо кошти — на ваш вибір' },
  ];

  readonly steps = [
    {
      title: 'Запис',
      text: 'Зателефонуйте або напишіть — адміністратор відповість на запитання та підбере зручний час.',
    },
    {
      title: 'Знайомство',
      text: 'На відеозустрічі лікар збирає анамнез і уважно вислуховує, що саме вас турбує.',
    },
    {
      title: 'Клінічна оцінка',
      text: 'Структурована оцінка стану за доказовими протоколами — без поспіху та засуджень.',
    },
    {
      title: 'План лікування',
      text: 'Ви отримуєте призначення, розгорнуті рекомендації та план подальшої роботи.',
    },
  ];

  readonly reasons = [
    { title: 'Постійна тривога та стрес', text: 'Хронічна тривожність, панічні атаки, відчуття небезпеки без видимих причин' },
    { title: 'Депресивний стан', text: 'Стійкий пригнічений настрій, втрата інтересу до життя, відсутність мотивації' },
    { title: 'Порушення сну та апетиту', text: 'Безсоння або надмірна сонливість, зміни апетиту, втрата чи набір ваги' },
    { title: "Нав'язливі думки та ритуали", text: "Нав'язливі думки, страхи, компульсивні дії, які заважають повноцінному життю" },
    { title: 'Психотравма та ПТСР', text: 'Наслідки стресових подій, флешбеки, емоційне заціпеніння, уникання' },
    { title: 'Залежності', text: 'Алкогольна, медикаментозна або поведінкова залежність — шлях до одужання' },
  ];

  readonly faqs = [
    {
      q: 'Що таке ознайомча консультація?',
      a: 'Перша зустріч, на якій лікар визначає ваш стан і рекомендує індивідуальний курс лікування: збирає анамнез, оцінює клінічну картину та формулює план подальшої роботи.',
    },
    {
      q: 'Як проходить онлайн-консультація?',
      a: 'У зручному для вас месенджері — Telegram, Viber, Google Meet або Zoom — з обов’язковим відеозв’язком. Достатньо смартфона або комп’ютера та тихого місця.',
    },
    {
      q: 'Чи є безкоштовна психологічна підтримка?',
      a: 'Так. З понеділка по суботу з 10:00 до 12:00 та з 19:00 до 21:00 лікарі й психологи відповідають у чатах підтримки на ваші запитання.',
    },
    {
      q: 'Як скасувати або перенести консультацію?',
      a: 'Скасувати або перенести консультацію можна без втрат. Ми повертаємо кошти або залишаємо їх на балансі для наступного запису — на ваш розсуд.',
    },
    {
      q: 'Чому онлайн-консультації ефективні?',
      a: 'Ви спілкуєтеся з фахівцем з будь-якого місця, обираєте зручний час і не витрачаєтеся на дорогу. Консультації доступні в усіх регіонах України та для українців за кордоном.',
    },
  ];

  ngOnInit(): void {
    this.seo.updatePage({
      title: 'Запис до психіатра онлайн — Євген Скрипник, щодня 8:00–22:00',
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
          // Built from the same list the page renders, so markup and visible text never drift.
          mainEntity: this.faqs.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    });
  }

  openContacts() {
    this.contactsService.openDialog(clinicContacts);
  }
}
