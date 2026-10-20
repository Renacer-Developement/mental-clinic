import { Test } from '../models/test.model';
import { TEST_CATEGORIES_CONST } from './test-categories.constants';

// Sections of the tests list, in display order. A test goes to the first section
// whose pattern matches its name — so more specific rules come first
// (e.g. "РДУГ у дитини" before "РДУГ", HADS before plain "депресія").
export const TEST_SECTIONS: { title: string; match: RegExp }[] = [
  { title: 'Депресія',             match: /депрес/i },
  { title: 'Депресія (діти)',      match: /MFQ/i },
  { title: 'Тривога',              match: /тривог|фобі/i },
  { title: 'Тривога (діти)',       match: /SCARED/i },
  { title: 'ОКР',                  match: /ОКР|Йеля-Брауна/i },
  { title: 'ПТСР',                 match: /ПТСР/i },
  { title: 'Панічні атаки',        match: /панічн/i },
  { title: 'Біполярний розлад',    match: /біполяр|гіпоман/i },
  { title: 'Розлади особистості',  match: /особистост|МРО|межов/i },
  { title: 'Психотичні розлади',   match: /шизотип|психот/i },
  { title: 'Схема-терапія',        match: /схем|SMI|YSQ/i },
  { title: 'РДУГ',                 match: /РДУГ|СДУГ|DIVA|ASRS/i },
  { title: 'РДУГ (діти)',          match: /у дитини|для батьків/i },
  { title: 'Аутизм',               match: /RAADS|RBQ|повторюван/i },
  { title: 'Аутизм (діти)',        match: /аутизм/i },
  { title: 'Залежності',           match: /алкогол|залежн/i },
  { title: 'Харчова поведінка',    match: /харчов/i },
];

export const OTHER_SECTION = 'Інше';

// Which rules are checked first (independent of display order above)
const MATCH_ORDER = [
  'Депресія (діти)', 'Тривога (діти)', 'РДУГ (діти)', 'Аутизм', 'Аутизм (діти)', 'РДУГ', 'Біполярний розлад', 'Схема-терапія',
  'Психотичні розлади', 'Розлади особистості', 'ОКР', 'ПТСР', 'Панічні атаки', 'Тривога', 'Депресія',
  'Залежності', 'Харчова поведінка',
].map(title => TEST_SECTIONS.find(s => s.title === title)!);

export const sectionOf = (test: Test): string =>
  MATCH_ORDER.find(s => s.match.test(test.name ?? ''))?.title ?? OTHER_SECTION;

// What people type into Google for each section ("тест на РДУГ", "тест на депресію").
// Questionnaires and scales are named "Опитувальник…" / "Шкала…", so without this
// phrase their pages don't match a "тест на …" search.
const SECTION_SEARCH_PHRASES: Record<string, string> = {
  'Депресія':            'Тест на депресію',
  'Депресія (діти)':     'Тест на депресію у дітей',
  'Тривога':             'Тест на тривожність',
  'Тривога (діти)':      'Тест на тривожність у дітей',
  'ОКР':                 'Тест на ОКР',
  'ПТСР':                'Тест на ПТСР',
  'Панічні атаки':       'Тест на панічні атаки',
  'Біполярний розлад':   'Тест на біполярний розлад',
  'Розлади особистості': 'Тест на розлад особистості',
  'Психотичні розлади':  'Тест на психотичні розлади',
  'Схема-терапія':       'Тест на дезадаптивні схеми',
  'РДУГ':                'Тест на РДУГ',
  'РДУГ (діти)':         'Тест на РДУГ у дитини',
  'Аутизм':              'Тест на аутизм',
  'Аутизм (діти)':       'Тест на аутизм у дитини',
  'Залежності':          'Тест на залежність',
  'Харчова поведінка':   'Тест на розлад харчової поведінки',
};

// Scales people search by author: "тест Бека", "тести Гамільтона".
const EPONYM = /Бека|Гамільтона|Йеля-Брауна/;

/**
 * "Тест на …" phrase for a questionnaire or scale ("Тест Бека на депресію" for eponymous
 * scales); null when the name already says "Тест…".
 */
export const searchPhraseOf = (test: Test): string | null => {
  const name = test.name ?? '';
  const phrase = /^\s*тест/i.test(name) ? null : SECTION_SEARCH_PHRASES[sectionOf(test)] ?? null;
  const author = name.match(EPONYM)?.[0];
  return phrase && author ? phrase.replace(/^Тест/, `Тест ${author}`) : phrase;
};

// Which sections each /test/list/:type category page shows. `extra` pulls in single tests
// that live in another section but belong here too (HADS screens depression as well as anxiety).
export const CATEGORY_SECTIONS: Record<string, { sections: string[]; extra?: RegExp }> = {
  [TEST_CATEGORIES_CONST.DEPRESSION]:            { sections: ['Депресія', 'Депресія (діти)'], extra: /HADS/i },
  [TEST_CATEGORIES_CONST.ANXIETY]:               { sections: ['Тривога', 'Тривога (діти)', 'Панічні атаки', 'ОКР', 'ПТСР'] },
  [TEST_CATEGORIES_CONST.PERSONALITY_DISORDERS]: { sections: ['Розлади особистості', 'Психотичні розлади'] },
  [TEST_CATEGORIES_CONST.BEHAVIORAL_DISORDERS]:  { sections: ['РДУГ', 'РДУГ (діти)', 'Аутизм', 'Аутизм (діти)'] },
  [TEST_CATEGORIES_CONST.ADDICTIONS]:            { sections: ['Залежності', 'Харчова поведінка'] },
  [TEST_CATEGORIES_CONST.SPECIALIZED]:           { sections: ['Біполярний розлад', 'Схема-терапія', OTHER_SECTION] },
};

/** DOM id of a section heading on the tests list page (also used as a URL fragment). */
export const sectionAnchor = (title: string): string =>
  'tests-' + title.toLowerCase().replace(/[^a-zа-яіїєґ0-9]+/gi, '-');
