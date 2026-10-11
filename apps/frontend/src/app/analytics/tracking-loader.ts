import { TRACKING_IDS as ID } from './tracking.config';

// Vendor snippets, ported from each provider's official install code. Browser-only;
// every loader runs at most once per page load.

/* eslint-disable @typescript-eslint/no-explicit-any, prefer-rest-params */
const w = () => window as any;

const loaded = new Set<string>();
const once = (key: string, fn: () => void) => {
  if (loaded.has(key)) return;
  loaded.add(key);
  fn();
};

const loadScript = (src: string) => {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
};

export function loadAnalyticsTags(): void {
  if (ID.gtm) once('gtm', () => {
    w().dataLayer = w().dataLayer || [];
    w().dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    loadScript(`https://www.googletagmanager.com/gtm.js?id=${ID.gtm}`);
  });

  if (ID.hotjar) once('hotjar', () => {
    const win = w();
    win.hj = win.hj || function () { (win.hj.q = win.hj.q || []).push(arguments); };
    win._hjSettings = { hjid: Number(ID.hotjar), hjsv: 6 };
    loadScript(`https://static.hotjar.com/c/hotjar-${ID.hotjar}.js?sv=6`);
  });

  if (ID.contentsquare) once('contentsquare', () => {
    loadScript(`https://t.contentsquare.net/uxa/${ID.contentsquare}.js`);
  });

  if (ID.plerdy.hash) once('plerdy', () => {
    w()._site_hash_code = ID.plerdy.hash;
    w()._suid = Number(ID.plerdy.suid);
    const s = document.createElement('script');
    s.defer = true;
    s.dataset['plerdymainscript'] = 'plerdymainscript';
    s.src = `https://a.plerdy.com/public/js/click/main.js?v=${Math.random()}`;
    document.head.appendChild(s);
  });
}

export function loadMarketingTags(): void {
  // gtag itself is already on the page (GA4 in index.html), so Ads is just another config.
  if (ID.googleAds) once('googleAds', () => w().gtag?.('config', ID.googleAds));

  if (ID.facebook) once('facebook', () => {
    const win = w();
    const n: any = (win.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!win._fbq) win._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    loadScript('https://connect.facebook.net/en_US/fbevents.js');
    win.fbq('init', ID.facebook);
    win.fbq('track', 'PageView');
  });

  if (ID.tiktok) once('tiktok', () => {
    const win = w();
    win.TiktokAnalyticsObject = 'ttq';
    const ttq: any = (win.ttq = win.ttq || []);
    ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready',
      'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent'];
    ttq.setAndDefer = (t: any, e: string) => {
      t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); };
    };
    ttq.methods.forEach((m: string) => ttq.setAndDefer(ttq, m));
    ttq.instance = (t: string) => {
      const e = ttq._i[t] || [];
      ttq.methods.forEach((m: string) => ttq.setAndDefer(e, m));
      return e;
    };
    const src = 'https://analytics.tiktok.com/i18n/pixel/events.js';
    ttq._i = ttq._i || {};
    ttq._i[ID.tiktok] = [];
    ttq._i[ID.tiktok]._u = src;
    ttq._t = ttq._t || {};
    ttq._t[ID.tiktok] = Date.now();
    ttq._o = ttq._o || {};
    ttq._o[ID.tiktok] = {};
    loadScript(`${src}?sdkid=${ID.tiktok}&lib=ttq`);
    ttq.page();
  });

  if (ID.linkedin) once('linkedin', () => {
    const win = w();
    win._linkedin_partner_id = ID.linkedin;
    win._linkedin_data_partner_ids = win._linkedin_data_partner_ids || [];
    win._linkedin_data_partner_ids.push(ID.linkedin);
    if (!win.lintrk) {
      win.lintrk = (a: unknown, b: unknown) => win.lintrk.q.push([a, b]);
      win.lintrk.q = [];
    }
    loadScript('https://snap.licdn.com/li.lms-analytics/insight.min.js');
  });

  if (ID.twitter) once('twitter', () => {
    const win = w();
    if (!win.twq) {
      const s: any = (win.twq = function () {
        s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
      });
      s.version = '1.1';
      s.queue = [];
      loadScript('https://static.ads-twitter.com/uwt.js');
    }
    win.twq('config', ID.twitter);
  });
}

/** SPA navigations don't reload the page, so tags that count page views need a nudge. */
export function trackVirtualPageView(url: string): void {
  const win = w();
  if (loaded.has('hotjar')) win.hj?.('stateChange', url);
  // Contentsquare counts SPA route changes only when given an explicit page view.
  if (loaded.has('contentsquare')) (win._uxa = win._uxa || []).push(['trackPageview', url]);
  if (loaded.has('facebook')) win.fbq?.('track', 'PageView');
  if (loaded.has('tiktok')) win.ttq?.page();
}
