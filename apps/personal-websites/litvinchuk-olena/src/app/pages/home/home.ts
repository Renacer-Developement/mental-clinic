import { Component, AfterViewInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink],
    template: `
        <section class="hero" (mousemove)="onMouseMove($event)">
            <div class="container hero__inner" data-animate style="--delay:.05s">
                <div class="hero__text">
                    <span class="kicker" data-animate style="--delay:.06s">Інформаційні роз’яснення</span>
                    <h1 class="hero__title shimmer" data-animate style="--delay:.12s">
                        Зрозумій свій стан. Без діагнозів і рецептів.
                    </h1>
                    <p class="hero__lead" data-animate style="--delay:.18s">
                        Онлайн-роз’яснення від <strong>Літвінчук Олени</strong> —
                        про тривогу, панічні атаки, депресивні прояви, сон і стрес.
                        <br><u>Це не медична послуга</u> і <u>не замінює</u> очний прийом лікаря.
                    </p>
                    <div class="hero__cta" data-animate style="--delay:.24s">
                        <a routerLink="/publichnyi-dogovir" class="btn btn--brand">Публічний договір</a>
                        <a href="#topics" class="btn btn--ghost">До роз’яснень</a>
                    </div>
                </div>
                <div class="hero__visual" aria-hidden="true">
                    <div class="orb orb--1"></div>
                    <div class="orb orb--2"></div>
                    <div class="grid"></div>
                </div>
            </div>
        </section>

        <div class="container"> 
            <!-- USP -->
        <section class="usp container">
            <div class="usp__item" data-animate style="--delay:.06s">
                <div class="icon">ℹ️</div>
                <h3>Лише інформування</h3>
                <p>Простою мовою про складні явища. Без діагнозів і призначень.</p>
            </div>
            <div class="usp__item" data-animate style="--delay:.12s">
                <div class="icon">🧭</div>
                <h3>Ясність і опора</h3>
                <p>Що саме з вами відбувається і як з цим бути далі.</p>
            </div>
            <div class="usp__item" data-animate style="--delay:.18s">
                <div class="icon">🗓️</div>
                <h3>Підготовка до візиту</h3>
                <p>Як описати симптоми та які питання поставити лікарю очно.</p>
            </div>
        </section>

        <!-- ABOUT -->
        <section class="about container">
            <header class="about__head" data-animate style="--delay:.05s">
                <h2>Про Літвінчук Олену</h2>
                <p class="muted">
                    Професіонал з багаторічним досвідом, що допомагає зрозуміти власні
                    психоемоційні процеси без зайвої термінології — спокійно, структуровано й без осуду.
                </p>
                <!-- ДОДАНО: текст про запис до психолога -->
                <p class="muted" data-animate style="--delay:.065s">
                    За потреби допоможу <strong>записатися до перевіреного психолога/психотерапевта</strong> —
                    підкажу, як сформулювати запит і підібрати фахівця під вашу ситуацію.
                </p>
            </header>

            <!-- doctor profile with photo -->
            <figure class="profile" data-animate style="--delay:.07s" aria-labelledby="profile-name">
                <div class="avatar-wrap">
                    <img
                            class="avatar"
                            [src]="doctorImg"
                            alt="Літвінчук Олена — інформаційні роз’яснення у сфері ментального здоров’я"
                            width="400" height="400"
                            loading="lazy" decoding="async" />
                </div>
                <figcaption class="meta">
                    <span class="badge">Спеціаліст</span>
                    <strong id="profile-name" class="name">Літвінчук Олена</strong>
                    <span class="role muted">Тривога, панічні атаки, сон, стрес</span>
                </figcaption>
            </figure>

            <div class="about__cards">
                <article class="about-card" data-animate style="--delay:.1s">
                    <h3>Що робимо</h3>
                    <ul>
                        <li>Розкладаємо симптоми по поличках</li>
                        <li>Пояснюємо механізми тривоги та паніки</li>
                        <li>Готуємо до очної консультації</li>
                    </ul>
                </article>
                <article class="about-card" data-animate style="--delay:.16s">
                    <h3>Чого не робимо</h3>
                    <ul>
                        <li>Не ставимо діагноз</li>
                        <li>Не призначаємо лікування</li>
                        <li>Не видаємо медичні документи</li>
                    </ul>
                </article>
            </div>
        </section>

        <!-- BOOK TO PSYCHOLOGIST (new) -->
        <section id="book" class="book container">
            <div class="book__box" data-animate style="--delay:.08s">
                <h2>Запис до психолога</h2>
                <p class="muted">
                    Якщо відчуваєте, що потрібна саме психологічна допомога, — напишіть коротко про ситуацію.
                    Я пораджу відповідного фахівця та допоможу з організацією першої зустрічі.
                </p>
                <div class="book__actions">
                    <a href="tel:+380954636617" class="btn btn--ghost"> +380 95 463 66 17</a>
                </div>
                <small class="muted">Запис відбувається конфіденційно. Підкажу, як краще описати запит.</small>
            </div>
        </section>

        <!-- SERVICES -->
        <section class="section container" id="services">
            <header class="section__header" data-animate style="--delay:.05s">
                <h2>Послуги (інформаційні)</h2>
                <p class="muted">Роз’яснення, структура і підготовка до очного візиту.</p>
            </header>

            <div class="tiles">
                <article class="tile" data-animate style="--delay:.08s">
                    <h3>Базове роз’яснення</h3>
                    <p class="muted">Щоб швидко навести лад у поняттях і відчуттях.</p>
                    <ul class="list">
                        <li>Уточнення запиту і контексту</li>
                        <li>Пояснення термінів та типових проявів</li>
                        <li>Відповіді в межах інформування</li>
                    </ul>
                    <div class="badge"> Вартість — індивідуально</div>
                </article>

                <article class="tile" data-animate style="--delay:.14s">
                    <h3>Поглиблене роз’яснення</h3>
                    <p class="muted">Структура, міфи, типові помилки у самооцінці стану.</p>
                    <ul class="list">
                        <li>Огляд теми: симптоми, фактори, хибні уявлення</li>
                        <li>Приклади формулювань для лікаря</li>
                        <li>Індивідуальні нотатки</li>
                    </ul>
                </article>

                <article class="tile" data-animate style="--delay:.2s">
                    <h3>Підготовка до консультації</h3>
                    <p class="muted">Щоб очний прийом був максимально продуктивним.</p>
                    <ul class="list">
                        <li>Як описати симптоми, тригери і тривалість</li>
                        <li>Які питання поставити лікарю</li>
                        <li>Як відстежувати зміни стану</li>
                    </ul>
                </article>
            </div>
        </section>

        <!-- TOPICS -->
        <section id="topics" class="topics container">
            <h2 data-animate style="--delay:.05s">Про що говоримо</h2>
            <div class="chips" data-animate style="--delay:.1s">
                <span class="chip">Панічні атаки</span>
                <span class="chip">Хронічна тривога</span>
                <span class="chip">Порушення сну</span>
                <span class="chip">Депресивні стани</span>
                <span class="chip">Психосоматика</span>
            </div>
            <div class="topics__grid">
                <div class="topic" data-animate style="--delay:.12s">
                    <h3>Панічні атаки</h3>
                    <p>Що запускає напад і як зменшити страх перед повторенням.</p>
                </div>
                <div class="topic" data-animate style="--delay:.16s">
                    <h3>Тривожні розлади</h3>
                    <p>Як відрізнити звичну тривогу від виснажливої.</p>
                </div>
                <div class="topic" data-animate style="--delay:.2s">
                    <h3>Сон</h3>
                    <p>Як повернути здоровий режим без надмірного контролю.</p>
                </div>
                <div class="topic" data-animate style="--delay:.24s">
                    <h3>Депресивні прояви</h3>
                    <p>Коли потрібна фахова допомога та як підготуватись.</p>
                </div>
            </div>
        </section>

        <!-- FAQ -->
        <section class="section">
            <div class="container">
                <header class="section__header" data-animate style="--delay:.05s">
                    <h2>Питання-відповіді</h2>
                </header>
                <div class="faq">
                    <details data-animate style="--delay:.1s">
                        <summary>Чи ставите ви діагнози або призначаєте лікування?</summary>
                        <p>Ні. Це інформаційні послуги без діагностики та лікування.</p>
                    </details>
                    <details data-animate style="--delay:.14s">
                        <summary>Що отримаю після сесії?</summary>
                        <p>Зрозумілий конспект пояснень і нотатки для обговорення з лікарем/психологом.</p>
                    </details>
                    <details data-animate style="--delay:.18s">
                        <summary>Коли потрібно терміново звертатися по допомогу?</summary>
                        <p>При різкому погіршенні, самопошкодженні, суїцидальних думках/планах — 103 або найближчий стаціонар.</p>
                    </details>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="cta container">
            <div class="cta__box" data-animate style="--delay:.08s">
                <h2>Готові зробити перший крок?</h2>
                <p>Коротко опишіть ситуацію — <strong>Літвінчук Олена</strong> допоможе розібратися.</p>
                <div class="cta__actions">
                    <a routerLink="/publichnyi-dogovir" class="btn btn--brand">Публічний договір</a>
                    <a class="btn btn--ghost" href="tel:+380954636617">Номер для запису: +380 95 463 66 17</a>
                    <!-- ДОДАНО: кнопка запису до психолога -->
                    <a class="btn btn--ghost" href="#book">Записатися до психолога</a>
                </div>
                <small class="muted">Це інформаційна послуга, не медична консультація.</small>
            </div>
        </section>
</div>
    `,
    styles: [`
      :host{
        --bg:#0b0f14; --surface:#101825; --panel:#0f1420;
        --ink:#f1f5f9; --muted:#9fb0c7; --line:rgba(255,255,255,.08);
        --brand:#7c5cff; --brand-2:#00e3a2; --ghost:#0b1220;
        --glow: 0 0 0 1px rgba(124,92,255,.25), 0 10px 30px rgba(124,92,255,.25);
        --mx: 0; --my: 0;
        display:block; background:var(--bg); color:var(--ink);
        font-family:"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      }
      .container{ max-width:1100px; margin:0 auto; padding:0 20px; }

      /* HERO */
      .hero{
        position:relative; overflow:hidden;
        background:
                radial-gradient(1200px 600px at 80% -200px, rgba(124,92,255,.25), transparent 60%),
                radial-gradient(1000px 500px at -200px 20%, rgba(0,227,162,.15), transparent 60%),
                linear-gradient(180deg, #0d1421, #0b0f14 60%);
        border-bottom:1px solid var(--line);
      }
      .hero__inner{ display:grid; grid-template-columns: 1.1fr .9fr; gap:40px; align-items:center; padding:88px 0 72px; }
      .kicker{ display:inline-block; font-size:12px; letter-spacing:.12em; text-transform:uppercase; padding:6px 10px; border-radius:999px; border:1px solid var(--line); color:var(--muted); background:rgba(255,255,255,.02); margin-bottom:12px; }
      .hero__title{ font-size:clamp(32px,5vw,56px); line-height:1.05; margin:0 0 12px; }
      .shimmer{
        background:linear-gradient(90deg,#fff 0%,#bdb9ff 30%,#7c5cff 45%,#bdb9ff 60%,#fff 100%);
        -webkit-background-clip:text; background-clip:text; color:transparent;
        background-size:200% 100%; animation:shimmer 3.6s linear infinite;
        text-shadow:0 6px 30px rgba(124,92,255,.25);
      }
      @keyframes shimmer { to{ background-position:-200% 0; } }
      .hero__lead{ color:var(--muted); line-height:1.7; }
      .hero__cta{ margin-top:24px; display:flex; gap:12px; flex-wrap:wrap; }
      .hero__visual{ position:relative; height:300px; }
      .orb{ position:absolute; filter:blur(16px); opacity:.85; border-radius:50%; will-change:transform; transition:transform .2s linear; }
      .orb--1{
        width:200px; height:200px; right:20px; top:10px;
        background:radial-gradient(circle,#7c5cff 0%, rgba(124,92,255,.08) 70%);
        animation:floatY 8s ease-in-out infinite;
        transform: translate(calc(var(--mx)*10px), calc(var(--my)*8px));
      }
      .orb--2{
        width:160px; height:160px; right:140px; bottom:20px;
        background:radial-gradient(circle,#00e3a2 0%, rgba(0,227,162,.06) 70%);
        animation:floatY 10s ease-in-out -2s infinite;
        transform: translate(calc(var(--mx)*-6px), calc(var(--my)*-5px));
      }
      @keyframes floatY { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-14px) } }
      .grid{
        position:absolute; inset:0; border-radius:20px; opacity:.35;
        background:
                linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px) 0 0/22px 22px,
                linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px) 0 0/22px 22px;
        mask: radial-gradient(closest-side, #000 60%, transparent);
        animation:scan 12s linear infinite;
      }
      @keyframes scan { to{ background-position:0 22px, 22px 0; } }

      /* Buttons */
      .btn{ display:inline-block; padding:12px 20px; border-radius:12px; text-decoration:none; font-weight:600; transition:.18s ease; border:1px solid transparent; will-change:transform,box-shadow; }
      .btn--brand{ color:#fff; background:linear-gradient(135deg,var(--brand),#5e45ff); box-shadow:var(--glow); }
      .btn--brand:hover{ transform:translateY(-2px); box-shadow:0 0 0 2px rgba(124,92,255,.25), 0 18px 40px rgba(124,92,255,.35); }
      .btn--ghost{ color:var(--ink); background:rgba(255,255,255,.03); border-color:var(--line); }
      .btn--ghost:hover{ background:rgba(255,255,255,.06); transform:translateY(-2px); }

      /* Reveal on scroll */
      [data-animate]{ opacity:0; transform:translateY(16px) scale(.98); filter:blur(6px);
        transition:transform .7s cubic-bezier(.2,.65,.2,1), opacity .7s cubic-bezier(.2,.65,.2,1), filter .7s cubic-bezier(.2,.65,.2,1);
        transition-delay:var(--delay,0s);
      }
      [data-animate].in{ opacity:1; transform:none; filter:none; }

      /* USP / ABOUT */
      .usp{ display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:16px; padding:28px 0; }
      .usp__item{ background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:18px; box-shadow:0 10px 30px rgba(0,0,0,.25); transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
      .usp__item:hover{ transform:translateY(-3px); border-color:rgba(124,92,255,.35); }
      .icon{ width:42px; height:42px; display:grid; place-items:center; border-radius:10px; background:rgba(124,92,255,.12); margin-bottom:10px; }

      .about{ padding:56px 0; }
      .about__head{ text-align:center; max-width:760px; margin:0 auto 22px; }
      .about__head h2{ margin-bottom:8px; }

      .profile{
        display:flex; align-items:center; justify-content:center; gap:16px;
        margin: 8px auto 24px; padding:12px 14px;
        background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
        border:1px solid var(--line); border-radius:16px;
        box-shadow:0 10px 30px rgba(0,0,0,.35), var(--glow);
        max-width:680px;
      }
      .avatar-wrap{
        position: relative; width: 120px; height: 120px; border-radius: 999px; padding: 2px;
        background: conic-gradient(from 180deg at 50% 50%, var(--brand), var(--brand-2), var(--brand));
        box-shadow: 0 0 0 1px rgba(255,255,255,.04) inset, 0 0 22px rgba(124,92,255,.2);
        flex: 0 0 auto;
      }
      .avatar-wrap::after{
        content:""; position:absolute; inset:-14px; border-radius:999px;
        background: radial-gradient(closest-side, rgba(124,92,255,.35), transparent 70%);
        filter: blur(10px); pointer-events:none;
      }
      .avatar{ width:100%; height:100%; border-radius:999px; object-fit:cover; display:block; background:#0f1420; }
      .meta{ display:grid; gap:4px; min-width:0; }
      .badge{
        justify-self:start; display:inline-flex; align-items:center; gap:6px;
        padding:4px 8px; border-radius:999px; font-size:12px; font-weight:700; letter-spacing:.3px; text-transform:uppercase;
        border:1px solid color-mix(in srgb, var(--brand) 38%, var(--line));
        color:#e9ecff; background: linear-gradient(180deg, rgba(124,92,255,.18), rgba(124,92,255,.08));
      }
      .name{ font-size:18px; margin:0; }
      .role{ font-size:14px; }

      .about__cards{ display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:16px; }
      .about-card{ background:linear-gradient(180deg, rgba(124,92,255,.08), rgba(124,92,255,.02)); border:1px solid var(--line); border-radius:16px; padding:20px; position:relative; overflow:hidden; }
      .about-card::after{ content:""; position:absolute; top:-120%; left:-120%; width:340%; height:340%; background:conic-gradient(from 180deg, rgba(124,92,255,.18), rgba(0,227,162,.12), transparent 30%); animation:spin 18s linear infinite; filter:blur(40px); opacity:.18; pointer-events:none; }
      @keyframes spin { to{ transform:rotate(1turn); } }

      /* BOOK */
      .book{ padding: 10px 0 0; }
      .book__box{
        background:linear-gradient(180deg, rgba(124,92,255,.08), rgba(0,227,162,.08));
        border:1px solid var(--line); border-radius:20px; padding:26px;
        text-align:center; box-shadow:0 20px 50px rgba(0,0,0,.35), var(--glow);
      }
      .book__actions{ display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin:12px 0; }

      /* SERVICES / TOPICS */
      .section{ padding:10px 0 0; }
      .section__header{ text-align:center; margin-bottom:18px; }
      .tiles{ display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:16px; }
      .tile{ background:var(--surface); border:1px solid var(--line); border-radius:18px; padding:20px; position:relative; overflow:hidden; }
      .tile::after{ content:""; position:absolute; inset:-1px; border-radius:18px; background:linear-gradient(135deg, rgba(124,92,255,.22), rgba(0,227,162,.18)); opacity:.12; pointer-events:none; }
      .tile:hover{ transform:translateY(-4px) scale(1.01); box-shadow:0 20px 60px rgba(0,0,0,.35); }

      .topics{ padding:54px 0; }
      .topics h2{ text-align:center; margin-bottom:12px; }
      .chips{ display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-bottom:18px; }
      .chip{ padding:8px 12px; border-radius:999px; border:1px solid var(--line); background:rgba(255,255,255,.03); color:var(--muted); font-size:14px; transition:.18s ease; }
      .chip:hover{ border-color:rgba(124,92,255,.35); color:#e1e7ef; }
      .topics__grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:14px; }
      .topic{ background:var(--panel); border:1px solid var(--line); border-radius:14px; padding:16px; }

      /* FAQ */
      .faq details{ background:var(--panel); border:1px solid var(--line); border-radius:14px; padding:14px 16px; margin-top:12px; }
      .faq summary{ cursor:pointer; list-style:none; font-weight:600; }
      .faq summary::-webkit-details-marker{ display:none; }
      .faq p{ color:var(--muted); margin:10px 0 0; }

      /* CTA */
      .cta{ padding:64px 0 80px; }
      .cta__box{
        background:linear-gradient(180deg, rgba(0,227,162,.08), rgba(124,92,255,.08));
        border:1px solid var(--line); border-radius:20px; padding:26px; text-align:center;
        box-shadow:0 20px 50px rgba(0,0,0,.35), var(--glow);
      }
      .cta__actions{ display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin:12px 0; }
      .muted{ color:var(--muted); }

      /* Mobile */
      @media (max-width: 900px){
        .hero__inner{
          grid-template-columns:1fr;
          gap:16px;
          padding: calc(56px + env(safe-area-inset-top)) 0 40px;
        }
        .hero__text{ text-align:center; }
        .hero__title{ font-size: clamp(26px, 8vw, 34px); line-height:1.15; }
        .hero__lead{ font-size: 15.5px; }
        .hero__cta{ display:grid; grid-template-columns:1fr; gap:10px; }
        .btn{ width:100%; padding:14px 16px; border-radius:14px; }

        .hero__visual{ position:absolute; inset:0; height:100%; opacity:.9; z-index:0; }
        .hero__text{ position:relative; z-index:1; }

        .orb--1{ width:44vw; height:44vw; right:-10vw; top:-6vw; filter:blur(14px); animation-duration:12s; }
        .orb--2{ width:34vw; height:34vw; right:22vw; bottom:10vw; filter:blur(12px); animation-duration:14s; }
        .grid{ opacity:.18; mask: radial-gradient(circle at 60% 40%, #000 38%, transparent 60%); }

        .avatar-wrap{ width:100px; height:100px; }
      }
      @media (max-width: 480px){
        .hero__inner{ padding: calc(44px + env(safe-area-inset-top)) 0 32px; }
        .kicker{ font-size:11px; padding:5px 9px; }
        .shimmer{ animation-duration:5s; background-size:300% 100%; }
        .orb{ filter:blur(12px); }
        .avatar-wrap{ width:92px; height:92px; }
      }

      @media (pointer:coarse){
        .btn{ -webkit-tap-highlight-color: rgba(124,92,255,.25); }
        .btn:active{ transform: translateY(-1px) scale(.99); }
      }

      @media (prefers-reduced-motion: reduce){
        .shimmer, .grid, .orb--1, .orb--2 { animation:none !important; }
        [data-animate]{ transition:none !important; opacity:1 !important; transform:none !important; filter:none !important; }
      }
    `]
})
export class Home implements AfterViewInit {
    doctorImg = 'assets/olena-litvinchuk.jpeg'; // покладіть файл у src/assets/ або змініть шлях
    private parallaxEnabled = false;

    constructor(private title: Title, private host: ElementRef<HTMLElement>, private r: Renderer2) {
        this.title.setTitle('Літвінчук Олена — Інформаційні послуги з ментального здоров’я');
    }

    ngAfterViewInit(): void {
        // Паралакс тільки для миші/трекпада
        this.parallaxEnabled = matchMedia('(pointer: fine)').matches;

        // Reveal on scroll
        const nodes = this.host.nativeElement.querySelectorAll<HTMLElement>('[data-animate]');
        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.isIntersecting) {
                    (e.target as HTMLElement).classList.add('in');
                    io.unobserve(e.target);
                }
            }
        }, { threshold: .14 });
        nodes.forEach(n => io.observe(n));
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(ev: MouseEvent) {
        if (!this.parallaxEnabled) return;
        const x = (ev.clientX / window.innerWidth) * 2 - 1;
        const y = (ev.clientY / window.innerHeight) * 2 - 1;
        this.r.setStyle(this.host.nativeElement, '--mx', x.toFixed(3));
        this.r.setStyle(this.host.nativeElement, '--my', y.toFixed(3));
    }
}
