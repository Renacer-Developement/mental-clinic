import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './header.html',
    styles: [`
      /* ORCHID NOIR (indigo/cyan/violet, dark) */
      :host{
        --bg:#0e0f13; --layer:#11131a; --surface:#151927; --surface-2:#171d30;
        --ink:#f6f7fb; --muted:#b8c0d4; --line:#283048;
        --indigo:#6fa7ff; --cyan:#69e3ff; --vio:#a98bff; --danger:#ff6b7a;
        --ring:0 0 0 3px color-mix(in srgb, var(--indigo) 35%, transparent);
        --shadow-sm:0 10px 28px rgba(0,0,0,.35);
        --shadow-md:0 26px 70px rgba(0,0,0,.55);

        display:block; color:var(--ink);
      }

      /* NAVBAR */
      .orchid-nav{
        position: sticky; top: 0; z-index: 1030;
        background:
                linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02)),
                var(--layer);
        border-bottom:1px solid var(--line);
        backdrop-filter:saturate(120%) blur(10px);
        box-shadow: var(--shadow-sm);
      }
      .orchid-nav::after{
        content:""; position:absolute; left:0; right:0; bottom:-1px; height:3px;
        background: linear-gradient(90deg, var(--indigo), var(--cyan), var(--vio));
        opacity:.85; pointer-events:none;
      }

      .navbar-brand{
        display:inline-flex; align-items:center; gap:10px;
        padding:8px 12px; border-radius:14px;
        background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
        border:1px solid var(--line);
        color:var(--ink) !important; text-decoration:none; font-weight:900; letter-spacing:.2px;
        transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
      }
      .navbar-brand:hover{
        transform:translateY(-2px);
        border-color: color-mix(in srgb, var(--indigo) 35%, var(--line));
        box-shadow: var(--shadow-md);
      }

      /* Ensure space between brand and burger on mobile */
      .navbar{
        padding-block: 10px;
      }

      /* Pills (desktop links) */
      .pill-link{
        display:inline-flex; align-items:center; gap:8px;
        padding:8px 12px; border-radius:999px;
        background: transparent;
        border:1px solid var(--line);
        color:var(--ink) !important; text-decoration:none; font-weight:700; line-height:1;
        transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, color .18s ease, background .18s ease;
      }
      .pill-link:hover{
        transform: translateY(-2px);
        border-color: color-mix(in srgb, var(--indigo) 40%, var(--line));
        background: rgba(255,255,255,.06);
        box-shadow: var(--shadow-sm);
      }
      .nav-link.active{
        border-color: color-mix(in srgb, var(--indigo) 45%, var(--line));
        color: #fff !important;
        background: linear-gradient(180deg, rgba(111,167,255,.18), rgba(169,139,255,.08));
      }

      /* Toggler (burger) */
      .navbar-toggler{
        border:1px solid var(--line);
        border-radius:12px;
        padding:8px 10px;
        transition: box-shadow .18s ease, transform .18s ease, border-color .18s ease;
      }
      .navbar-toggler:focus { box-shadow: var(--ring); }
      .navbar-toggler:hover{
        transform: translateY(-1px);
        border-color: color-mix(in srgb, var(--indigo) 35%, var(--line));
      }
      /* Make the default bootstrap icon visible on dark */
      .navbar-dark .navbar-toggler-icon{
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(246,247,251, .9)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
      }

      /* Offcanvas (mobile menu) */
      .offcanvas.orchid-offcanvas{
        --bs-offcanvas-bg: transparent;
        background:
                linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02)),
                var(--layer) !important;
        color: var(--ink);
        border-left: 1px solid var(--line);
        backdrop-filter:saturate(120%) blur(10px);
      }
      .offcanvas-header{ border-bottom:1px solid var(--line); }
      .offcanvas-title{ color: var(--ink); }
      .btn-close{
        filter: invert(1) grayscale(1) brightness(1.6);
        opacity:.9;
      }

      .offcanvas .nav-link{
        color: var(--ink);
        border:1px solid var(--line);
        border-radius: 999px;
        margin-bottom:8px;
        text-align:center;
        padding:10px 12px;
        transition: transform .18s ease, border-color .18s ease, background .18s ease;
      }
      .offcanvas .nav-link:hover{
        transform: translateY(-2px);
        border-color: color-mix(in srgb, var(--indigo) 35%, var(--line));
        background: rgba(255,255,255,.06);
      }
      .offcanvas .nav-link.active{
        border-color: color-mix(in srgb, var(--indigo) 45%, var(--line));
        background: linear-gradient(180deg, rgba(111,167,255,.18), rgba(169,139,255,.08));
        color:#fff;
      }

      /* Desktop-only helpers */
      @media (min-width: 992px){
        .desktop-only{ display:inline-flex !important; }
      }
      @media (max-width: 991.98px){
        .desktop-only{ display:none !important; }
      }
      /* Always smaller */
      .navbar-brand.brand--sm{
        font-size: 14px;          /* tweak as you like */
        line-height: 1.1;
        padding: 6px 10px;        /* tighter pill */
        border-radius: 12px;
      }

      /* If you only want it smaller on mobile, use this instead: */
      @media (max-width: 991.98px){
        .navbar-brand.brand--sm{ font-size: 14px; padding: 6px 10px; }
      }

      /* Focus states */
      a:focus-visible, button:focus-visible { outline: none; box-shadow: var(--ring); border-radius: 12px; }
    `]
})
export class Header {}
