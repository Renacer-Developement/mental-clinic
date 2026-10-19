/**
 * Props for p-carousel's prev/next buttons. PrimeNG's AutoFocus directive only
 * removes the native `autofocus` attribute when the value is exactly `false`;
 * the carousel leaves it `undefined`, so SSR ships `autofocus` on the arrows and
 * the browser jumps to the carousel on load. Keeps PrimeNG's defaults otherwise.
 */
export const CAROUSEL_NAV_BUTTON_PROPS = {
  severity: 'secondary',
  text: true,
  rounded: true,
  autofocus: false,
} as const;
