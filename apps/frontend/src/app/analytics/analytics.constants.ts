/**
 * GA4 event name constants.
 *
 * Names follow GA4 conventions:
 *  - snake_case
 *  - recommended GA4 event names reused where applicable
 *    (https://support.google.com/analytics/answer/9267735)
 */
export const EVENT_TRACK = {
  // ── Navigation ──────────────────────────────────────────────────────────
  MENU_TOGGLE:    'menu_toggle',
  LOGO_CLICK:     'logo_click',
  NAV_CLICK:      'nav_click',
  CONTACTS_OPEN:  'contacts_open',

  // ── Content interaction ──────────────────────────────────────────────────
  /** GA4 recommended event for selecting a piece of content */
  SELECT_CONTENT: 'select_content',
  /** Alias kept for template compatibility */
  CARD_CLICK:     'select_content',
  CATEGORY_SELECT:'category_select',
  /** GA4 recommended event name */
  SEARCH:         'search',

  // ── Engagement ───────────────────────────────────────────────────────────
  BUTTON_CLICK:   'button_click',
  SOCIAL_CLICK:   'social_click',
  FOOTER_LINK:    'footer_link_click',
  TELEGRAM_OPEN:  'telegram_open',

  // ── Conversions ──────────────────────────────────────────────────────────
  /** GA4 recommended event — a booking contact (Telegram / Viber / phone). Mark as a key event in GA4. */
  GENERATE_LEAD:  'generate_lead',
  TEST_START:     'test_start',
  TEST_COMPLETE:  'test_complete',
} as const;

/** How the visitor reached the clinic, sent as `method` with generate_lead. */
export type LeadMethod = 'telegram' | 'viber' | 'phone';

export type EventTrack = typeof EVENT_TRACK[keyof typeof EVENT_TRACK];
