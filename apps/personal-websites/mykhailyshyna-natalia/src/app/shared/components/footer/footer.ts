import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './footer.html',
    styles: [`
    /* ---- Рожево-біла тема з fallback, якщо змінні не винесені глобально ---- */
    :host {
      --surface: var(--surface, #ffffff);
      --line:    var(--line, #f2e7ef);
      --ink:     var(--ink, #2b2433);
      --muted:   var(--muted, #7f7187);
      --brand:   var(--brand, #e94b8e);
      --brand-2: var(--brand-2, #ff7bbd);
      --ring:    0 0 0 3px color-mix(in srgb, var(--brand) 35%, transparent);
      display: block;
      color: var(--ink);
    }

    .footer {
      background: var(--surface);
      border-top: 1px solid var(--line);
      position: relative;
    }
    /* тонка градієнтна лінія зверху */
    .footer::before {
      content: "";
      position: absolute;
      inset: 0 0 auto 0;
      height: 3px;
      background: linear-gradient(90deg, var(--brand), var(--brand-2));
      opacity: .6;
      pointer-events: none;
    }

    .wrap {
      max-width: 1080px;
      margin: 0 auto;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .left { display: flex; align-items: center; gap: 12px; min-width: 0; }
    .logo {
      width: 36px; height: 36px; border-radius: 999px;
      display: grid; place-items: center;
      font-weight: 700; font-size: 12px; letter-spacing: .5px; color: #fff;
      background: linear-gradient(180deg, var(--brand-2), var(--brand));
      border: 1px solid color-mix(in srgb, var(--brand) 45%, var(--line));
      box-shadow: 0 2px 8px rgba(46,15,30,.10);
      user-select: none;
    }
    .meta { display: grid; }
    .meta .muted { color: var(--muted); }

    .right {
      display: flex; gap: 10px; flex-wrap: wrap;
      justify-content: flex-end;
    }

    /* посилання-«пігулки» у стилі сайту */
    .pill-link {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 12px; border-radius: 999px;
      background: var(--surface);
      border: 1px solid var(--line);
      color: var(--ink); text-decoration: none; font-weight: 600; line-height: 1;
      box-shadow: 0 2px 8px rgba(46,15,30,.06);
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, color .18s ease;
    }
    .pill-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 24px rgba(46,15,30,.12);
      border-color: color-mix(in srgb, var(--brand) 35%, var(--line));
      color: color-mix(in srgb, var(--ink) 85%, var(--brand-2));
    }
    .pill-link:focus-visible {
      outline: none; box-shadow: var(--ring);
    }

    /* адаптив */
    @media (max-width: 700px) {
      .wrap {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
      }
      .right { justify-content: center; }
      .left { justify-content: center; }
    }
  `]
})
export class Footer {
    year = new Date().getFullYear();
}
