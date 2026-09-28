import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './footer.html',
    styles: [`
      /* ORCHID NOIR (indigo/cyan/violet, dark) */
      :host{
        --bg:#0e0f13; --layer:#11131a; --surface:#151927; --surface-2:#171d30;
        --ink:#f6f7fb; --muted:#b8c0d4; --line:#283048;
        --indigo:#6fa7ff; --cyan:#69e3ff; --vio:#a98bff; --danger:#ff6b7a;
        --ring:0 0 0 3px color-mix(in srgb, var(--indigo) 35%, transparent);
        --shadow-sm:0 10px 28px rgba(0,0,0,.35); --shadow-md:0 26px 70px rgba(0,0,0,.55);
        color:var(--ink);
        background:
                radial-gradient(80vw 60vh at 10% -10%, rgba(105,227,255,.10), transparent 60%),
                radial-gradient(60vw 50vh at 120% 120%, rgba(169,139,255,.12), transparent 65%),
                var(--bg);
        display:block; font-family:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
        -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; accent-color:var(--indigo);
      }

      .orchid-footer{
        background:
                linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02)),
                var(--layer);
        border-top:1px solid var(--line);
        position:relative;
      }
      /* top neon line */
      .orchid-footer::before{
        content:""; position:absolute; inset:0 0 auto 0; height:3px;
        background: linear-gradient(90deg, var(--indigo), var(--cyan), var(--vio));
        opacity:.85; pointer-events:none;
      }

      .wrap{
        max-width:1120px; margin:0 auto; padding:16px 20px;
        display:flex; align-items:center; justify-content:space-between; gap:16px;
      }

      .left{ display:flex; align-items:center; gap:12px; min-width:0; }
      .logo{
        width:38px; height:38px; border-radius:12px;
        display:grid; place-items:center;
        font-weight:800; font-size:12px; letter-spacing:.5px; color:#0e0f13;
        background: linear-gradient(135deg, var(--cyan), var(--indigo) 55%, var(--vio));
        border:1px solid color-mix(in srgb, var(--indigo) 45%, var(--line));
        box-shadow: 0 10px 26px rgba(111,167,255,.28);
        user-select:none;
      }
      .meta{ display:grid; }
      .meta .muted{ color:var(--muted); }

      .right{
        display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end;
      }

      /* pill links */
      .pill-link{
        display:inline-flex; align-items:center; gap:8px;
        padding:9px 14px; border-radius:999px;
        background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
        border:1px solid var(--line);
        color:var(--ink); text-decoration:none; font-weight:700; line-height:1;
        box-shadow: var(--shadow-sm);
        transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, color .18s ease, background .18s ease;
      }
      .pill-link:hover{
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: color-mix(in srgb, var(--indigo) 40%, var(--line));
        background:
                linear-gradient(135deg, rgba(111,167,255,.25), rgba(105,227,255,.18) 60%, rgba(169,139,255,.22));
        color:#ffffff;
      }
      .pill-link:focus-visible{ outline:none; box-shadow: var(--ring); }

      /* responsive */
      @media (max-width: 720px){
        .wrap{ flex-direction:column; align-items:stretch; text-align:center; }
        .right{ justify-content:center; }
        .left{ justify-content:center; }
      }
    `]
})
export class Footer {
    year = new Date().getFullYear();
}
