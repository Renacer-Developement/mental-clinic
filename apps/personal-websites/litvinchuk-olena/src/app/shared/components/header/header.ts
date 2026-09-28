import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './header.html',
    styles: [`
    /* Ті самі змінні теми, що й на головній */
    .neon-nav{
      --bg:#0b0f14; --surface:#101825; --panel:#0f1420;
      --ink:#f1f5f9; --muted:#9fb0c7; --line:rgba(255,255,255,.08);
      --accent:#7c5cff; --accent-2:#00e3a2;

      background:
        radial-gradient(900px 300px at 110% -100px, rgba(124,92,255,.18), transparent 60%),
        radial-gradient(800px 340px at -120px 10%, rgba(0,227,162,.12), transparent 60%),
        linear-gradient(180deg, #0d1421, #0b0f14);
      color:var(--ink);
      border-bottom:1px solid var(--line);
      box-shadow: 0 12px 40px rgba(0,0,0,.35);
    }
    .neon-nav .container{ padding-block: .5rem; }

    /* Бренд із делікатним shimmer */
    .shimmer-brand{
      background: linear-gradient(90deg,#fff 0%,#c8c3ff 35%,#7c5cff 55%,#c8c3ff 75%,#fff 100%);
      -webkit-background-clip:text; background-clip:text; color:transparent;
      background-size: 200% 100%;
      animation: shimmer 6s linear infinite;
      text-decoration: none;
    }
    @keyframes shimmer { to{ background-position: -200% 0; } }

    /* Розмір бренду на мобільних */
    @media (max-width: 991.98px){ .brand-small{ font-size: small; } }

    /* Лінки навігації */
    .nav-link{
      color:var(--muted);
      position:relative;
      transition: color .18s ease;
    }
    .nav-link:hover{ color:#e7ecf4; }
    .nav-link.active{
      color:#fff;
      font-weight:600;
    }
    /* Неонова «лінія» знизу при hover/active */
    .nav-link::after{
      content:""; position:absolute; left:0; right:0; bottom:-6px; height:2px;
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
      transform: scaleX(0); transform-origin:left; transition: transform .22s ease;
      border-radius:2px;
    }
    .nav-link:hover::after, .nav-link.active::after{ transform: scaleX(1); }

    /* Тоглер на темному фоні */
    .navbar-toggler{
      border-color: var(--line);
      box-shadow:none !important;
    }
    .navbar-toggler:focus{ outline:none; box-shadow: 0 0 0 .2rem rgba(124,92,255,.35) !important; }

    /* OFFCANVAS (мобільне меню) у неон-стилі */
    .neon-canvas{
      --bs-offcanvas-bg: var(--panel);
      --bs-offcanvas-color: var(--ink);
      border-left:1px solid var(--line);
      box-shadow: 0 0 0 1px rgba(124,92,255,.25), 0 20px 60px rgba(0,0,0,.45);
      backdrop-filter: saturate(120%) blur(6px);
    }
    .neon-canvas .offcanvas-header{
      border-bottom:1px solid var(--line);
      background: linear-gradient(180deg, rgba(124,92,255,.08), rgba(124,92,255,.02));
    }
    .neon-canvas .offcanvas-title{
      background: linear-gradient(90deg,#fff 0%,#bdb9ff 35%,#7c5cff 60%,#fff 100%);
      -webkit-background-clip:text; background-clip:text; color:transparent;
    }
    .neon-canvas .nav-link{
      padding:.5rem 0;
      color:#dbe3ee;
    }
    .neon-canvas .nav-link.active{ color:#fff; }
    .neon-canvas .nav-link:hover{ color:#ffffff; }

    /* Трохи щільніше на великих екранах */
    @media (min-width: 992px){
      .navbar-nav .nav-link{ padding-right:.75rem; padding-left:.75rem; }
    }
  `]
})
export class Header {}
