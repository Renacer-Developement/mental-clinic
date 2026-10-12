import { RouterLink } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { ClinicContactsService } from '../shared/components/clinic-contacts-dialog/clinic-contacts.service';
import { clinicContacts } from '../shared/constants/contacts.constants';
import { SeoService } from '../../core/seo/seo.service';
import { GoogleAnalyticsService } from '../../analytics/google-analytics.service';
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
  private readonly analytics = inject(GoogleAnalyticsService);

  protected readonly TEST_ROUTES = TEST_ROUTES;

  readonly phones = Object.values(clinicContacts).map(c => ({ ...c, label: formatPhone(c.phone) }));

  readonly facts = [
    { title: 'Пн–Сб 8:00–22:00', text: 'Запис у зручний час без черг, зокрема в суботу' },
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

  // `slug` links the card to its /likuvannya-* page (see conditions.data.ts); empty = no page yet.
  readonly reasons = [
    { slug: 'likuvannya-tryvohy', title: 'Постійна тривога та стрес', text: 'Хронічна тривожність, панічні атаки, відчуття небезпеки без видимих причин' },
    { slug: 'likuvannya-depresii', title: 'Депресивний стан', text: 'Стійкий пригнічений настрій, втрата інтересу до життя, відсутність мотивації' },
    { slug: '', title: 'Порушення сну та апетиту', text: 'Безсоння або надмірна сонливість, зміни апетиту, втрата чи набір ваги' },
    { slug: 'likuvannya-okr', title: "Нав'язливі думки та ритуали", text: "Нав'язливі думки, страхи, компульсивні дії, які заважають повноцінному життю" },
    { slug: 'likuvannya-ptsr', title: 'Психотравма та ПТСР', text: 'Наслідки стресових подій, флешбеки, емоційне заціпеніння, уникання' },
    { slug: 'likuvannya-zalezhnostei', title: 'Залежності', text: 'Алкогольна, медикаментозна або поведінкова залежність — шлях до одужання' },
  ];

  readonly faqs = [
    {
      q: 'Скільки коштує онлайн консультація психіатра?',
      a: 'Вартість консультації уточнюйте в адміністратора: зателефонуйте або напишіть у Telegram чи Viber — він назве актуальну ціну ще до запису й оплати. Якщо консультацію потрібно скасувати чи перенести, кошти повертаються або залишаються на балансі.',
    },
    {
      q: 'Як зрозуміти, що пора до психіатра?',
      a: 'Варто звернутися, якщо пригнічений настрій, тривога, безсоння чи нав’язливі думки тримаються довше двох тижнів, заважають працювати, спати або спілкуватися, якщо з’явилися панічні атаки, залежність чи думки про самоушкодження. Не обов’язково чекати, поки стане «зовсім погано» — рання консультація дає кращі результати.',
    },
    {
      q: 'До кого звертатися: психіатр чи психолог?',
      a: 'Психіатр — лікар: він встановлює діагноз, виключає соматичні причини і за потреби призначає медикаменти. Психолог чи психотерапевт працює розмовними методами і ліків не призначає. Якщо симптоми виражені або ви не впевнені, почніть із психіатра — він порадить, чи потрібна психотерапія і в якому методі.',
    },
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
      title: 'Запис до психіатра онлайн — Євген Скрипник, пн–сб 8:00–22:00',
      description: "Запишіться на онлайн консультацію до психіатра Євгена Скрипника. Відеоконсультація пн–сб 8:00–22:00. Конфіденційно й безпечно — перший крок до здоров'я.",
      canonical: '/visit',
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'MedicalClinic',
          name: "Онлайн центр ментального здоров'я Євгена Скрипника",
          url: 'https://doctor-skripnik.com.ua/visit',
          telephone: '+380665691677',
          openingHours: 'Mo-Sa 08:00-22:00',
          description: 'Онлайн консультація психіатра щодня, окрім неділі, з 8:00 до 22:00. Відеозустріч, конфіденційно, доступно з будь-якого місця.',
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

  trackPhone(): void {
    this.analytics.trackLead('phone', 'visit');
  }

  openContacts() {
    this.contactsService.openDialog(clinicContacts, 'visit');
  }
}
