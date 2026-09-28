import { Test } from '../models/test.model';
import { TEST_CATEGORIES_CONST } from './test-categories.constants';

// Sections of the tests list, in display order. A test goes to the first section
// whose pattern matches its name — so more specific rules come first
// (e.g. "РДУГ у дитини" before "РДУГ", HADS before plain "депресія").
export const TEST_SECTIONS: { title: string; match: RegExp }[] = [
  { title: 'Депресія',             match: /депрес/i },
  { title: 'Тривога',              match: /тривог|фобі/i },
  { title: 'ОКР',                  match: /ОКР|Йеля-Брауна/i },
  { title: 'ПТСР',                 match: /ПТСР/i },
  { title: 'Паніка',               match: /панічн/i },
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
  'РДУГ (діти)', 'Аутизм', 'Аутизм (діти)', 'РДУГ', 'Біполярний розлад', 'Схема-терапія',
  'Психотичні розлади', 'Розлади особистості', 'ОКР', 'ПТСР', 'Паніка', 'Тривога', 'Депресія',
  'Залежності', 'Харчова поведінка',
].map(title => TEST_SECTIONS.find(s => s.title === title)!);

export const sectionOf = (test: Test): string =>
  MATCH_ORDER.find(s => s.match.test(test.name ?? ''))?.title ?? OTHER_SECTION;

// Old category links (/test/list/depression …, e.g. from the landing page) scroll to a section
export const SECTION_BY_TYPE: Record<string, string> = {
  [TEST_CATEGORIES_CONST.DEPRESSION]: 'Депресія',
  [TEST_CATEGORIES_CONST.ANXIETY]: 'Тривога',
  [TEST_CATEGORIES_CONST.PERSONALITY_DISORDERS]: 'Розлади особистості',
  [TEST_CATEGORIES_CONST.BEHAVIORAL_DISORDERS]: 'РДУГ',
  [TEST_CATEGORIES_CONST.ADDICTIONS]: 'Залежності',
};
