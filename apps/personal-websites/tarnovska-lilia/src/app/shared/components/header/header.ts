import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './header.html',
    styles: [`
      /* ORCHID NOIR tokens (fallbacks if not global) */
      :host{
        --bg:#0f0f18; --layer:#131320; --surface:#161627; --ink:#f0f0ff;
        --muted:#b5b6c9; --line:#2a2a3e;
        --orchid:#9b5cff; --orchid-2:#7e44ef; --iris:#c6b6ff;

        --ring:0 0 0 3px color-mix(in srgb, var(--orchid) 36%, transparent);
        --shadow-sm:0 8px 24px rgba(0,0,0,.35);
        --shadow-md:0 20px 60px rgba(0,0,0,.55);

        color:var(--ink); display:block; position:relative; z-index:60;
        font-family:"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", sans-serif;
      }

      /* NAV (renamed to avoid Bootstrap .nav clashes) */
      .orchid-nav{
        position:sticky; top:0; left:0; right:0;
        background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02)), var(--layer);
        border-bottom:1px solid var(--line);
        backdrop-filter:saturate(120%) blur(8px);
        box-shadow: var(--shadow-sm);
      }
      .orchid-nav::after{
        content:""; position:absolute; left:0; right:0; bottom:-1px; height:3px;
        background: linear-gradient(90deg, var(--orchid), color-mix(in srgb, var(--orchid-2) 80%, #fff));
        opacity:.7; pointer-events:none;
      }

      /* Desktop: 3 columns — brand | links | cta+toggle */
      .orchid-nav__inner{
        max-width:1140px; margin:0 auto; padding:10px 20px;
        display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:16px;
      }

      /* Brand */
      .brand{
        display:inline-flex; align-items:center; gap:10px;
        padding:8px 12px; border-radius:14px;
        background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
        border:1px solid var(--line);
        text-decoration:none; color:var(--ink); font-weight:900; letter-spacing:.2px;
        transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
        white-space:nowrap;
      }
      .brand__dot{
        width:10px; height:10px; border-radius:3px; display:inline-block;
        background: var(--orchid);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--orchid) 28%, transparent);
      }
      .brand:hover{ transform:translateY(-2px); border-color: color-mix(in srgb, var(--orchid) 35%, var(--line)); box-shadow: var(--shadow-md); }

      /* Center links (desktop only) */
      .links{
        display:flex; justify-content:center; gap:8px; flex-wrap:wrap;
      }
      .pill{
        display:inline-flex; align-items:center; gap:8px;
        padding:8px 12px; border-radius:999px; background:transparent;
        border:1px solid var(--line); color:var(--ink); text-decoration:none; font-weight:700; line-height:1;
        transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, color .18s ease, background .18s ease;
      }
      .pill:hover{ transform: translateY(-2px); border-color: color-mix(in srgb, var(--orchid) 35%, var(--line)); box-shadow: var(--shadow-sm); background: rgba(255,255,255,.05); }
      .pill.active, .pill[aria-current="page"]{ border-color: color-mix(in srgb, var(--orchid) 45%, var(--line)); background: linear-gradient(180deg, rgba(155,92,255,.18), rgba(155,92,255,.06)); }

      /* Right: CTA + toggle */
      .cta{ display:flex; align-items:center; gap:8px; }
      .btn{ display:inline-flex; align-items:center; gap:8px; padding:10px 14px; border-radius:12px; font-weight:800; line-height:1; border:2px solid transparent; text-decoration:none;
        transition:transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease, color .18s ease; will-change:transform; box-shadow: var(--shadow-sm); color:#0f0f18; }
      .btn--primary{ background:var(--orchid); border-color: color-mix(in srgb, var(--orchid) 65%, #fff); }
      .btn--primary:hover{ transform:translateY(-2px); background:var(--orchid-2); border-color:var(--orchid-2); }

      .desktop-only{ display:inline-flex; } /* default visible on desktop */

      .toggle{
        display:none; appearance:none; background:transparent; color:var(--ink);
        border:1px solid var(--line); border-radius:12px; padding:8px 10px; font-weight:800;
        transition: box-shadow .18s ease, transform .18s ease, border-color .18s ease;
      }
      .toggle:focus-visible{ outline:none; box-shadow: var(--ring); }
      .toggle:hover{ transform: translateY(-1px); border-color: color-mix(in srgb, var(--orchid) 35%, var(--line)); }

      /* Mobile panel (animated) */
      .panel{
        display:none; /* hidden on desktop entirely */
        border-top:1px solid var(--line);
        background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02)), var(--layer);
        backdrop-filter: saturate(120%) blur(8px);
        overflow:hidden; max-height:0; opacity:0; pointer-events:none;
        transition:max-height .3s ease, opacity .25s ease;
      }
      .panel__inner{ max-width:1140px; margin:0 auto; padding:10px 20px; display:grid; gap:10px; }
      .panel .pill{ width:100%; justify-content:center; }
      .panel.is-open{ max-height:320px; opacity:1; pointer-events:auto; }

      /* A11y focus */
      a:focus-visible, button:focus-visible { outline: none; box-shadow: var(--ring); }

      /* MOBILE — hide center links & desktop-only button; space-between layout */
      @media (max-width: 980px){
        /* switch to flex for neat spacing between brand and burger */
        .orchid-nav__inner{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
        }

        .orchid-nav .links{ display:none !important; }  /* fully hidden on mobile */
        .desktop-only{ display:none !important; }       /* hide desktop-only button */
        .toggle{ display:inline-block; margin-left:12px; }
        .cta{ margin-left:auto; display:flex; align-items:center; gap:8px; }

        .orchid-nav .panel{ display:block; }            /* enable collapsible region */
        .brand{ flex-shrink:0; }
      }
    `]
})
export class Header {
    isOpen = false;

    toggle() { this.isOpen = !this.isOpen; }
    close()  { this.isOpen = false; }

    @HostListener('window:resize')
    onResize() {
        if (window.innerWidth > 980 && this.isOpen) this.isOpen = false;
    }
}
