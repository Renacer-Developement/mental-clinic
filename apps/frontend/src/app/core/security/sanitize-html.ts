import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

const YOUTUBE_EMBED = /^https:\/\/(www\.)?youtube(-nocookie)?\.com\/embed\//i;

/**
 * Cleans rich-text HTML coming from the API (articles, contract) before it is
 * marked as trusted. Keeps what the editor produces (classes, data-*, svg and
 * YouTube embeds) but drops scripts, event handlers and javascript: URLs.
 *
 * DOMPurify needs a real browser DOM. The SSR DOM (domino) has no DOMParser and
 * DOMPurify silently returns '' there, so on the server we fall back to
 * Angular's stricter sanitizer; the browser re-renders with DOMPurify's
 * output when the page hydrates.
 */
export function sanitizeHtml(html: string, doc: Document, sanitizer: DomSanitizer): string {
  const view = doc.defaultView;
  const purify = view && 'DOMParser' in view ? DOMPurify(view) : null;
  if (!purify?.isSupported) {
    return sanitizer.sanitize(SecurityContext.HTML, html) ?? '';
  }
  // Iframes are only kept for YouTube embeds (the article page turns them into its own player)
  purify.addHook('uponSanitizeElement', (node, data) => {
    if (data.tagName === 'iframe' && !YOUTUBE_EMBED.test((node as Element).getAttribute('src') ?? '')) {
      node.parentNode?.removeChild(node);
    }
  });
  return purify.sanitize(html, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'target'],
  });
}
