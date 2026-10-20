import { Injectable, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';

/**
 * The router scrolls to the top on every navigation (scrollPositionRestoration: 'top').
 * Some navigations — switching category tabs — should leave the page where it is, and
 * undoing the jump afterwards flickers on phones. This lets a caller skip the router's
 * very next scroll-to-position instead, so the page never moves at all.
 */
@Injectable({ providedIn: 'root' })
export class ScrollKeeper {
  private skip = false;
  private anchor?: { header: number; pastAnchor: boolean };
  private reset?: ReturnType<typeof setTimeout>;

  constructor() {
    const scroller = inject(ViewportScroller);
    const scrollToPosition = scroller.scrollToPosition.bind(scroller);
    scroller.scrollToPosition = (...args: Parameters<ViewportScroller['scrollToPosition']>) => {
      if (this.skip) {
        this.skip = false;
        return;
      }
      scrollToPosition(...args);
    };
  }

  /**
   * Call right before a navigation that should keep the current scroll position.
   * The optional anchor note survives the route swapping the component instance
   * (e.g. /test/list → /test/list/:type), so the new page can line itself up.
   */
  keepNextPosition(anchor?: { header: number; pastAnchor: boolean }): void {
    this.skip = true;
    this.anchor = anchor;
    // If no navigation follows (e.g. the tab was already active), don't let the flag
    // swallow the scroll of some later, unrelated navigation.
    clearTimeout(this.reset);
    this.reset = setTimeout(() => {
      this.skip = false;
      this.anchor = undefined;
    }, 1000);
  }

  /** The anchor note from keepNextPosition(), handed out once. */
  takeAnchor(): { header: number; pastAnchor: boolean } | undefined {
    const anchor = this.anchor;
    this.anchor = undefined;
    return anchor;
  }
}
