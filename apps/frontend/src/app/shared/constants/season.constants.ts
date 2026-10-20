/**
 * Seasonal decor switch. Autumn styling (warmer amber accents) turns itself
 * on for September–November and off again on 1 December — no deploy needed.
 * Set to `false` to switch it off early.
 */
const AUTUMN_ENABLED = true;

export const IS_AUTUMN = AUTUMN_ENABLED && [8, 9, 10].includes(new Date().getMonth());
