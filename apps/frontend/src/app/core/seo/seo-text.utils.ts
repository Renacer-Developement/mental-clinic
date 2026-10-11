const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

/** `main` plus the longest suffix that still fits in ~60 chars (Google truncates longer titles). */
export const fitTitle = (main: string, ...suffixes: string[]): string =>
  suffixes.map(s => main + s).find(t => t.length <= TITLE_MAX) ?? main;

/** Joins sentences until the next one would push the description past ~160 chars. */
export const fitDescription = (...parts: (string | undefined | null)[]): string => {
  let out = '';
  for (const raw of parts) {
    const part = raw?.replace(/\s+/g, ' ').trim();
    if (!part) continue;
    const next = out ? `${out} ${part}` : part;
    if (next.length > DESCRIPTION_MAX) {
      if (!out) return part.slice(0, DESCRIPTION_MAX - 1).replace(/\s+\S*$/, '') + '…';
      break;
    }
    out = next;
  }
  return out;
};
