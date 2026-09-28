export const TEST_CATEGORIES_CONST = {
  ALL: '',
  ANXIETY: 'anxiety',
  DEPRESSION: 'depression',
  PERSONALITY_DISORDERS: 'personality-disorders',
  BEHAVIORAL_DISORDERS: 'behavioral-disorders',
  ADDICTIONS: 'addictions',
  SPECIALIZED: 'specialized'
};

export const testsCategories = [
  {name: 'Всі', value: ''},
  {name: 'Тривога', value: TEST_CATEGORIES_CONST.ANXIETY},
  {name: 'Депресія', value: TEST_CATEGORIES_CONST.DEPRESSION},
  {name: 'Особистісні розлади', value: TEST_CATEGORIES_CONST.PERSONALITY_DISORDERS},
  {name: 'Поведінкові розлади', value: TEST_CATEGORIES_CONST.BEHAVIORAL_DISORDERS},
  {name: 'Залежності', value: TEST_CATEGORIES_CONST.ADDICTIONS},
  {name: 'Спеціалізовані тести', value: TEST_CATEGORIES_CONST.SPECIALIZED}
];


// Display order for the tests list — most requested screenings first, so patients
// don't have to search or filter. Matched against the test name; tests that match
// nothing keep the API order after these.
export const TESTS_PRIORITY: RegExp[] = [
  /PHQ-9/i,                 // Депресія
  /GAD-7/i,                 // Тривога
  /ОКР|Йеля-Брауна/i,       // ОКР
  /післяпологов/i,          // Післяпологова депресія
  /ПТСР/i,                  // ПТСР
];
