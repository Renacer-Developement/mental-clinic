import { CONDITIONS } from './app/features/conditions/conditions.data';
import { TEST_CATEGORY_CONTENT } from './app/features/tests/constants/test-category-content.constants';
import { ROUTES } from './app/shared/constants/routes.constants';

// Pages whose text lives in this codebase rather than the API. The backend's site
// search fetches /search-pages.json and indexes them next to articles and tests,
// so the text has one source and new condition pages show up on their own.

export interface SearchPage {
  url: string;
  title: string;
  snippet: string;
  /** Indexed separately, so a FAQ answer can match without the whole page */
  sections: string[];
}

const conditionPages: SearchPage[] = CONDITIONS.map(c => ({
  url: `/${c.slug}`,
  title: c.h1,
  snippet: c.description,
  sections: [
    `${c.lead}\n${c.symptomsTitle}: ${c.symptoms.join('; ')}`,
    `Як ми лікуємо: ${c.treatment.map(t => `${t.title} — ${t.text}`).join(' ')}`,
    ...c.faqs.map(f => `${f.q}\n${f.a}`),
  ],
}));

const testCategoryPages: SearchPage[] = Object.entries(TEST_CATEGORY_CONTENT).map(([slug, c]) => ({
  url: `/test/list/${slug}`,
  title: c.h1,
  snippet: c.description,
  sections: [[c.description, ...c.intro].join('\n')],
}));

const staticPages: SearchPage[] = [
  {
    url: `/${ROUTES.ONLINE_CONSULTATION}`,
    title: 'Консультація психіатра онлайн',
    snippet: 'Повноцінний прийом лікаря-психіатра по відеозв’язку з будь-якої точки України чи з-за кордону. Діагностика, план лікування, супровід 3 місяці.',
    sections: [
      'Психіатр онлайн: відеоконсультація в Telegram, Viber, Google Meet або Zoom. Лікар розпитує про скарги, оцінює стан, встановлює діагноз, за потреби призначає лікування і радить щодо психотерапії. Консультація з-за кордону.',
      'Як проходить перша консультація: запис, розмова з лікарем, клінічна оцінка, діагноз і план лікування, супровід у листуванні три місяці.',
    ],
  },
  {
    url: `/${ROUTES.VISIT}`,
    title: 'Запис на консультацію до психіатра',
    snippet: 'Як записатися до психіатра чи психолога онлайн, що підготувати, правила відвідування і скасування. Пн–Сб 8:00–22:00.',
    sections: [
      'Запис до психіатра або психолога: телефон, Telegram, Viber. Пн–Сб 8:00–22:00. Вартість назве адміністратор. Скасування або перенесення не пізніше ніж за 2 години. Що підготувати до консультації. Конфіденційність. Безкоштовна підтримка в чатах.',
    ],
  },
  {
    url: `/${ROUTES.ABOUT}`,
    title: 'Євген Скрипник — засновник центру',
    snippet: 'Лікар-психіатр, психотерапевт, нарколог і невролог з понад 20-річним досвідом.',
    sections: ['Євген Скрипник — лікар-психіатр, психотерапевт, нарколог і невролог з понад 20-річним досвідом. Освіта, досвід, підходи до лікування, доказова медицина.'],
  },
  {
    url: `/${ROUTES.CENTER}`,
    title: 'Про центр ментального здоров’я',
    snippet: 'Ліцензія МОЗ № 1285, психіатри та психологи, доказова медицина, документи та контакти.',
    sections: ['Центр ментального здоров’я Євгена Скрипника: ліцензія МОЗ № 1285 від 17.07.2023, психіатри та психологи онлайн, доказова медицина, документи, контакти.'],
  },
  {
    url: `/${ROUTES.REVIEWS}`,
    title: 'Відгуки пацієнтів',
    snippet: 'Що пишуть пацієнти про лікування в центрі.',
    sections: ['Відгуки пацієнтів про психіатра Євгена Скрипника і лікарів центру.'],
  },
  {
    url: `/${ROUTES.DRUGS}`,
    title: 'Перевірка ліків і взаємодії препаратів',
    snippet: 'Перевірте взаємодію ліків і доказовість препаратів у Medscape та Drugs.com.',
    sections: ['Перевірка взаємодії ліків, сумісність препаратів, антидепресанти, побічні ефекти: Medscape Drug Interaction Checker, Drugs.com.'],
  },
];

export const SEARCH_PAGES: SearchPage[] = [...staticPages, ...conditionPages, ...testCategoryPages];
