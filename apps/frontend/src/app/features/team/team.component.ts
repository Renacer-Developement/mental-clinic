import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { ROUTES } from '../../shared/constants/routes.constants';
import { TeamCategory, TeamMember, TeamService } from './team.service';

interface TeamGroup {
  category: TeamCategory;
  title: string;
  lead: string;
  members: TeamMember[];
}

interface Faq {
  q: string;
  a: string;
}

const BASE_URL = 'https://doctor-skripnik.com.ua';
const PAGE_URL = `${BASE_URL}/${ROUTES.TEAM}`;

const GROUPS: Omit<TeamGroup, 'members'>[] = [
  {
    category: 'psychiatrist',
    title: 'Лікарі-психіатри',
    lead: 'Діагностують психічні розлади, призначають і коригують медикаментозне лікування.',
  },
  {
    category: 'psychologist',
    title: 'Психологи',
    lead: 'Проводять психологічне консультування та психотерапію без призначення ліків.',
  },
];

// Shown on the page and mirrored into FAQPage schema — keep the two in sync by using this one list
const FAQ: Faq[] = [
  {
    q: 'Чим психіатр відрізняється від психолога?',
    a: 'Психіатр — лікар із медичною освітою: він ставить діагноз і може призначити медикаментозне лікування. Психолог не призначає ліків, а допомагає через консультування та психотерапію.',
  },
  {
    q: 'До кого звернутися спочатку — до психіатра чи психолога?',
    a: 'Якщо симптоми заважають працювати, спати чи спілкуватися, тривають тижнями або є думки про самоушкодження — почніть із психіатра. Для роботи зі стресом, стосунками чи самооцінкою зазвичай достатньо психолога. Якщо сумніваєтеся, запишіться на консультацію — ми допоможемо обрати фахівця.',
  },
  {
    q: 'Чи можна отримати консультацію онлайн?',
    a: 'Так. Фахівці центру консультують онлайн з понеділка по суботу, з 8:00 до 22:00.',
  },
  {
    q: 'Як фахівці центру підходять до лікування?',
    a: 'Уся команда працює за принципами доказової медицини та міжнародними клінічними протоколами — без псевдонаукових методів.',
  },
];

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
})
export class TeamComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly teamService = inject(TeamService);

  protected readonly ROUTES = ROUTES;
  protected readonly faq = FAQ;
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  private readonly members = signal<TeamMember[]>([]);

  // Members saved before the category field existed have none — treat them as psychiatrists, like the backend default
  protected readonly groups = computed<TeamGroup[]>(() =>
    GROUPS.map(g => ({
      ...g,
      members: this.members().filter(m => (m.category ?? 'psychiatrist') === g.category),
    })),
  );

  ngOnInit(): void {
    this.seo.updatePage({
      title: 'Команда: психіатри та психологи онлайн | Євген Скрипник',
      description: "Команда центру ментального здоров'я Євгена Скрипника: засновник, лікарі-психіатри та психологи. Доказовий підхід, онлайн-консультації пн–сб 8:00–22:00.",
      keywords: ['психіатр онлайн', 'психолог онлайн', 'команда психіатрів', 'Євген Скрипник'],
      canonical: '/' + ROUTES.TEAM,
      // Hidden from search until specialists are added — remove together with the commented-out links
      robots: 'noindex, follow',
      ogImage: '/assets/founder.jpg',
      ogImageAlt: 'Євген Скрипник — засновник центру ментального здоров’я',
      schema: this.buildSchema([]),
    });

    this.teamService.getAll().subscribe({
      next: list => {
        const active = list.filter(m => m.isActive);
        this.members.set(active);
        this.loading.set(false);
        // re-emit so the staff list is in the server-rendered JSON-LD too
        if (active.length) this.seo.setSchema(this.buildSchema(active));
      },
      error: () => {
        this.failed.set(true);
        this.loading.set(false);
      },
    });
  }

  protected initials(name: string): string {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  private buildSchema(members: TeamMember[]): object {
    const staff = members.map(m => ({
      '@type': m.category === 'psychologist' ? 'Person' : ['Person', 'Physician'],
      name: m.name,
      jobTitle: m.role,
      ...(m.photo && { image: m.photo }),
      ...(m.bio && { description: m.bio }),
      ...(m.specializations.length ? { knowsAbout: m.specializations } : {}),
      worksFor: { '@id': `${BASE_URL}/#organization` },
    }));

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'AboutPage',
          '@id': `${PAGE_URL}#webpage`,
          url: PAGE_URL,
          name: 'Команда центру ментального здоров’я Євгена Скрипника',
          inLanguage: 'uk',
          isPartOf: { '@id': `${BASE_URL}/#website` },
          about: { '@id': `${BASE_URL}/#organization` },
          primaryImageOfPage: `${BASE_URL}/assets/founder.jpg`,
          breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
          ...(staff.length ? {
            mainEntity: { '@type': 'ItemList', itemListElement: staff.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: p })) },
          } : {}),
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${PAGE_URL}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Головна', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Команда', item: PAGE_URL },
          ],
        },
        {
          '@type': ['Person', 'Physician'],
          '@id': `${BASE_URL}/#physician`,
          name: 'Євген Скрипник',
          jobTitle: 'Засновник центру, лікар-психіатр вищої категорії',
          url: `${BASE_URL}/${ROUTES.ABOUT}`,
          image: `${BASE_URL}/assets/founder.jpg`,
          worksFor: { '@id': `${BASE_URL}/#organization` },
        },
        {
          '@type': 'FAQPage',
          '@id': `${PAGE_URL}#faq`,
          mainEntity: FAQ.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    };
  }
}
