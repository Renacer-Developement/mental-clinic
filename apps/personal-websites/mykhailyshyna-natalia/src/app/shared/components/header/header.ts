import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './header.html',
    styles: [`
      /* Рожево-біла тема з fallback (якщо змінні не винесені глобально) */
      :host{
        --surface: var(--surface, #ffffff);
        --bg:      var(--bg, #fff8fb);
        --ink:     var(--ink, #2b2433);
        --muted:   var(--muted, #7f7187);
        --line:    var(--line, #f2e7ef);
        --brand:   var(--brand, #e94b8e);
        --brand-2: var(--brand-2, #ff7bbd);
        --ring:    0 0 0 3px color-mix(in srgb, var(--brand) 35%, transparent);
        color: var(--ink);
        display: block;
      }

      /* NAVBAR */
      .rose-nav{
        background: var(--surface) !important;
        border-bottom: 1px solid var(--line);
        position: sticky; top: 0; z-index: 1030;
        box-shadow: 0 8px 28px rgba(46,15,30,.06);
      }
      /* тонка градієнтна смужка внизу */
      .rose-nav::after{
        content:""; position:absolute; left:0; right:0; bottom:-1px; height:3px;
        background: linear-gradient(90deg, var(--brand), var(--brand-2));
        opacity:.6; pointer-events:none;
      }

      .rose-brand{
        padding: 8px 12px;
        border-radius: 12px;
        background: var(--surface);
        border: 1px solid var(--line);
        box-shadow: 0 2px 8px rgba(46,15,30,.06);
        color: var(--ink);
        text-decoration: none;
        transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
      }
      .rose-brand:hover{
        transform: translateY(-2px);
        box-shadow: 0 10px 24px rgba(46,15,30,.12);
        border-color: color-mix(in srgb, var(--brand) 35%, var(--line));
      }

      /* Пігулки-лінки */
      .pill-link{
        display:inline-flex; align-items:center;
        padding: 8px 12px;
        border-radius: 999px;
        background: var(--surface);
        border: 1px solid var(--line);
        color: var(--ink);
        text-decoration: none;
        font-weight: 600; line-height: 1;
        transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, color .18s ease;
      }
      .pill-link:hover{
        transform: translateY(-2px);
        box-shadow: 0 10px 24px rgba(46,15,30,.12);
        border-color: color-mix(in srgb, var(--brand) 35%, var(--line));
        color: color-mix(in srgb, var(--ink) 85%, var(--brand-2));
      }
      .nav-link.active{
        border-color: color-mix(in srgb, var(--brand) 45%, var(--line));
        color: color-mix(in srgb, var(--ink) 75%, var(--brand));
      }

      /* Toggler */
      .rose-toggler{ border-color: var(--line); }
      .rose-toggler:focus { box-shadow: var(--ring); }

      /* Offcanvas */
      .rose-offcanvas{
        --bs-offcanvas-bg: #fff;      /* works with Bootstrap 5 vars */
        background-color: #fff !important; /* hard fallback */
      }
      .rose-offcanvas .offcanvas-header{ border-bottom: 1px solid var(--line); }
      .rose-offcanvas .nav-link{ color: var(--ink); }
      .rose-offcanvas .nav-link.active{
        border: 1px solid color-mix(in srgb, var(--brand) 35%, var(--line));
        border-radius: 999px;
      }

      /* Адаптив */
      @media (max-width: 991.98px){
        .brand-small { font-size: small; }
      }
      @media (max-width: 700px){
        .navbar-nav { gap: 8px; }
      }

      /* Фокусні стани */
      a:focus-visible, button:focus-visible { outline: none; box-shadow: var(--ring); border-radius: 12px; }
    `]
})
export class Header {}
