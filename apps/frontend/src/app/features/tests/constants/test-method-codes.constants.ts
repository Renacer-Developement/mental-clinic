// Standard abbreviations of the validated scales behind tests whose names don't
// mention them. People (and AI assistants) search for "PHQ-9", "BAI", "Y-BOCS"…,
// so the code goes into the page title, schema and FAQ. Only scales confirmed by
// name and item count are listed — leave a test out rather than guess.
export const TEST_METHOD_CODES: Record<string, string> = {
  '67a29865256728f75cf501b1': 'EPDS',    // Единбурзька шкала післяпологової депресії
  '67a39ce1588254b696a81c15': 'Y-BOCS',  // Шкала Йеля-Брауна
  '67a39e28588254b696a81c77': 'GDS-15',  // Шкала депресії у літніх людей (15 питань)
  '67a3a5a6588254b696a82155': 'BAI',     // Шкала тривоги Бека
  '67a3a81e588254b696a8244a': 'HAM-A',   // Шкала тривоги Гамільтона
  '67a3acda588254b696a82bae': 'SPIN',    // Шкала оцінки соціальної фобії (17 питань)
  '67a4eb9132c5847822b0137b': 'BDI-II',  // Шкала депресії Бека-II
  '67a5025d32c5847822b01f76': 'HAM-D',   // Шкала депресії Гамільтона
  '67a50daf32c5847822b0233e': 'EAT-26',  // Тест на харчову поведінку (26 питань)
  '67ec1d76af2388823db375ab': 'HCL-32',  // Опитувальник симптомів гіпоманії (32 питання)
};

/**
 * "Name (CODE)"; a name that already ends in a local abbreviation gets the code added
 * inside the same brackets — "…депресії (ЕШПД, EPDS)", not "(ЕШПД) (EPDS)".
 */
export const withMethodCode = (name: string, code: string | null): string =>
  !code ? name : /\)\s*$/.test(name) ? name.replace(/\)\s*$/, `, ${code})`) : `${name} (${code})`;

/** A Latin scale code the test name itself ends with: "…(HADS)", "… - GAD-7", "…(ASRS-v1.1)". */
export const codeInName = (name: string): string | null =>
  name.match(/(?:\(|\s-\s)([A-Z][A-Za-z0-9.-]*[A-Z0-9])\)?\s*$/)?.[1] ?? null;

/** The scale abbreviation for a test, unless its name already contains it. */
export const methodCodeOf = (id: string, name: string): string | null => {
  const code = TEST_METHOD_CODES[id];
  return code && !name.toUpperCase().includes(code) ? code : null;
};
