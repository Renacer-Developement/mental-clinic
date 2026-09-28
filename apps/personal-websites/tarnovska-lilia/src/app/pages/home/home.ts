import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink],
    template: `
        <div class="page">
            <!-- HERO (radically new, full-bleed) -->
            <header class="hero hero--full" aria-labelledby="hero-title">
                <!-- decorative gradient + blob svg background -->
                <div class="hero__bg" aria-hidden="true">
                    <svg class="blob" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
                        <defs>
                            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stop-color="#9b5cff" stop-opacity="0.9"/>
                                <stop offset="100%" stop-color="#5b3aa8" stop-opacity="0.6"/>
                            </linearGradient>
                        </defs>
                        <path fill="url(#g1)" d="M428.5,319Q395,438,274.5,470.5Q154,503,117,381.5Q80,260,154.5,184Q229,108,339.5,139.5Q450,171,428.5,319Z"/>
                    </svg>
                </div>

                <div class="container hero__wrap">
                    <!-- LEFT: headline card -->
                    <div class="hero__left" data-animate style="--delay:.05s">
                        <div class="hero__card">
                            <p class="eyebrow">Поясню просто · без ярликів</p>
                            <h1 id="hero-title" class="display">
                                Спокійні роз’яснення про тривогу, панічні епізоди та сон
                            </h1>
                            <p class="lead">
                                Я — <strong>Тарновська Лілія</strong>. Допоможу назвати явища своїми іменами
                                та підготую до очної розмови з лікарем — без діагнозів і рецептів.
                                <span class="d-block">Можливість запису до психолога для подальшої підтримки.</span>
                            </p>

                            <ul class="hero__checklist" aria-label="Що включено">
                                <li><span aria-hidden="true">✓</span> Зрозуміла мова</li>
                                <li><span aria-hidden="true">✓</span> Конспект спостережень</li>
                                <li><span aria-hidden="true">✓</span> Питання для лікаря</li>
                            </ul>

                            <div class="cta">
                                <a routerLink="/publichnyi-dogovir" class="btn btn--primary">Публічний договір</a>
                                <a href="#packages" class="btn btn--ghost">Переглянути формати</a>
                            </div>

                            <div class="hero__trust" role="list" aria-label="Довіра">
                                <span class="chip" role="listitem">Без осуду</span>
                                <span class="chip" role="listitem">Обережно до тригерів</span>
                                <span class="chip" role="listitem">Лише інформування</span>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT: portrait + stat tiles -->
                    <div class="hero__right" data-animate style="--delay:.12s" aria-label="Фото та показники">
                        <figure class="hero__portrait">
                            <img
                                    src="assets/tarnovska.jpg"
                                    alt="Тарновська Лілія"
                                    width="800" height="1000" loading="lazy" decoding="async"/>
                        </figure>

                        <div class="hero__stats">
                            <div class="stat">
                                <div class="stat__num">60<span class="sm">хв</span></div>
                                <div class="stat__label">онлайн-сесія</div>
                            </div>
                            <div class="stat">
                                <div class="stat__num">3</div>
                                <div class="stat__label">кроки: бриф → сесія → нотатки</div>
                            </div>
                            <div class="stat">
                                <div class="stat__num">0</div>
                                <div class="stat__label">діагнозів та призначень</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- wave divider into content -->
                <div class="hero__wave" aria-hidden="true">
                    <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                        <path d="M0,40 C240,100 480,0 720,40 C960,80 1200,20 1440,60 L1440,120 L0,120 Z"></path>
                    </svg>
                </div>
            </header>

            <!-- WHAT I DO -->
            <section class="pillars" aria-labelledby="pillars-title">
                <div class="container">
                    <h2 id="pillars-title" class="h2" data-animate>Що ви отримаєте</h2>
                    <div class="pillars__grid" data-stagger=".p">
                        <article class="p" data-animate>
                            <h3>Спокійні пояснення</h3>
                            <p>Що таке тривога/панічний епізод і як це працює — без “страшних” термінів.</p>
                        </article>
                        <article class="p" data-animate>
                            <h3>Структура спостережень</h3>
                            <p>Тригери, частота, тривалість — зберемо короткий конспект для лікаря.</p>
                        </article>
                        <article class="p" data-animate>
                            <h3>Жодних призначень</h3>
                            <p>Це не лікування і не діагностика. Лише інформування та підготовка.</p>
                        </article>
                        <article class="p" data-animate>
                            <h3>План очного візиту</h3>
                            <p>Що сказати, які питання поставити, що взяти з собою. За потреби — рекомендація запису до психолога.</p>
                        </article>
                    </div>
                </div>
            </section>

            <!-- PROCESS -->
            <section class="process" aria-labelledby="process-title">
                <div class="container">
                    <h2 id="process-title" class="h2" data-animate>Як це відбувається</h2>
                    <ol class="steps" data-stagger=".step">
                        <li class="step" data-animate>
                            <span class="dot">1</span>
                            <div>
                                <h3>Короткий бриф</h3>
                                <p>Опишіть, що турбує. 5–10 хвилин.</p>
                            </div>
                        </li>
                        <li class="step" data-animate>
                            <span class="dot">2</span>
                            <div>
                                <h3>Онлайн-зустріч</h3>
                                <p>40–60 хвилин: пояснення явищ, відповіді на запитання.</p>
                            </div>
                        </li>
                        <li class="step" data-animate>
                            <span class="dot">3</span>
                            <div>
                                <h3>Підсумок</h3>
                                <p>Конспект спостережень та чек-лист для лікаря.</p>
                            </div>
                        </li>
                    </ol>
                </div>
            </section>

            <!-- PACKAGES -->
            <section id="packages" class="packages" aria-labelledby="packages-title">
                <div class="container">
                    <h2 id="packages-title" class="h2" data-animate>Пакети послуг</h2>
                    <div class="cards" data-stagger=".card">
                        <article class="card" data-animate>
                            <header>
                                <h3>Старт</h3>
                                <p class="caption">Орієнтація та перші відповіді</p>
                            </header>
                            <ul class="features">
                                <li>Бриф + 30 хв онлайн</li>
                                <li>Базові пояснення</li>
                                <li>Міні-конспект</li>
                            </ul>
                            <div class="actions">
                                <a routerLink="/publichnyi-dogovir" class="btn btn--line">Деталі</a>
                            </div>
                        </article>

                        <article class="card card--featured" data-animate>
                            <header>
                                <h3>Пояснення</h3>
                                <p class="caption">Глибше розуміння + підсумок</p>
                            </header>
                            <ul class="features">
                                <li>Бриф + 60 хв онлайн</li>
                                <li>Розбір явищ і міфів</li>
                                <li>Конспект + питання для лікаря</li>
                            </ul>
                            <div class="actions">
                                <a routerLink="/publichnyi-dogovir" class="btn btn--primary">Обрати</a>
                            </div>
                        </article>

                        <article class="card" data-animate>
                            <header>
                                <h3>Підготовка</h3>
                                <p class="caption">Фокус на очному прийомі</p>
                            </header>
                            <ul class="features">
                                <li>Бриф + 45 хв онлайн</li>
                                <li>План розмови з лікарем</li>
                                <li>Чек-лист документів</li>
                            </ul>
                            <div class="actions">
                                <a routerLink="/publichnyi-dogovir" class="btn btn--line">Деталі</a>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <!-- ARTICLES -->
            <section class="articles" aria-labelledby="articles-title">
                <div class="container">
                    <h2 id="articles-title" class="h2" data-animate>Короткі матеріали</h2>
                    <div class="articles__grid" data-stagger=".art">
                        <article class="art" data-animate>
                            <h3>Панічний епізод: що робити</h3>
                            <p>Швидкі кроки під час епізоду та як зменшити страх повторення.</p>
                        </article>
                        <article class="art" data-animate>
                            <h3>Тривога чи розлад?</h3>
                            <p>Як відрізнити звичайне хвилювання від стану, що потребує уваги.</p>
                        </article>
                        <article class="art" data-animate>
                            <h3>Сон без “накручування”</h3>
                            <p>Що реально впливає на якість сну, а що — зайві ритуали.</p>
                        </article>
                    </div>
                </div>
            </section>

            <!-- FAQ -->
            <section class="faq" aria-labelledby="faq-title">
                <div class="container">
                    <h2 id="faq-title" class="h2" data-animate>Питання-відповіді</h2>
                    <details data-animate>
                        <summary>Це терапія чи консультування?</summary>
                        <p>Ні. Це інформаційні роз’яснення без діагностики і лікування.</p>
                    </details>
                    <details data-animate>
                        <summary>Що отримаю після зустрічі?</summary>
                        <p>Короткий підсумок, тези для очної розмови з лікарем і корисні запитання.</p>
                    </details>
                    <details data-animate>
                        <summary>Коли потрібна невідкладна допомога?</summary>
                        <p>При різкому погіршенні стану, вираженому самопошкодженні чи суїцидальних думках — 103 або найближчий стаціонар.</p>
                    </details>
                    <details data-animate>
                        <summary>Чи можу я записатися до психолога?</summary>
                        <p>Так, Лілія може порекомендувати запис до психолога для подальшої підтримки. Для запису скористайтеся <a routerLink="/book-psychologist">формою</a> або зателефонуйте за номером <a href="tel:+380961562483">+380 (97) 133 35 63</a>.</p>
                    </details>
                </div>
            </section>

            <!-- CTA BAND (inverted) -->
            <section class="cta-band" aria-labelledby="cta-title">
                <div class="container">
                    <h2 id="cta-title" class="h2 inv-title">Готові зробити перший крок?</h2>
                    <p class="inv-lead">Опишіть коротко ситуацію — <strong>Тарновська Лілія</strong> допоможе розібратися або запишіться до психолога для глибшої роботи.</p>
                    <div class="cta__actions">
                        <a routerLink="/publichnyi-dogovir" class="btn btn--inverted">Публічний договір</a>
                        <a routerLink="/book-psychologist" class="btn btn--inverted">Запис до психолога</a>
                        <a class="btn btn--ghost-inv" href="tel:+380961562483">Номер для запису: +380 (97) 133 35 63</a>
                    </div>
                    <small class="inv-muted">Це інформаційна послуга, не медична консультація.</small>
                </div>
            </section>
        </div>
    `,
    styles: [`
      /* ------------------ ORCHID NOIR (Purple + Grey) — base ------------------ */
      :host{
        --bg:#0f0f18;            /* near-black indigo-grey */
        --layer:#131320;         /* deeper layer */
        --surface:#161627;       /* cards */
        --ink:#f0f0ff;           /* off-white */
        --muted:#b5b6c9;         /* cool grey */
        --line:#2a2a3e;          /* outline grey */

        --orchid:#9b5cff;        /* primary purple */
        --orchid-2:#7e44ef;      /* deeper */
        --plum:#5b3aa8;          /* dark plum */
        --iris:#c6b6ff;          /* pale purple for text */
        --silver:#d4d6e7;        /* grey accent */

        --ring:0 0 0 3px color-mix(in srgb, var(--orchid) 36%, transparent);
        --shadow-sm:0 10px 28px rgba(0,0,0,.35);
        --shadow-md:0 26px 70px rgba(0,0,0,.55);

        --radius:18px;
        --radius-lg:22px;

        background:
                radial-gradient(80vw 60vh at 10% 0%, rgba(155,92,255,.12) 0%, transparent 60%),
                radial-gradient(70vw 55vh at 100% 100%, rgba(94,74,180,.15) 0%, transparent 65%),
                var(--bg);
        color:var(--ink);
        display:block;
        font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", sans-serif;
        -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
        text-rendering:optimizeLegibility; accent-color:var(--orchid);
      }
      .container{ max-width:1140px; margin:0 auto; padding:0 20px; }

      /* ===== RADICAL HERO ===== */
      .hero.hero--full{
        position:relative;
        padding:0; /* full-bleed */
        min-height:86vh;
        display:grid;
        place-items:stretch;
        isolation:isolate;
        color:#fff;
      }
      .hero__bg{
        position:absolute; inset:0; overflow:hidden; z-index:0;
        background:
                radial-gradient(100vw 70vh at 10% 10%, rgba(155,92,255,.22), transparent 60%),
                radial-gradient(80vw 60vh at 90% 80%, rgba(60,55,100,.35), transparent 65%),
                linear-gradient(180deg, #141625 0%, #0f0f18 100%);
      }
      .hero__bg .blob{
        position:absolute; width:540px; height:540px; right:-80px; top:-80px;
        filter:blur(12px) saturate(130%); opacity:.55; transform:rotate(-8deg);
      }
      .hero__wrap{
        position:relative; z-index:1;
        display:grid; grid-template-columns:1.1fr .9fr; gap:28px; align-items:center;
        padding:56px 20px 32px;
      }
      .hero__card{
        background:linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.02));
        border:1px solid var(--line);
        border-radius:22px;
        padding:22px;
        box-shadow:0 20px 60px rgba(0,0,0,.35);
        backdrop-filter:saturate(120%) blur(8px);
      }
      .hero .eyebrow{ color:#cabdff; opacity:.95; }
      .hero .display{ margin:.25rem 0 .6rem; }
      .hero .lead{ color:#fff; opacity:.92; }
      .hero__checklist{
        display:flex; flex-wrap:wrap; gap:10px 14px; margin:12px 0 14px; padding:0; list-style:none;
      }
      .hero__checklist li{
        display:flex; align-items:center; gap:8px;
        background:rgba(255,255,255,.06);
        border:1px solid var(--line);
        border-radius:999px; padding:8px 12px;
        font-weight:600;
      }
      .hero__checklist span{ font-weight:900; color:#cabdff; }
      .hero__trust{ display:flex; flex-wrap:wrap; gap:10px; margin-top:12px; }
      .chip{
        background:#1f2140; border:1px solid var(--line); border-radius:999px;
        padding:7px 10px; font-weight:700;
      }
      .hero__right{ position:relative; display:grid; gap:14px; align-content:start; }
      .hero__portrait{
        margin:0; border-radius:20px; overflow:hidden; border:1px solid var(--line);
        background:linear-gradient(180deg, #1b1b34, #131326);
        box-shadow:0 18px 48px rgba(0,0,0,.45);
        aspect-ratio: 4 / 5;
      }
      .hero__portrait img{
        width:100%; height:100%; object-fit:cover; display:block;
        transform:scale(1.03); transition:transform .7s ease;
      }
      .hero__portrait:hover img{ transform:scale(1.06); }
      .hero__stats{ display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; }
      .stat{
        background:#1a1c33; border:1px solid var(--line); border-radius:14px; padding:12px; text-align:center;
      }
      .stat__num{ font-size:28px; font-weight:900; line-height:1; }
      .stat__num .sm{ font-size:14px; font-weight:700; opacity:.9; margin-left:2px; }
      .stat__label{ font-size:13px; opacity:.9; margin-top:6px; }
      .hero__wave{ position:absolute; left:0; right:0; bottom:-1px; z-index:0; }
      .hero__wave svg{ width:100%; height:120px; display:block; }
      .hero__wave path{ fill:#0f0f18; opacity:1; }

      /* buttons inside hero */
      .hero .btn--primary{
        color:#0f0f18; background:var(--orchid);
        border-color: color-mix(in srgb, var(--orchid) 65%, #fff);
      }
      .hero .btn--primary:hover{ transform:translateY(-2px); background:var(--orchid-2); border-color:var(--orchid-2); }
      .hero .btn--ghost{ background:transparent; border-color: var(--line); color:#fff; }
      .hero .btn--ghost:hover{ transform:translateY(-2px); border-color: color-mix(in srgb, var(--orchid) 35%, var(--line)); box-shadow:var(--shadow-md); }

      /* TYPE (global) */
      .display{ font-size:clamp(30px,5.2vw,50px); line-height:1.12; letter-spacing:.15px; }
      .lead{ font-size:18px; color:var(--iris); line-height:1.7; }
      .h2{ font-size:clamp(20px,3vw,28px); margin:0 0 12px; color:#f6f4ff; }
      .eyebrow{ font-weight:800; font-size:11px; letter-spacing:.7px; text-transform:uppercase; color:var(--orchid); opacity:.95; }
      .inv-title{ color:#0f0f18; margin:0; }
      .inv-lead{ color:#201e2f; margin:8px 0 0; }
      .inv-muted{ color:#2a2640; display:block; margin-top:10px; }
      .d-block{ display:block; }

      /* PILLARS */
      .pillars{ padding:28px 0 10px; }
      .pillars__grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:14px; }
      .p{
        background:linear-gradient(180deg, color-mix(in srgb, var(--surface) 92%, transparent), rgba(155,92,255,.05));
        border:1px solid var(--line); border-radius:var(--radius); padding:16px;
        transition:transform .22s ease, box-shadow .22s ease, border-color .22s ease, background .22s ease;
      }
      .p:hover{
        transform:translateY(-3px); box-shadow:var(--shadow-md);
        border-color:color-mix(in srgb, var(--orchid) 35%, var(--line));
        background:linear-gradient(180deg, rgba(155,92,255,.08), rgba(155,92,255,.02));
      }
      .p h3{ margin:0 0 6px; font-size:18px; color:#f3e9ff; }

      /* PROCESS */
      .process{ padding:20px 0 8px; }
      .steps{ list-style:none; margin:0; padding-left:0; border-left:3px dashed color-mix(in srgb, var(--orchid) 35%, var(--line)); }
      .step{ position:relative; padding-left:24px; }
      .step + .step{ margin-top:14px; }
      .dot{
        position:absolute; left:-16px; top:8px; transform:translateX(-50%);
        width:28px; height:28px; border-radius:999px; display:grid; place-items:center;
        color:#0f0f18; font-weight:800; font-size:13px; border:2px solid #0f0f18;
        background: radial-gradient(120% 120% at 20% 20%, var(--orchid) 0%, var(--orchid-2) 80%);
        box-shadow:0 3px 12px rgba(155,92,255,.35);
      }

      /* PACKAGES */
      .packages{ padding:22px 0 10px; }
      .cards{ display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:14px; }
      .card{
        background:linear-gradient(180deg, #1a1a33, #131326);
        border:1px solid var(--line); border-radius:var(--radius-lg); padding:16px; box-shadow:var(--shadow-sm);
        transition:transform .22s ease, box-shadow .22s ease, border-color .22s ease;
        color: white;
      }
      .card--featured{
        background:linear-gradient(180deg, #231e4a, #171537);
        border-color: color-mix(in srgb, var(--orchid) 40%, var(--line));
        box-shadow:0 10px 40px rgba(155,92,255,.22);
      }
      .card:hover{ transform:translateY(-4px); box-shadow:var(--shadow-md); }
      .caption{ color:var(--muted); margin:.25rem 0 .5rem; }
      .features{ margin:.5rem 0 .75rem; padding-left:18px; }
      .actions{ margin-top:.5rem; }

      /* ARTICLES */
      .articles{ padding:22px 0 10px; }
      .articles__grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:14px; }
      .art{ background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:14px; }
      .art h3{ margin:0 0 6px; color:#f3e9ff; }

      /* FAQ */
      .faq{ padding:22px 0 36px; }
      .faq details{
        background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:12px 14px;
        transition:border-color .18s ease, box-shadow .18s ease, background .18s ease;
      }
      .faq details + details{ margin-top:10px; }
      .faq summary{ cursor:pointer; list-style:none; font-weight:700; outline:none; color:#f3e9ff; }
      .faq summary::-webkit-details-marker{ display:none; }
      .faq summary::after{ content:"›"; float:right; transform:rotate(90deg); transition:transform .18s ease; opacity:.7; }
      .faq details[open] summary::after{ transform:rotate(-90deg); opacity:.95; }
      .faq details[open]{
        border-color: color-mix(in srgb, var(--orchid) 28%, var(--line));
        background: color-mix(in srgb, var(--surface) 85%, #222046 15%);
        box-shadow:0 0 0 3px color-mix(in srgb, var(--orchid) 14%, transparent), var(--shadow-sm);
      }
      .faq p{ margin:10px 0 0; color:var(--iris); }

      /* CTA BAND (inverted) */
      .cta-band{
        background: linear-gradient(180deg, color-mix(in srgb, var(--orchid) 58%, #5e49b8), #efeaff);
        color:#0f0f18; padding:34px 0 48px; margin-top:12px;
        border-top:1px solid color-mix(in srgb, var(--orchid) 25%, var(--line));
      }
      .cta__actions{ margin-top:14px; display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }

      /* BUTTONS (global) */
      .btn{
        display:inline-block; padding:12px 18px; border-radius:12px; font-weight:800; line-height:1;
        border:2px solid transparent; text-decoration:none; transition:transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease, color .2s ease;
        will-change:transform; box-shadow:var(--shadow-sm); text-transform:uppercase; letter-spacing:.3px;
      }
      .btn:focus-visible{ outline:none; box-shadow:var(--ring), var(--shadow-sm); }
      .btn--primary{ color:#0f0f18; background:var(--orchid); border-color: color-mix(in srgb, var(--orchid) 65%, #fff); }
      .btn--primary:hover{ transform:translateY(-2px); background:var(--orchid-2); border-color:var(--orchid-2); }
      .btn--ghost{ background:transparent; border-color: var(--line); color:var(--ink); }
      .btn--ghost:hover{ transform:translateY(-2px); border-color: color-mix(in srgb, var(--orchid) 35%, var(--line)); box-shadow:var(--shadow-md); }
      .btn--line{ background:transparent; color:var(--ink); border-color: var(--line); }
      .btn--line:hover{ transform:translateY(-2px); border-color: color-mix(in srgb, var(--orchid) 38%, var(--line)); box-shadow:var(--shadow-md); }
      .btn--inverted{ color:#1a1530; background:#f6f2ff; border-color:#f6f2ff; }
      .btn--inverted:hover{ transform:translateY(-2px); background:#e8ddff; border-color:#e8ddff; }
      .btn--ghost-inv{ color:#3a2c70; background:transparent; border-color:#7e65ff; }
      .btn--ghost-inv:hover{ transform:translateY(-2px); background:rgba(0,0,0,.08); }

      /* ANIMATIONS */
      [data-animate]{ opacity:0; transform:translateY(12px); will-change:transform, opacity; transition:opacity .6s ease, transform .6s ease; transition-delay: var(--delay, 0s); }
      .is-visible[data-animate]{ opacity:1; transform:none; }
      [data-stagger] > *{ transition-delay: var(--delay, 0s); }

      /* RESPONSIVE */
      @media (max-width:1100px){
        .hero__wrap{ grid-template-columns:1fr; padding-top:44px; }
        .hero__right{ order:-1; }
      }
      @media (max-width:560px){
        .hero.hero--full{ min-height:unset; }
        .hero__stats{ grid-template-columns:repeat(2,minmax(0,1fr)); }
      }
    `]
})
export class Home implements AfterViewInit {
    constructor(private title: Title, private el: ElementRef<HTMLElement>, private r2: Renderer2) {
        this.title.setTitle('Тарновська Лілія — Роз’яснення (радикально новий Hero, Purple/Grey)');
    }

    ngAfterViewInit(): void {
        const root: HTMLElement = this.el.nativeElement;
        const animated: NodeListOf<HTMLElement> = root.querySelectorAll<HTMLElement>('[data-animate]');
        root.querySelectorAll<HTMLElement>('[data-stagger]').forEach(parent => {
            const sel = parent.getAttribute('data-stagger') ?? '';
            parent.querySelectorAll<HTMLElement>(sel).forEach((el, i) => el.style.setProperty('--delay', `${0.07 * (i + 1)}s`));
        });
        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.isIntersecting) {
                    this.r2.addClass(e.target, 'is-visible');
                    io.unobserve(e.target);
                }
            }
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
        animated.forEach(el => io.observe(el));
    }
}