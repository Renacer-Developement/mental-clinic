import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './footer.html',
    styles: [`
    /* Ті самі кольори/акценти, що й у хедері */
    .neon-footer{
      --bg:#0b0f14; --panel:#0f1420; --ink:#f1f5f9; --muted:#9fb0c7;
      --line:rgba(255,255,255,.08); --accent:#7c5cff; --accent2:#00e3a2;

      position: relative;
      color: var(--ink);
      background:
        radial-gradient(700px 260px at 110% -60px, rgba(124,92,255,.16), transparent 60%),
        radial-gradient(700px 260px at -100px 30%, rgba(0,227,162,.10), transparent 60%),
        linear-gradient(180deg, #0d1421, #0b0f14);
      border-top: 1px solid var(--line);
      box-shadow: 0 -10px 30px rgba(0,0,0,.35);
    }

    /* Неонова смужка зверху */
    .neon-footer::before{
      content:"";
      position:absolute; left:0; right:0; top:0; height:2px;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      opacity:.8;
    }

    .wrap{
      max-width:1100px; margin:0 auto; padding:18px 16px;
      display:flex; align-items:center; justify-content:space-between; gap:16px;
    }

    .left{ display:flex; flex-direction:column; gap:4px; }
    .brand{
      font-weight:700; letter-spacing:.2px;
      background: linear-gradient(90deg,#fff 0%,#c8c3ff 35%,#7c5cff 55%,#c8c3ff 75%,#fff 100%);
      -webkit-background-clip:text; background-clip:text; color:transparent;
      background-size:200% 100%; animation: shimmer 8s linear infinite;
    }
    @keyframes shimmer { to{ background-position: -200% 0; } }

    .copy{ font-size:.9375rem; }
    .muted{ color: var(--muted); }

    .links{ display:flex; align-items:center; gap:16px; }
    .link{
      color:#e7ecf4; text-decoration:none; position:relative; padding-bottom:2px;
    }
    .link::after{
      content:""; position:absolute; left:0; right:0; bottom:0; height:2px;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      transform: scaleX(0); transform-origin:left; transition: transform .22s ease;
      border-radius:2px;
    }
    .link:hover::after, .link:focus-visible::after{ transform: scaleX(1); }
    .link:focus-visible{ outline:none; box-shadow:0 0 0 .2rem rgba(124,92,255,.35); border-radius:4px; }

    /* Мобільна адаптація */
    @media (max-width: 720px){
      .wrap{ flex-direction:column; align-items:flex-start; padding:16px; }
      .links{ width:100%; justify-content:flex-start; }
    }

    /* Для світлої теми браузера, якщо застосовується data-bs-theme="light" вище */
    :host-context([data-bs-theme="light"]) .neon-footer{
      color:#10131a;
      background:#0f1420; /* лишаємо темний футер, щоб не «сварився» з неоном */
    }

    /* Принт */
    @media print{
      .neon-footer{ background:#fff; color:#000; box-shadow:none; }
      .neon-footer::before{ display:none; }
      .brand{ color:#000; -webkit-text-fill-color: initial; background:none; animation:none; }
      .link::after{ display:none; }
    }
  `]
})
export class Footer {
    year = new Date().getFullYear();
}
