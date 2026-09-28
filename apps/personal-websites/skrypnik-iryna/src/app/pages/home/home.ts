import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink],
    template: `
        <div class="shell container">
            <!-- HERO -->
            <section class="hero container" aria-labelledby="hero-title">
                <div class="hero__content">
                    <span class="eyebrow">Інформаційні послуги</span>
                    <h1 id="hero-title" class="display">
                        Спокійні пояснення про тривогу, стрес та сон
                    </h1>
                    <p class="lead">
                        Онлайн-роз’яснення від <strong>Скрипник Ірини</strong> — зрозуміло та професійно.
                        <span class="muted d-block">Не є медичною послугою і не замінює очний прийом лікаря.</span>
                    </p>
                    <div class="cta">
                        <a routerLink="/publichnyi-dogovir" class="btn btn--primary">Публічний договір</a>
                        <a href="#topics" class="btn btn--ghost">До роз’яснень</a>
                    </div>
                </div>
                <div class="hero__art" aria-hidden="true">
                    <div class="wave w1"></div>
                    <div class="wave w2"></div>
                </div>
            </section>

            <!-- ABOUT -->
            <section class="about container" aria-labelledby="about-title">
                <div class="about__media">
                    <figure class="portrait" aria-label="Фото спеціалістки Скрипник Ірини">
                        <img
                                src="assets/iryna-skrypnyk.jpg"
                                alt="Скрипник Ірина — інформаційні послуги у сфері ментального здоров’я"
                                width="720" height="720"
                                loading="lazy" decoding="async"
                        />
                    </figure>
                </div>
                <div class="about__text">
                    <h2 id="about-title" class="h2">Про Скрипник Ірину</h2>
                    <p>Професіонал з багаторічним досвідом у сфері ментального здоров’я. Допомагає зрозуміти тривогу, панічні атаки та порушення сну, щоб повернути відчуття контролю над собою.</p>
                    <p>Пояснення прості, зрозумілі та практичні, готують до продуктивної очної консультації. За потреби Ірина може порекомендувати запис до психолога для подальшої роботи.</p>
                </div>
            </section>

            <!-- SERVICES -->
            <section class="section container" id="services" aria-labelledby="services-title">
                <header class="section__header">
                    <h2 id="services-title" class="h2">Послуги (інформаційні)</h2>
                    <p class="muted">Без діагностики та лікування. Структуровані роз’яснення та підготовка до візиту.</p>
                </header>
                <div class="steps">
                    <article class="step">
                        <div class="step__no">1</div>
                        <div class="step__body">
                            <h3 class="h4">Базове роз’яснення</h3>
                            <ul class="list">
                                <li>Збір запиту та уточнення контексту</li>
                                <li>Пояснення термінів і симптомів</li>
                                <li>Відповіді у межах інформування</li>
                                <li>Рекомендації для підготовки до візиту</li>
                            </ul>
                            <a routerLink="/publichnyi-dogovir" class="btn btn--line">Деталі</a>
                        </div>
                    </article>
                    <article class="step">
                        <div class="step__no">2</div>
                        <div class="step__body">
                            <h3 class="h4">Поглиблене роз’яснення</h3>
                            <ul class="list">
                                <li>Огляд симптомів і факторів</li>
                                <li>Типові помилки у самооцінці</li>
                                <li>Питання-відповіді для лікаря</li>
                                <li>Індивідуальні нотатки</li>
                            </ul>
                            <a routerLink="/publichnyi-dogovir" class="btn btn--line">Деталі</a>
                        </div>
                    </article>
                    <article class="step">
                        <div class="step__no">3</div>
                        <div class="step__body">
                            <h3 class="h4">Підготовка до очної консультації</h3>
                            <ul class="list">
                                <li>Опис симптомів та тригерів</li>
                                <li>Питання для лікаря</li>
                                <li>Що брати із собою (аналізи/виписки)</li>
                                <li>Як відстежувати зміни стану</li>
                            </ul>
                            <a routerLink="/publichnyi-dogovir" class="btn btn--line">Деталі</a>
                        </div>
                    </article>
                </div>
            </section>

            <!-- 1) TOPICS -->
            <section class="section container" id="topics" aria-labelledby="topics-title">
                <header class="section__header">
                    <h2 id="topics-title" class="h2">Основні теми</h2>
                    <p class="muted">Обирайте тему, яка найбільше відгукується зараз.</p>
                </header>
                <div class="topics">
                    <article class="topic">
                        <div class="topic__icon" aria-hidden="true">🌙</div>
                        <h3 class="h4">Сон</h3>
                        <p class="muted">Гігієна сну, ритуали засинання, пробудження без тривоги.</p>
                    </article>
                    <article class="topic">
                        <div class="topic__icon" aria-hidden="true">💙</div>
                        <h3 class="h4">Тривога</h3>
                        <p class="muted">Як працює тривожна реакція та що можна робити зараз.</p>
                    </article>
                    <article class="topic">
                        <div class="topic__icon" aria-hidden="true">🫁</div>
                        <h3 class="h4">Панічні атаки</h3>
                        <p class="muted">Що це, як розпізнати та чим допомогти собі у моменті.</p>
                    </article>
                    <article class="topic">
                        <div class="topic__icon" aria-hidden="true">⚖️</div>
                        <h3 class="h4">Стрес</h3>
                        <p class="muted">Ознаки перевантаження та базові способи регуляції.</p>
                    </article>
                    <article class="topic">
                        <div class="topic__icon" aria-hidden="true">🧭</div>
                        <h3 class="h4">Підготовка до візиту</h3>
                        <p class="muted">Список питань, нотатки, як описати симптоми.</p>
                    </article>
                    <article class="topic">
                        <div class="topic__icon" aria-hidden="true">🧘</div>
                        <h3 class="h4">Практики самодопомоги</h3>
                        <p class="muted">Дихання, заземлення, щоденні мікроритуали.</p>
                    </article>
                </div>
            </section>

            <!-- 2) HOW IT WORKS -->
            <section class="section container" id="process" aria-labelledby="process-title">
                <header class="section__header">
                    <h2 id="process-title" class="h2">Як це відбувається</h2>
                    <p class="muted">Простий і зрозумілий процес у кілька кроків.</p>
                </header>
                <ol class="timeline" aria-label="Етапи роботи">
                    <li class="timeline__item">
                        <div class="dot" aria-hidden="true"></div>
                        <div class="timeline__content">
                            <h3 class="h4">1. Короткий запит</h3>
                            <p>Ви формулюєте, що турбує і чого очікуєте від роз’яснення.</p>
                        </div>
                    </li>
                    <li class="timeline__item">
                        <div class="dot" aria-hidden="true"></div>
                        <div class="timeline__content">
                            <h3 class="h4">2. Узгодження формату</h3>
                            <p>Обираємо тему, приблизний час та формат комунікації.</p>
                        </div>
                    </li>
                    <li class="timeline__item">
                        <div class="dot" aria-hidden="true"></div>
                        <div class="timeline__content">
                            <h3 class="h4">3. Роз’яснення</h3>
                            <p>Структуровано, без діагнозів і призначень. Лише інформація та орієнтири.</p>
                        </div>
                    </li>
                    <li class="timeline__item">
                        <div class="dot" aria-hidden="true"></div>
                        <div class="timeline__content">
                            <h3 class="h4">4. Нотатки та підсумки</h3>
                            <p>Ви отримуєте ключові тези та чек-лист підготовки до візиту.</p>
                        </div>
                    </li>
                </ol>
            </section>

            <!-- 3) REVIEWS -->
            <section class="section container" id="reviews" aria-labelledby="reviews-title">
                <header class="section__header">
                    <h2 id="reviews-title" class="h2">Відгуки</h2>
                    <p class="muted">Анонімізовані приклади вражень клієнтів про формат роз’яснень.</p>
                </header>
                <div class="reviews">
                    <figure class="review">
                        <div class="stars" aria-label="Оцінка 5 з 5">★★★★★</div>
                        <blockquote>“Вперше зрозуміла, що зі мною відбувається під час панічних атак. Стало спокійніше.”</blockquote>
                        <figcaption>— О., 29 років</figcaption>
                    </figure>
                    <figure class="review">
                        <div class="stars" aria-label="Оцінка 5 з 5">★★★★★</div>
                        <blockquote>“Чітко, без води. Отримав список питань для лікаря — стало простіше готуватися.”</blockquote>
                        <figcaption>— М., 34 роки</figcaption>
                    </figure>
                    <figure class="review">
                        <div class="stars" aria-label="Оцінка 4 з 5">★★★★☆</div>
                        <blockquote>“Корисні приклади і практики на кожен день. Особливо про сон.”</blockquote>
                        <figcaption>— Н., 42 роки</figcaption>
                    </figure>
                </div>
            </section>

            <!-- 4) FAQ / ACCORDION -->
            <section class="section container" id="faq" aria-labelledby="faq-title">
                <header class="section__header">
                    <h2 id="faq-title" class="h2">Поширені запитання</h2>
                </header>

                <details class="accordion" role="group">
                    <summary class="accordion__summary">Чи це лікування?</summary>
                    <div class="accordion__panel">
                        Це інформування. Немає діагнозів, рецептів чи призначень. Мета — зрозуміти свій стан і підготуватися до очної консультації.
                    </div>
                </details>

                <details class="accordion" role="group">
                    <summary class="accordion__summary">Чи потрібні попередні аналізи?</summary>
                    <div class="accordion__panel">
                        Ні. Якщо маєте виписки чи записи симптомів — візьміть із собою: це допоможе сформулювати запит.
                    </div>
                </details>

                <details class="accordion" role="group">
                    <summary class="accordion__summary">Скільки триває роз’яснення?</summary>
                    <div class="accordion__panel">
                        Зазвичай 30–45 хвилин, залежно від теми та кількості запитань.
                    </div>
                </details>

                <details class="accordion" role="group">
                    <summary class="accordion__summary">Як підготуватися?</summary>
                    <div class="accordion__panel">
                        Запишіть основні симптоми, тригери, коли/як проявляються, та 3–5 ключових питань до лікаря.
                    </div>
                </details>

                <details class="accordion" role="group">
                    <summary class="accordion__summary">Як відбувається оплата?</summary>
                    <div class="accordion__panel">
                        Умови та деталі зазначені у <a routerLink="/publichnyi-dogovir">Публічному договорі</a>.
                    </div>
                </details>
            </section>
        </div>
        <!-- 5) CTA BANNER -->
        <section class="cta-banner" aria-labelledby="cta-banner-title">
            <div class="cta-banner__inner container">
                <h2 id="cta-banner-title" class="h2">Готові розібратися спокійно та по суті?</h2>
                <p class="muted">Оберіть тему, сформулюйте 3–5 питань — і розпочнемо. Або запишіться до психолога для глибшої роботи.</p>
                <div class="cta">
                    <a href="#topics" class="btn btn--ghost">Обрати тему</a>
                    <a routerLink="/book-psychologist" class="btn btn--primary">Запис до психолога</a>
                    <a routerLink="/publichnyi-dogovir" class="btn btn--primary">Перейти до договору</a>
                </div>
            </div>
        </section>
    `,
    styles: [`
      :host {
        --bg: #f5faff;
        --surface: #ffffff;
        --surface-2: #fbfdff;
        --ink: #0f2433;
        --muted: #5c6b7c;
        --line: #d1e3f0;
        --brand: #3fa9f5;
        --brand-2: #70c1ff;
        --ghost: #e6f2ff;
        --shadow-sm: 0 2px 6px rgba(0,0,0,0.08);
        --shadow-md: 0 10px 30px rgba(24,50,77,0.16);
        --ring: 0 0 0 3px rgba(63,169,245,0.35);

        display: block;
        background: var(--bg);
        color: var(--ink);
        font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
      }

      .container { max-width:1080px; margin:0 auto; padding:0 20px; }

      /* TYPOGRAPHY */
      .display { font-size:clamp(32px,5vw,56px); line-height:1.08; margin:10px 0 14px; letter-spacing:-0.015em; }
      .lead { font-size:18px; color: var(--muted); line-height:1.65; }
      .h2 { font-size:clamp(22px,3vw,32px); margin:0 0 8px; letter-spacing:-0.01em; }
      .h4 { font-size:18px; margin:0; }
      .muted { color:var(--muted); }
      .eyebrow { font-weight:600; font-size:12px; text-transform:uppercase; color:var(--brand); letter-spacing:.12em; }

      /* HERO */
   
        .hero { text-align:center; padding:80px 0 40px; position:relative; } .cta { display:flex; justify-content:center; gap:12px; flex-wrap:wrap; margin-top:20px; } .hero__art { position:relative; height:180px; margin-top:30px; } .wave { position:absolute; width:200px; height:80px; border-radius:40px; background:var(--brand-2); opacity:0.4; } .w1 { left:10%; top:10px; } .w2 { right:15%; top:50px; }
      .cta { display:flex; justify-content:center; gap:12px; flex-wrap:wrap; margin-top:22px; }
      .hero__content { position: relative; z-index: 2; }
      .hero__art { position: relative; height: 220px; margin-top: 36px; filter: saturate(110%); }

      /* Soft floating blobs */
      .wave {
        position:absolute; width: 260px; height: 260px; border-radius: 50%;
        background: linear-gradient(135deg, var(--brand), var(--brand-2));
        opacity: .35; filter: blur(8px);
        animation: floaty 12s ease-in-out infinite alternate;
      }
      .w1 { left: 12%; top: -10px; transform: translateZ(0); }
      .w2 { right: 14%; top: 30px; animation-delay: 1.2s; }
      @keyframes floaty {
        0%   { transform: translateY(0) translateX(0) scale(1); opacity:.35; }
        100% { transform: translateY(-16px) translateX(8px) scale(1.05); opacity:.5; }
      }
      @media (prefers-reduced-motion: reduce) { .wave { animation: none; } }

      /* ABOUT */
      .about { display:grid; grid-template-columns:1fr 1.2fr; gap:32px; align-items:center; padding:48px 0 8px; }
      .portrait { width:100%; max-width:360px; border-radius:22px; overflow:hidden; border:1px solid var(--line); box-shadow:var(--shadow-md); background: var(--surface); }
      .portrait img { width:100%; height:100%; object-fit:cover; display:block; transition: transform .35s ease; }
      @media (hover:hover) { .portrait:hover img { transform:scale(1.03); } }
      @media (max-width:960px) { .about { grid-template-columns:1fr; text-align:center; } }

      /* SECTION WRAPPER */
      .section { padding: 40px 0 64px; }
      .section__header { margin-bottom: 18px; }

      /* SERVICES — Card grid */
      .steps {
        display: grid;
        grid-template-columns: repeat(3, minmax(0,1fr));
        gap: 20px;
        align-items: stretch;
      }
      @media (max-width: 960px) { .steps { grid-template-columns: 1fr; } }

      .step {
        position: relative;
        background: linear-gradient(180deg, var(--surface), var(--surface-2));
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 28px 22px 22px;
        box-shadow: var(--shadow-sm);
        transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease;
        will-change: transform;
      }
      .step:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
        border-color: rgba(63,169,245,.45);
        background: linear-gradient(180deg, var(--surface), #f7fbff);
      }
      .step__no {
        position: absolute; top: -16px; left: 18px;
        width: 42px; height: 42px; border-radius: 50%;
        display: grid; place-items: center; font-weight: 800; font-size: 16px; color: #fff;
        background: linear-gradient(180deg, var(--brand), var(--brand-2));
        box-shadow: 0 8px 24px rgba(63,169,245,.35);
      }
      .step__body h3 { margin: 10px 0 10px; letter-spacing:-0.01em; }
      .list { margin: 8px 0 14px; padding-left: 18px; color: var(--ink); }
      .list li { margin: 6px 0; line-height: 1.5; }

      /* TOPICS */
      .topics {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
      }
      @media (max-width: 960px) { .topics { grid-template-columns: 1fr; } }
      .topic {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 18px;
        transition: box-shadow .2s ease, transform .2s ease, border-color .2s ease;
      }
      .topic:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: rgba(63,169,245,.45); }
      .topic__icon { font-size: 28px; line-height: 1; margin-bottom: 8px; }

      /* TIMELINE */
      .timeline { list-style: none; margin: 0; padding: 0; border-left: 2px dashed var(--line); }
      .timeline__item { position: relative; padding-left: 22px; margin: 18px 0; }
      .timeline__item .dot {
        position: absolute; left: -7px; top: 4px; width: 12px; height: 12px; border-radius: 50%;
        background: var(--brand); box-shadow: 0 0 0 3px rgba(63,169,245, .18);
      }
      .timeline__content p { margin: 6px 0 0; color: var(--muted); }

      /* REVIEWS */
      .reviews {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
      }
      @media (max-width: 960px) { .reviews { grid-template-columns: 1fr; } }
      .review {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 18px;
        box-shadow: var(--shadow-sm);
      }
      .review blockquote { margin: 10px 0; line-height: 1.5; }
      .review figcaption { color: var(--muted); font-size: 14px; }
      .stars { letter-spacing: 2px; }

      /* ACCORDION */
      .accordion {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 0;
        margin-bottom: 10px;
        overflow: hidden;
      }
      .accordion__summary {
        position: relative;
        cursor: pointer;
        list-style: none;
        padding: 14px 18px;
        font-weight: 600;
        outline: none;
      }
      .accordion__summary::-webkit-details-marker { display: none; }
      .accordion__summary:after {
        content: '▾'; position: absolute; right: 18px; top: 50%; transform: translateY(-50%) rotate(0deg);
        transition: transform .2s ease;
      }
      .accordion[open] .accordion__summary:after { transform: translateY(-50%) rotate(180deg); }
      .accordion__summary:focus-visible { box-shadow: var(--ring); }
      .accordion__panel { padding: 0 18px 16px; color: var(--muted); }

      /* CTA BANNER */
      .cta-banner {
        background:
                radial-gradient(600px 300px at 10% 10%, #d9efff, transparent 60%),
                radial-gradient(600px 300px at 90% 0%, #cfe9ff, transparent 60%),
                linear-gradient(180deg, #f3f9ff, #eef6ff);
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
        padding: 40px 0;
      }
      .cta-banner__inner { text-align: center; }
      .cta-banner .cta { margin-top: 14px; }

      /* BUTTONS */
      .btn {
        padding:12px 22px;
        border-radius:12px;
        font-weight:600;
        border:1px solid transparent;
        text-decoration:none;
        transition:.2s ease;
        display:inline-block;
        outline: none;
      }
      .btn:hover { transform:translateY(-2px); box-shadow:var(--shadow-md); }
      .btn:focus-visible { box-shadow: var(--ring); }

      .btn--primary { background:var(--brand); color:#fff; }
      .btn--ghost { background:var(--ghost); color:var(--brand); border:1px solid var(--brand); }
      .btn--line   { background:transparent; border:1px solid var(--line); color: var(--ink); }
      .btn--line:hover { border-color: rgba(63,169,245,.6); color: var(--brand); }
    `]
})
export class Home {
    constructor(private title: Title) {
        this.title.setTitle('Скрипник Ірина — Інформаційні послуги з ментального здоров’я');
    }
}
