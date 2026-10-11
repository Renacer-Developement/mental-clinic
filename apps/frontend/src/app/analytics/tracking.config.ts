/**
 * Third-party tracking IDs. An empty value means "not connected" — that tag is
 * simply skipped. None of these load until the visitor consents (see ConsentService):
 *  - analytics: GTM, Hotjar / Contentsquare, Plerdy
 *  - marketing: Google Ads, Meta, TikTok, LinkedIn, X pixels
 */
export const TRACKING_IDS = {
  /** GTM-XXXXXXX — tagmanager.google.com → container ID */
  gtm: '',
  /** Numeric site ID — Hotjar → Settings → Sites & Organizations */
  hotjar: '',
  /** Contentsquare tag ID (new Hotjar accounts) — the <ID> in t.contentsquare.net/uxa/<ID>.js */
  contentsquare: '432e7e74bb790',
  /** `_site_hash_code` and `_suid` from Plerdy → Settings → Tracking code */
  plerdy: { hash: '', suid: '' },

  /** AW-XXXXXXXXX — Google Ads → Tools → Conversions → Tag setup */
  googleAds: '',
  /** Pixel ID — Meta Events Manager → Data Sources */
  facebook: '',
  /** Pixel ID — TikTok Ads Manager → Assets → Events */
  tiktok: '',
  /** Partner ID — LinkedIn Campaign Manager → Analyze → Insight Tag */
  linkedin: '',
  /** Pixel ID — X Ads → Tools → Events Manager */
  twitter: '',
} as const;
