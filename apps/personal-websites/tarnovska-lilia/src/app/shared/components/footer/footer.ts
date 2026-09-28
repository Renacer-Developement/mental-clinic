import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './footer.html',
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

      .footer{
        position: relative;
        background:
                linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02)),
                var(--layer);
        border-top:1px solid var(--line);
        backdrop-filter:saturate(120%) blur(8px);
        box-shadow: var(--shadow-sm) inset 0 1px 0 rgba(255,255,255,.02);
        color: var(--ink);
      }

      /* thin gradient bar on top, matching header underline */
      .footer::before{
        content:""; position:absolute; inset:0 0 auto 0; height:3px;
        background: linear-gradient(90deg, var(--orchid), color-mix(in srgb, var(--orchid-2) 80%, #fff));
        opacity:.7; pointer-events:none;
      }

      .wrap{
        max-width:1140px;
        margin:0 auto;
        padding:16px 20px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:16px;
      }

      .left{ display:flex; align-items:center; gap:12px; min-width:0; }
      .logo{
        width:36px; height:36px; border-radius:12px;
        display:grid; place-items:center;
        font-weight:900; font-size:12px; letter-spacing:.5px; color:#0f0f18;
        background: linear-gradient(135deg, var(--orchid), var(--orchid-2));
        border:1px solid color-mix(in srgb, var(--orchid) 45%, var(--line));
        box-shadow: 0 6px 20px rgba(155,92,255,.28);
        user-select:none;
      }

      .meta{ display:grid; }
      .meta .muted{ color: var(--muted); }

      .right{
        display:flex; gap:10px; flex-wrap:wrap;
        justify-content:flex-end;
      }

      /* pill links in Orchid Noir */
      .pill-link{
        display:inline-flex; align-items:center; gap:8px;
        padding:8px 12px; border-radius:999px;
        background: transparent;
        border:1px solid var(--line);
        color: var(--ink);
        text-decoration:none; font-weight:700; line-height:1;
        transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, color .18s ease, background .18s ease;
      }
      .pill-link:hover{
        transform: translateY(-2px);
        border-color: color-mix(in srgb, var(--orchid) 35%, var(--line));
        background: rgba(255,255,255,.05);
        box-shadow: var(--shadow-sm);
        color: var(--ink);
      }
      .pill-link:focus-visible{ outline:none; box-shadow: var(--ring); }

      /* responsive */
      @media (max-width: 700px){
        .wrap{ flex-direction:column; align-items:stretch; text-align:center; gap:12px; }
        .left{ justify-content:center; }
        .right{ justify-content:center; }
      }
    `]
})
export class Footer{
    year = new Date().getFullYear();
}
