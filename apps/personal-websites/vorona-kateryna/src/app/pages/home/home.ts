import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink],
    template: `
        <div class="page">
            <!-- HERO -->
            <header class="hero" aria-labelledby="hero-title">
                <div class="hero__bg" aria-hidden="true">
                    <div class="brain"></div>
                    <div class="pill"></div>
                    <div class="ecg"></div>
                    <div class="chat"></div>
                </div>

                <div class="container hero__inner">
                    <div class="hero__col">
                        <p class="eyebrow">Інформаційні роз’яснення · ментальне здоров’я</p>
                        <h1 id="hero-title" class="display">
                            Спокійні та науково обґрунтовані пояснення про тривогу, стрес, сон і панічні епізоди
                        </h1>
                        <p class="lead">
                            Я — <strong>Ворона Катерина</strong>. Допомагаю зрозуміти власні стани, зменшити тривогу та
                            підготуватися до очної консультації лікаря/психіатра чи психолога. Це <strong>інформування</strong>,
                            без діагнозів і призначень.
                        </p>
                        <div class="cta">
                            <a routerLink="/publichnyi-dogovir" class="btn btn--primary">Публічний договір</a>
                            <a href="#navigator" class="btn btn--ghost">Обрати запит</a>
                        </div>
                        <ul class="badges" role="list">
                            <li class="badge">Без стигми</li>
                            <li class="badge">Доказовий підхід</li>
                            <li class="badge">Підготовка до візиту</li>
                        </ul>
                    </div>

                    <!-- ➜ Фото лікаря замість символічної картки -->
                    <figure class="hero__photo">
                        <img
                                src="assets/vorona-kateryna.jpg"
                                alt="Ворона Катерина — інформаційні роз’яснення з ментального здоров’я"
                                width="680" height="680" loading="eager" decoding="async"
                        />
                        <figcaption class="sr-only">Портрет Ворона Катерина</figcaption>
                    </figure>
                </div>
            </header>

            <!-- NAVIGATOR -->
            <section id="navigator" class="navigator" aria-labelledby="nav-title">
                <div class="container">
                    <h2 id="nav-title" class="h2">З чого почнемо?</h2>
                    <p class="muted">Оберіть напрям, який зараз найактуальніший.</p>

                    <div class="nav-grid" role="list">
                        <a class="nav-card" role="listitem" href="#formats">
                            <span class="nav-icon nav-icon--brain" aria-hidden="true"></span>
                            <h3 class="h5">Панічний епізод</h3>
                            <p>Що відбувається в тілі/думках і як діяти в моменті.</p>
                        </a>
                        <a class="nav-card" role="listitem" href="#formats">
                            <span class="nav-icon nav-icon--ecg" aria-hidden="true"></span>
                            <h3 class="h5">Хронічна тривога</h3>
                            <p>Як відрізнити хвилювання від розладу, коли звертатися по допомогу.</p>
                        </a>
                        <a class="nav-card" role="listitem" href="#formats">
                            <span class="nav-icon nav-icon--moon" aria-hidden="true"></span>
                            <h3 class="h5">Порушення сну</h3>
                            <p>Гігієна, ритуали та що реально працює без «накручування».</p>
                        </a>
                        <a class="nav-card" role="listitem" href="#formats">
                            <span class="nav-icon nav-icon--balance" aria-hidden="true"></span>
                            <h3 class="h5">Стрес/вигорання</h3>
                            <p>Ознаки перевантаження, способи саморегуляції, план відновлення.</p>
                        </a>
                    </div>
                </div>
            </section>

            <!-- APPROACH -->
            <section class="approach" aria-labelledby="approach-title">
                <div class="container approach__inner">
                    <div>
                        <h2 id="approach-title" class="h2">Мій підхід</h2>
                        <ul class="ticks">
                            <li><strong>Доказовість:</strong> сучасні настанови та консенсус експертів.</li>
                            <li><strong>Без стигми:</strong> повага до досвіду людини та її меж.</li>
                            <li><strong>Структура:</strong> формулюємо симптоми/тригери для очного візиту до лікаря чи психолога.</li>
                            <li><strong>Простота:</strong> без жаргону — «людською» мовою.</li>
                        </ul>
                    </div>
                    <aside class="alert">
                        <strong>Важливо:</strong> це інформаційні послуги, <u>не</u> медична допомога і не замінюють прийом лікаря чи психолога.
                    </aside>
                </div>
            </section>

            <!-- FORMATS -->
            <section id="formats" class="formats" aria-labelledby="formats-title">
                <div class="container">
                    <header class="section__header">
                        <h2 id="formats-title" class="h2">Формати роз’яснень</h2>
                        <p class="muted">Від орієнтації до підготовки до візиту.</p>
                    </header>

                    <div class="cards text-white">
                        <article class="card">
                            <h3 class="h4">Орієнтація</h3>
                            <p class="caption">20–30 хв · швидка ясність</p>
                            <ul class="list">
                                <li>Збір запиту</li>
                                <li>Коротке пояснення термінів</li>
                                <li>Що робити далі</li>
                            </ul>
                            <a routerLink="/publichnyi-dogovir" class="text-white btn btn--line">Деталі</a>
                        </article>

                        <article class="card card--focus">
                            <h3 class="h4">Пояснення</h3>
                            <p class="caption">45–60 хв · глибший розбір</p>
                            <ul class="list">
                                <li>Механізми, міфи, типові помилки</li>
                                <li>Питання для лікаря</li>
                                <li>Міні-конспект</li>
                            </ul>
                            <a routerLink="/publichnyi-dogovir" class="btn text-white btn--primary">Обрати</a>
                        </article>

                        <article class="card">
                            <h3 class="h4">Підготовка до прийому</h3>
                            <p class="caption">40–50 хв · практичний план</p>
                            <ul class="list">
                                <li>Симптоми, тригери, тривалість</li>
                                <li>Питання/цілі візиту</li>
                                <li>Чек-лист документів</li>
                            </ul>
                            <a routerLink="/publichnyi-dogovir" class="btn text-white btn--line">Деталі</a>
                        </article>
                    </div>
                </div>
            </section>

            <!-- SAFETY -->
            <section class="safety" aria-labelledby="safety-title">
                <div class="container">
                    <h2 id="safety-title" class="h2">Коли потрібна невідкладна допомога</h2>
                    <div class="safety__grid">
                        <div class="safety__card">
                            <h3 class="h5">Терміново телефонуйте 103 або зверніться в стаціонар, якщо:</h3>
                            <ul class="bullets">
                                <li>Є самопошкодження чи суїцидальні думки/плани</li>
                                <li>Різке погіршення стану, сплутаність свідомості</li>
                                <li>Гострі психотичні симптоми</li>
                            </ul>
                        </div>
                        <div class="safety__note">
                            Онлайн-інформування не замінює медичну допомогу. У разі сумнівів — зверніться до лікаря.
                        </div>
                    </div>
                </div>
            </section>

            <!-- FAQ -->
            <section class="faq" aria-labelledby="faq-title">
                <div class="container">
                    <h2 id="faq-title" class="h2">Питання-відповіді</h2>

                    <details class="accordion">
                        <summary>Чи ставите діагнози або призначаєте лікування?</summary>
                        <div>Ні. Це інформування, а не медична послуга.</div>
                    </details>

                    <details class="accordion">
                        <summary>Що отримаю після сесії?</summary>
                        <div>Ясні пояснення вашого запиту та нотатки/питання для лікаря.</div>
                    </details>

                    <details class="accordion">
                        <summary>Чи робите записи розмови?</summary>
                        <div>За взаємною згодою. Запис — лише для особистого користування.</div>
                    </details>
                </div>
            </section>

            <!-- CTA -->
            <section class="cta-band" aria-labelledby="cta-title">
                <div class="container cta-band__inner">
                    <h2 id="cta-title" class="h2">Готові рухатися спокійно та по суті?</h2>
                    <p class="muted">
                        Опишіть коротко ситуацію — сформуємо план наступних кроків, включно з підготовкою до консультації лікаря чи психолога.
                    </p>
                    <div class="cta">
                        <a href="#navigator" class="btn btn--ghost">Обрати запит</a>
                        <a routerLink="/publichnyi-dogovir" class="btn btn--primary">Перейти до договору</a>
                    </div>
                </div>
            </section>
        </div>
    `,
    styles: [`
      /* THEME */
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
      .container{max-width:1120px;margin:0 auto;padding:0 20px;}

      .display{font-size:clamp(30px,5.2vw,50px);line-height:1.12;margin:.25rem 0 .6rem;}
      .h2{font-size:clamp(22px,3vw,30px);margin:0 0 .5rem;}
      .h5{font-size:16px;margin:0;}
      .lead{font-size:18px;color:var(--muted);line-height:1.7;}
      .muted{color:var(--muted);}
      .eyebrow{font-weight:800;font-size:11px;letter-spacing:.7px;text-transform:uppercase;color:var(--indigo);opacity:.95;}

      /* HERO */
      .hero{position:relative;overflow:hidden;padding:56px 0 14px;}
      .hero__inner{display:grid;grid-template-columns:1.15fr .85fr;gap:26px;align-items:center;position:relative;}
      @media (max-width:960px){.hero__inner{grid-template-columns:1fr;gap:18px}}

      .hero__bg{position:absolute;inset:0;pointer-events:none;opacity:.55;}
      .hero__bg > div{position:absolute;filter:drop-shadow(0 10px 40px rgba(0,0,0,.35));opacity:.65;}
      .brain{width:320px;height:320px;left:-60px;top:-40px;background:var(--surface);border:1px solid var(--line);border-radius:50%;
        mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><path fill='%23fff' d='M32 4c-8 0-14 6-14 14-6 0-10 5-10 10s4 10 10 10c0 8 6 14 14 14s14-6 14-14c6 0 10-5 10-10s-4-10-10-10C46 10 40 4 32 4z'/></svg>") center/80% 80% no-repeat;
        background:linear-gradient(135deg, rgba(111,167,255,.35), rgba(169,139,255,.25));}
      .pill{width:180px;height:180px;right:8%;top:10%;border-radius:28px;background:linear-gradient(135deg, rgba(105,227,255,.35), rgba(111,167,255,.25));transform:rotate(18deg);}
      .ecg{height:120px;width:60%;left:20%;bottom:10%;
        background-image:linear-gradient(to right, transparent 0 10px, rgba(111,167,255,.25) 10px 11px),
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='120' viewBox='0 0 800 120'><polyline fill='none' stroke='%2369e3ff' stroke-width='2' points='0,60 60,60 80,20 100,90 120,60 200,60 220,15 240,100 260,60 340,60 360,30 380,95 400,60 480,60 500,10 520,105 540,60 620,60 640,25 660,98 680,60 800,60'/></svg>");
        background-size:auto 100%;background-repeat:repeat-x;opacity:.45;animation:scroll-x 22s linear infinite;}
      .chat{width:160px;height:120px;right:-40px;bottom:15%;border-radius:16px;background:linear-gradient(135deg, rgba(169,139,255,.30), rgba(111,167,255,.22));}
      @keyframes scroll-x{to{background-position:1000px 0;}}

      .hero__col{z-index:1;}
      .badges{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;padding:0;list-style:none;}
      .badge{padding:8px 10px;border-radius:999px;background:rgba(111,167,255,.12);border:1px solid color-mix(in srgb, var(--indigo) 45%, var(--line));color:#e9f2ff;font-weight:700;font-size:12px;letter-spacing:.2px;}

      .hero__photo{
        position:relative; height:420px; border-radius:24px; overflow:hidden;
        background:linear-gradient(180deg, var(--surface), var(--surface-2));
        border:1px solid var(--line); box-shadow:var(--shadow-sm);
      }
      .hero__photo img{
        width:100%; height:100%; object-fit:cover; display:block; transform:scale(1.02);
        transition: transform .6s ease, filter .6s ease;
        filter:saturate(108%) contrast(102%);
      }
      @media (hover:hover){ .hero__photo:hover img{ transform:scale(1.05); } }

      .cta{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;}
      .btn{display:inline-block;padding:12px 18px;border-radius:12px;font-weight:800;border:2px solid transparent;text-decoration:none;transition:.2s ease;box-shadow:var(--shadow-sm);}
      .btn--primary{background:var(--indigo);color:#0b0e14;border-color: color-mix(in srgb, var(--indigo) 60%, #fff);}
      .btn--primary:hover{transform:translateY(-2px);background:color-mix(in srgb, var(--indigo) 80%, var(--vio));}
      .btn--ghost{background:transparent;color:var(--ink);border-color:var(--line);}
      .btn--ghost:hover{transform:translateY(-2px);border-color: color-mix(in srgb, var(--indigo) 40%, var(--line));}

      /* NAVIGATOR */
      .navigator{padding:28px 0 8px;}
      .nav-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:10px;}
      @media (max-width:960px){.nav-grid{grid-template-columns:1fr 1fr}}
      @media (max-width:640px){.nav-grid{grid-template-columns:1fr}}
      .nav-card{position:relative;background:linear-gradient(180deg, var(--surface), var(--surface-2));border:1px solid var(--line);border-radius:16px;padding:16px;text-decoration:none;color:var(--ink);box-shadow:var(--shadow-sm);transition:.2s ease;}
      .nav-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-md);border-color: color-mix(in srgb, var(--indigo) 45%, var(--line));}
      .nav-card p{color:var(--muted);margin:.35rem 0 0;}
      .nav-icon{position:absolute;right:12px;top:12px;width:28px;height:28px;opacity:.9;background:var(--indigo);border-radius:8px;mask-size:70% 70%;mask-position:center;mask-repeat:no-repeat;}
      .nav-icon--brain{mask-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23fff' d='M8 4a4 4 0 0 0-4 4c0 1.1.45 2.1 1.17 2.83A3.99 3.99 0 0 0 8 16h1V4H8zm7 0h-1v12h1a4 4 0 0 0 2.83-1.17A3.99 3.99 0 0 0 20 8a4 4 0 0 0-4-4zM9 4h6v12H9z'/></svg>");}
      .nav-icon--ecg{mask-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23fff' d='M3 13h4l2-6 4 12 2-6h6v-2h-7l-1.5 4.5L10 5 7.5 13H3z'/></svg>");}
      .nav-icon--moon{mask-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23fff' d='M12 2a9 9 0 0 0 0 18 8 8 0 1 1 0-16z'/></svg>");}
      .nav-icon--balance{mask-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23fff" d="M11 3h2v2h3v2h-3v8a5 5 0 1 0 2 4h2a7 7 0 1 1-6-6V7h-3V5h3z"/></svg>');}

      /* APPROACH */
      .approach{padding:18px 0 10px;}
      .approach__inner{display:grid;grid-template-columns:1.2fr .8fr;gap:16px;align-items:start;}
      @media (max-width:960px){.approach__inner{grid-template-columns:1fr}}
      .ticks{margin:.25rem 0 0;padding-left:18px;}
      .ticks li{margin:.45rem 0;line-height:1.6;color:var(--muted);}
      .alert{background:linear-gradient(180deg, var(--surface), var(--surface-2));border:1px solid color-mix(in srgb, var(--indigo) 35%, var(--line));border-radius:14px;padding:14px;color:#eaf2ff;box-shadow:0 8px 26px rgba(111,167,255,.18);}

      /* FORMATS */
      .formats{padding:28px 0 8px;}
      .section__header{margin-bottom:10px;}
      .cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px; color: white}
      @media (max-width:960px){.cards{grid-template-columns:1fr}}
      .card{ color:white; background:linear-gradient(180deg, var(--surface), var(--surface-2));border:1px solid var(--line);border-radius:16px;padding:16px;box-shadow:var(--shadow-sm);transition:.2s ease;}
      .card:hover{transform:translateY(-3px);box-shadow:var(--shadow-md);border-color: color-mix(in srgb, var(--indigo) 45%, var(--line));}
      .card--focus{border-color: color-mix(in srgb, var(--indigo) 55%, var(--line));box-shadow:0 10px 36px rgba(111,167,255,.25);}
      .caption{color:var(--muted);margin:.25rem 0 .6rem;}
      .list{margin:.25rem 0 .8rem;padding-left:18px;}
      .list li{margin:.4rem 0;line-height:1.55;color:var(--muted);}

      /* SAFETY */
      .safety{padding:22px 0 8px;}
      .safety__grid{display:grid;grid-template-columns:1.2fr .8fr;gap:14px;}
      @media (max-width:960px){.safety__grid{grid-template-columns:1fr}}
      .safety__card{background:linear-gradient(180deg, var(--surface), var(--surface-2));border:1px solid var(--line);border-radius:16px;padding:16px;}
      .bullets{margin:.25rem 0 0;padding-left:18px;}
      .bullets li{margin:.35rem 0;color:#ffdbe0;}
      .safety__note{border:1px dashed color-mix(in srgb, var(--danger) 55%, var(--line));border-radius:16px;padding:14px;background:rgba(255,107,122,.08);color:#ffe9ec;}

      /* FAQ */
      .faq{padding:22px 0 36px;}
      .accordion{background:linear-gradient(180deg, var(--surface), var(--surface-2));border:1px solid var(--line);border-radius:12px;margin:10px 0;overflow:hidden;}
      .accordion > summary{cursor:pointer;list-style:none;padding:14px 16px;font-weight:700;position:relative;}
      .accordion > summary::-webkit-details-marker{display:none;}
      .accordion > summary::after{content:"›";position:absolute;right:16px;top:50%;transform:translateY(-50%) rotate(90deg);opacity:.6;transition:.2s;}
      .accordion[open] > summary::after{transform:translateY(-50%) rotate(-90deg);opacity:.9;}
      .accordion > div{padding:0 16px 14px;color:var(--muted);}

      /* CTA BAND */
      .cta-band{border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:32px 0;background:
              radial-gradient(600px 300px at 10% 10%, rgba(111,167,255,.12), transparent 60%),
              radial-gradient(600px 300px at 90% 0%, rgba(169,139,255,.14), transparent 60%),
              linear-gradient(180deg, #121623, #121826);}
      .cta-band__inner{text-align:center;}
      .cta{justify-content:flex-start}
      .cta-band .cta{justify-content:center;margin-top:12px;}

      /* Focus */
      a:focus-visible, button:focus-visible{outline:none;box-shadow:var(--ring);border-radius:12px;}
    `]
})
export class Home {
    constructor(private title: Title){
        this.title.setTitle('Ворона Катерина — Інформаційні роз’яснення (портрет у герої)');
    }
}