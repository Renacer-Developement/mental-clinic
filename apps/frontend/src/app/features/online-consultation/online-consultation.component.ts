import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { ROUTES } from '../../shared/constants/routes.constants';
import { ClinicContactsService } from '../shared/components/clinic-contacts-dialog/clinic-contacts.service';
import { clinicContacts } from '../shared/constants/contacts.constants';
import { Review, ReviewService } from '../reviews/review.service';
import { CONDITIONS } from '../conditions/conditions.data';

const BASE_URL = 'https://doctor-skripnik.com.ua';

/** Reviews that talk about the online format itself come first. */
const ONLINE_TOPIC = /онлайн|відео|дистанц|за кордон|з-за кордону|в іншій країні/i;

/** +380665691677 → +38 (066) 569-16-77 */
const formatPhone = (p: string) => p.replace(/^\+38(\d{3})(\d{3})(\d{2})(\d{2})$/, '+38 ($1) $2-$3-$4');

// Landing page for the "психіатр онлайн" / "консультація психіатра онлайн" searches,
// which only the home page competed for. /visit stays the booking page; this one
// explains the service. It reuses the condition pages' layout and styles.
@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-online-consultation',
  templateUrl: './online-consultation.component.html',
  styleUrl: '../conditions/condition-page.component.scss',
})
export class OnlineConsultationComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly contacts = inject(ClinicContactsService);
  private readonly reviewService = inject(ReviewService);

  protected readonly ROUTES = ROUTES;
  protected readonly slug = ROUTES.ONLINE_CONSULTATION;
  protected readonly phone = { href: 'tel:' + clinicContacts.doctors.phone, text: formatPhone(clinicContacts.doctors.phone) };
  protected readonly conditions = CONDITIONS;

  readonly h1 = 'Консультація психіатра онлайн';

  readonly whatDoctorDoes = [
    'Розпитує про скарги, їхню тривалість, сон, апетит, настрій і попереднє лікування',
    'Оцінює стан за доказовими протоколами та валідованими шкалами',
    'Встановлює діагноз або пояснює, які ще обстеження потрібні',
    'Виключає соматичні причини симптомів — проблеми зі щитоподібною залозою, серцем, побічну дію ліків',
    'За потреби призначає медикаментозне лікування і пояснює, як його приймати',
    'Коригує лікування, яке вже призначили раніше, якщо воно не допомагає або погано переноситься',
    'Радить, чи потрібна психотерапія і в якому методі',
  ];

  readonly steps = [
    { title: 'Запис', text: 'Ви телефонуєте або пишете в Telegram чи Viber. Адміністратор підбирає лікаря, зручний час і месенджер для відеозв’язку.' },
    { title: 'Розмова з лікарем', text: 'Лікар уважно вислуховує, що вас турбує, і ставить уточнювальні запитання. Говорити можна своїми словами — правильних чи неправильних відповідей немає.' },
    { title: 'Клінічна оцінка', text: 'Лікар оцінює стан за доказовими протоколами. Якщо потрібно, просить пройти валідований опитувальник або зробити аналізи.' },
    { title: 'Діагноз і план лікування', text: 'Ви дізнаєтеся, що з вами відбувається, і отримуєте план: призначення, рекомендації щодо режиму, психотерапії й подальших консультацій.' },
    { title: 'Супровід у листуванні', text: 'Ще три місяці після консультації лікар на зв’язку: відповідає на запитання і коригує лікування.' },
  ];

  readonly notOnline = [
    'Думки про самогубство з конкретним планом або намір заподіяти собі шкоду',
    'Гострий психоз: людина чує голоси, бачить те, чого немає, і може бути небезпечною для себе чи інших',
    'Важкий абстинентний синдром або алкогольний делірій — сплутаність, тремтіння, галюцинації',
    'Стан, коли людина не може або не хоче вийти на зв’язок сама',
  ];

  readonly faqs = [
    {
      q: 'Чи ефективна консультація психіатра онлайн?',
      a: 'Так. Дослідження показують, що діагностика і лікування депресії, тривожних розладів, ПТСР та багатьох інших станів по відеозв’язку дають результати, порівнянні з очним прийомом. Психіатр працює насамперед через розмову, тому формат консультації майже не змінюється.',
    },
    {
      q: 'Чи можна отримати консультацію з-за кордону?',
      a: 'Так. Консультація проходить по відеозв’язку, тому підключитися можна з будь-якої країни — потрібні лише смартфон чи комп’ютер з камерою та стабільний інтернет.',
    },
    {
      q: 'Як проходить онлайн консультація психіатра?',
      a: 'У зручному для вас месенджері — Telegram, Viber, Google Meet або Zoom — з обов’язковим відеозв’язком. Лікар розпитує про скарги, оцінює стан, пояснює діагноз і складає план лікування. Після консультації ще три місяці можна писати лікарю із запитаннями.',
    },
    {
      q: 'Чи конфіденційна онлайн консультація?',
      a: 'Так. Лікарі дотримуються лікарської таємниці, а інформація з консультації не передається третім особам без вашої згоди. Для розмови оберіть тихе місце, де вас ніхто не почує.',
    },
    {
      q: 'Скільки коштує консультація психіатра онлайн?',
      a: 'Актуальну вартість назве адміністратор ще до запису й оплати — зателефонуйте або напишіть у Telegram чи Viber. Якщо консультацію потрібно скасувати чи перенести не пізніше ніж за 2 години, кошти повертаються або запис переноситься.',
    },
    {
      q: 'Психіатр чи психолог онлайн — до кого звернутися?',
      a: 'Психіатр — лікар: він встановлює діагноз, виключає соматичні причини і за потреби призначає медикаменти. Психолог працює розмовними методами і ліків не призначає. Якщо симптоми виражені або ви не впевнені, почніть із психіатра — він порадить, чи потрібна психотерапія.',
    },
    {
      q: 'Що робити, якщо стан критичний?',
      a: 'Якщо є думки про самогубство, загроза життю чи гострий психоз, не чекайте консультації: телефонуйте 112 або на гарячу лінію Lifeline Ukraine 7333 (цілодобово, безкоштовно), чи зверніться до найближчого приймального відділення.',
    },
  ];

  /** Up to three real reviews, online-format ones first; the block hides when there are none. */
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
    this.contacts.openDialog(clinicContacts, 'online-consultation');
  }

  private loadReviews(): void {
    // short enough to read in a card, long enough to say something
    const readable = (r: Review) => r.rating >= 4 && r.text.length >= 80 && r.text.length <= 520;

    this.reviewService.getPublic(1, 50).subscribe({
      next: page => {
        const good = page.data.filter(readable);
        const online = good.filter(r => ONLINE_TOPIC.test(r.text));
        this.reviews.set([...online, ...good.filter(r => !online.includes(r))].slice(0, 3));
      },
    });
  }

  private updateSeo(): void {
    const url = `${BASE_URL}/${this.slug}`;

    this.seo.updatePage({
      title: 'Консультація психіатра онлайн — Центр Євгена Скрипника',
      description: 'Онлайн консультація психіатра по відеозв’язку з будь-якої точки України чи з-за кордону. Діагностика, план лікування, супровід 3 місяці. Пн–Сб 8:00–22:00.',
      canonical: `/${this.slug}`,
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'MedicalWebPage',
          url,
          name: this.h1,
          inLanguage: 'uk',
          audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
          reviewedBy: { '@id': `${BASE_URL}/#physician` },
          mainEntity: {
            '@type': 'Service',
            name: 'Онлайн консультація психіатра',
            serviceType: 'Консультація лікаря-психіатра',
            provider: { '@id': `${BASE_URL}/#organization` },
            areaServed: { '@type': 'Country', name: 'Ukraine' },
            availableChannel: { '@type': 'ServiceChannel', serviceUrl: url, servicePhone: clinicContacts.doctors.phone },
            hoursAvailable: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              opens: '08:00',
              closes: '22:00',
            },
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Головна', item: `${BASE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Психіатр онлайн', item: url },
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
}
