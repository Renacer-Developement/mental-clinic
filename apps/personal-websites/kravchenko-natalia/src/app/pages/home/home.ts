import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink],
    template: `
        <div class="shell">
            <!-- HERO (centered, airy, soft-pink) -->
            <section class="hero container" aria-labelledby="hero-title">
                <div class="hero__content">
                    <span class="eyebrow">Інформаційні роз’яснення</span>
                    <h1 id="hero-title" class="display">Спокійні пояснення про тривогу, панічні атаки, сон і стрес</h1>
                    <p class="lead">
                        Онлайн‑роз’яснення від <strong>Кравченко Наталії</strong> — простою мовою, без діагнозів і рецептів.
                        <span class="muted d-block">Це не медична послуга і не замінює очний прийом лікаря.</span>
                        <span class="muted d-block">Також доступний запис до психолога для глибшого супроводу.</span>
                    </p>
                    <div class="cta">
                        <a routerLink="/publichnyi-dogovir" class="btn btn--primary">Публічний договір</a>
                        <a href="#topics" class="btn btn--ghost">До роз’яснень</a>
                        <a routerLink="/book-psychologist" class="btn btn--primary">Запис до психолога</a>
                    </div>
                </div>
                <div class="hero__art" aria-hidden="true">
                    <div class="blob b1"></div>
                    <div class="blob b2"></div>
                    <div class="blob b3"></div>
                </div>
            </section>

            <!-- HIGHLIGHTS ribbon -->
            <section class="ribbon container" aria-label="Основні переваги">
                <div class="pill">
                    <span class="dot">●</span> Лише інформування
                </div>
                <div class="pill">
                    <span class="dot">●</span> Проста мова
                </div>
                <div class="pill">
                    <span class="dot">●</span> Підготовка до очного візиту
                </div>
                <div class="pill">
                    <span class="dot">●</span> Запис до психолога
                </div>
            </section>

            <!-- ABOUT (light card) -->
            <section class="about container" aria-labelledby="about-title">
                <div class="about__media">
                    <figure class="portrait" aria-label="Фото спеціалістки Кравченко Наталії">
                        <img
                                src="assets/nataliia-kravchenko.jpg"
                                alt="Кравченко Наталія — інформаційні роз’яснення у сфері ментального здоров’я"
                                width="720"
                                height="720"
                                loading="lazy"
                                decoding="async"
                        />
                    </figure>
                </div>
                <div class="about__text">
                    <h2 id="about-title" class="h2">Про Кравченко Наталію</h2>
                    <p>
                        Професіонал з багаторічним досвідом, яка допомагає людям розібратися у своєму стані — зрозуміти, чому з’являється тривога, як відрізнити панічну атаку від серцевого нападу та як повернути відчуття контролю над собою.
                    </p>
                    <p>
                        Пояснення — зрозуміло, без складної термінології. Мета — дати ясність і підготувати до продуктивної очної консультації. Також доступний запис до психолога для індивідуального супроводу.
                    </p>
                </div>
            </section>

            <!-- SERVICES (numbered cards) -->
            <section class="section container" id="services" aria-labelledby="services-title">
                <header class="section__header">
                    <h2 id="services-title" class="h2">Послуги (інформаційні)</h2>
                    <p class="muted">Без діагностики та лікування. Структуровані роз’яснення, підготовка до візиту та супровід психолога.</p>
                </header>
                <div class="steps">
                    <article class="step">
                        <div class="step__no">1</div>
                        <div class="step__body">
                            <h3 class="h4">Базове роз’яснення</h3>
                            <ul class="list">
                                <li>Збір запиту та уточнення контексту</li>
                                <li>Пояснення термінів і типових проявів</li>
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
                                <li>Огляд теми: симптоми, фактори, міфи</li>
                                <li>Типові помилки у самооцінці стану</li>
                                <li>Питання‑відповіді, формулювання для лікаря</li>
                                <li>Індивідуальні нотатки за підсумком</li>
                            </ul>
                            <a routerLink="/publichnyi-dogovir" class="btn btn--line">Деталі</a>
                        </div>
                    </article>
                    <article class="step">
                        <div class="step__no">3</div>
                        <div class="step__body">
                            <h3 class="h4">Підготовка до очної консультації</h3>
                            <ul class="list">
                                <li>Як описати симптоми, тригери, тривалість</li>
                                <li>Питання для лікаря</li>
                                <li>Що взяти із собою (аналізи/виписки)</li>
                                <li>Як відстежувати зміни стану</li>
                            </ul>
                            <a routerLink="/publichnyi-dogovir" class="btn btn--line">Деталі</a>
                        </div>
                    </article>
                    <article class="step">
                        <div class="step__no">4</div>
                        <div class="step__body">
                            <h3 class="h4">Запис до психолога</h3>
                            <ul class="list">
                                <li>Індивідуальний супровід з психологом</li>
                                <li>Обговорення особистих запитів і цілей</li>
                                <li>Поради щодо роботи з емоціями</li>
                                <li>Підготовка до довгострокового супроводу</li>
                            </ul>
                            <a routerLink="/book-psychologist" class="btn btn--line">Деталі</a>
                        </div>
                    </article>
                </div>
            </section>

            <!-- TOPICS (soft tiles) -->
            <section id="topics" class="topics container" aria-labelledby="topics-title">
                <h2 id="topics-title" class="h2">Основні напрямки роз’яснень</h2>
                <div class="topics__grid" role="list">
                    <div class="tile" role="listitem">
                        <h3 class="h5">Панічні атаки</h3>
                        <p>Що це, як діяти під час нападу і як зменшити страх повторення.</p>
                    </div>
                    <div class="tile" role="listitem">
                        <h3 class="h5">Тривожні розлади</h3>
                        <p>Як розпізнати хронічну тривогу і відрізнити її від звичайного хвилювання.</p>
                    </div>
                    <div class="tile" role="listitem">
                        <h3 class="h5">Порушення сну</h3>
                        <p>Як відновити здоровий режим сну без зайвого занепокоєння.</p>
                    </div>
                    <div class="tile" role="listitem">
                        <h3 class="h5">Депресивні стани</h3>
                        <p>Емоційне виснаження та коли звертатися по фахову допомогу.</p>
                    </div>
                    <div class="tile" role="listitem">
                        <h3 class="h5">Психосоматика</h3>
                        <p>Як емоції проявляються через тіло: біль, напруга, дискомфорт.</p>
                    </div>
                </div>
            </section>

            <!-- FAQ -->
            <section class="faq container" aria-labelledby="faq-title">
                <h2 id="faq-title" class="h2">Питання‑відповіді</h2>
                <details>
                    <summary>Чи ставите ви діагнози або призначаєте лікування?</summary>
                    <p>Ні. Це інформаційні послуги без діагностики і лікування.</p>
                </details>
                <details>
                    <summary>Що отримаю після сесії?</summary>
                    <p>Зрозумілі пояснення вашого запиту та нотатки, що варто обговорити з лікарем очно.</p>
                </details>
                <details>
                    <summary>Чим відрізняється запис до психолога від інформаційних послуг?</summary>
                    <p>Інформаційні послуги надають пояснення та підготовку до візиту, тоді як запис до психолога передбачає індивідуальний супровід для роботи з емоціями та особистими запитами.</p>
                </details>
                <details>
                    <summary>Коли потрібно терміново звертатися по допомогу?</summary>
                    <p>При різкому погіршенні стану, вираженому самопошкодженні, суїцидальних думках/планах — 103 або найближчий стаціонар.</p>
                </details>
            </section>

            <!-- TESTIMONIALS -->
            <section class="testimonials container" aria-labelledby="testimonials-title">
                <h2 id="testimonials-title" class="h2">Відгуки клієнтів</h2>
                <div class="quotes">
                    <figure class="q">
                        <blockquote>“Після консультації я вперше спокійно пережила панічну атаку. Дякую за чітке пояснення.”</blockquote>
                        <figcaption>— Марина, 28 років</figcaption>
                    </figure>
                    <figure class="q">
                        <blockquote>“Дуже спокійна і чуйна спеціалістка. Усе простою мовою, без осуду.”</blockquote>
                        <figcaption>— Олег, 35 років</figcaption>
                    </figure>
                    <figure class="q">
                        <blockquote>“З зрозуміла, що зі мною нічого страшного. Після розмови страх зник.”</blockquote>
                        <figcaption>— Аліна, 24 роки</figcaption>
                    </figure>
                    <figure class="q">
                        <blockquote>“Пояснення панічних атак змінило моє ставлення до них. Тепер не панікую.”</blockquote>
                        <figcaption>— Ігор, 41 рік</figcaption>
                    </figure>
                </div>
            </section>

            <!-- CTA (soft card) -->
            <section class="cta container" aria-labelledby="cta-title">
                <h2 id="cta-title" class="h2">Готові зробити перший крок?</h2>
                <p>Опишіть коротко ситуацію — <strong>Кравченко Наталія</strong> допоможе розібратись. Або запишіться до психолога для індивідуального супроводу.</p>
                <div class="cta__actions">
                    <a routerLink="/publichnyi-dogovir" class="btn btn--primary">Публічний договір</a>
                    <a class="btn btn--ghost" href="tel:+380666760629">Номер для запису: +380 96 156 24 83</a>
                    <a routerLink="/book-psychologist" class="btn btn--primary">Запис до психолога</a>
                </div>
                <small class="muted">Це інформаційна послуга, не медична консультація.</small>
            </section>
        </div>
    `,
    styles: [`
      /* ------------------ LIGHT ROSE THEME ------------------ */
      :host{
        --bg:#fff8fb;           /* blush background */
        --surface:#ffffff;      /* white cards */
        --ink:#2b2433;          /* deep plum text */
        --muted:#7f7187;        /* lavender gray */
        --line:#f2e7ef;         /* soft border */
        --brand:#e94b8e;        /* rose */
        --brand-2:#ff7bbd;      /* light rose */
        --brand-3:#ffe3f1;      /* very light rose */
        --ghost:#fff3f8;        /* subtle tint */

        --shadow-sm:0 2px 8px rgba(46,15,30,.06);
        --shadow-md:0 10px 28px rgba(46,15,30,.12);
        --ring:0 0 0 3px color-mix(in srgb, var(--brand) 35%, transparent);

        display:block; background:var(--bg); color:var(--ink);
        font-family:"Inter", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
        -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
        text-rendering:optimizeLegibility; accent-color:var(--brand);
      }

      .container{ max-width:1080px; margin:0 auto; padding:0 20px; }

      /* ------------------ TYPOGRAPHY ------------------ */
      .display{ font-size:clamp(34px,5.5vw,60px); line-height:1.06; letter-spacing:.2px; margin:10px 0 14px; }
      .lead{ font-size:18px; color:var(--muted); line-height:1.7; }
      .h2{ font-size:clamp(24px,3.2vw,34px); margin:0 0 8px; }
      .h4{ font-size:18px; margin:0; }
      .h5{ font-size:16px; margin:0 0 4px; }
      .muted{ color:var(--muted); }
      .d-block{ display:block; }
      .eyebrow{ font-weight:700; font-size:12px; letter-spacing:.5px; text-transform:uppercase; color:#a64b6f; }

      /* ------------------ HERO ------------------ */
      .hero{ position:relative; padding:84px 0 32px; text-align:center; }
      .hero__content{ position:relative; z-index:2; }
      .hero__art{ position:relative; height:220px; margin-top:22px; }
      .blob{ position:absolute; filter:blur(30px); border-radius:50%; opacity:.65; }
      .b1{ width:200px; height:200px; left:10%; top:10px; background:radial-gradient(circle at 30% 30%, var(--brand-2), var(--brand)); }
      .b2{ width:260px; height:260px; right:8%; top:-10px; background:radial-gradient(circle at 60% 40%, var(--brand-3), var(--brand-2)); opacity:.7; }
      .b3{ width:160px; height:160px; left:40%; top:60px; background:radial-gradient(circle at 50% 50%, #fff, var(--brand-3)); opacity:.8; }

      .cta{ margin-top:18px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }

      /* ------------------ RIBBON ------------------ */
      .ribbon{ display:flex; gap:10px; justify-content:center; flex-wrap:wrap; padding:8px 0 36px; }
      .pill{ display:inline-flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--line); padding:10px 14px; border-radius:999px; box-shadow:var(--shadow-sm); }
      .pill .dot{ color:var(--brand); font-size:16px; }

      /* ------------------ ABOUT ------------------ */
      .about{ display:grid; grid-template-columns:.9fr 1.1fr; gap:32px; align-items:center; padding:14px 0 56px; }
      .about__text p{ color:var(--muted); line-height:1.75; }
      .about__media{ display:flex; justify-content:center; }
      .portrait{ width:100%; max-width:360px; aspect-ratio:1/1; border-radius:24px; background:
              radial-gradient(220px 220px at 70% 20%, var(--brand-3), #fff),
              radial-gradient(220px 220px at 30% 80%, #fff, var(--brand-3));
        border:1px solid var(--line); box-shadow:var(--shadow-md);
      }

      /* ------------------ SERVICES as steps ------------------ */
      .section{ padding: 8px 0 0; }
      .section__header{ text-align:center; margin-bottom:14px; }
      .steps{ display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:16px; margin-top:10px; }
      .step{ display:grid; grid-template-columns:auto 1fr; gap:12px; align-items:flex-start; background:var(--surface); border:1px solid var(--line); border-radius:18px; padding:16px; box-shadow:var(--shadow-sm); }
      .step__no{ width:38px; height:38px; border-radius:999px; display:grid; place-items:center; font-weight:700; background:linear-gradient(180deg, var(--brand-2), var(--brand)); color:#fff; box-shadow:var(--shadow-sm); }
      .list{ margin:8px 0 12px; padding-left:18px; }

      /* ------------------ TOPICS ------------------ */
      .topics{ padding:44px 0; }
      .topics__grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:14px; margin-top:12px; }
      .tile{ background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:16px; box-shadow:var(--shadow-sm); transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
      .tile:hover{ transform:translateY(-2px); box-shadow:var(--shadow-md); border-color: color-mix(in srgb, var(--brand) 28%, var(--line)); }
      .tile p{ color:var(--muted); margin:6px 0 0; }

      /* ------------------ FAQ ------------------ */
      .faq details{ background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:14px 16px; box-shadow:var(--shadow-sm); }
      .faq details + details{ margin-top:12px; }
      .faq summary{ cursor:pointer; list-style:none; font-weight:600; outline:none; }
      .faq summary::-webkit-details-marker{ display:none; }
      .faq summary::after{ content:"›"; float:right; transform:rotate(90deg); transition:transform .18s ease; opacity:.55; }
      .faq details[open] summary::after{ transform:rotate(-90deg); opacity:.85; }
      .faq p{ margin:10px 0 0; color:var(--muted); }

      /* ------------------ TESTIMONIALS ------------------ */
      .testimonials{ padding:44px 0 8px; }
      .quotes{ display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:14px; }
      .q{ margin:0; }
      .q blockquote{ margin:0; padding:16px 16px 12px; border-radius:18px; border:1px solid var(--line); background:linear-gradient(180deg, #fff, var(--ghost)); box-shadow:var(--shadow-sm); position:relative; }
      .q blockquote:before{ content:""; position:absolute; inset:0 0 auto 0; height:6px; border-radius:18px 18px 0 0; background:linear-gradient(90deg, var(--brand), var(--brand-2)); }
      .q figcaption{ margin-top:8px; color:var(--muted); font-size:14px; }

      /* ------------------ CTA ------------------ */
      .cta{ text-align:center; padding:56px 0 80px; }
      .cta__actions{ margin-top:12px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }

      /* ------------------ BUTTONS ------------------ */
      .btn{ display:inline-block; padding:12px 20px; border-radius:14px; font-weight:600; line-height:1; border:1px solid transparent; text-decoration:none; transition:transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease, color .18s ease; will-change:transform; box-shadow:var(--shadow-sm); }
      .btn:focus-visible{ outline:none; box-shadow:var(--ring), var(--shadow-sm); }
      .btn--primary{ color:#ffffff; background:linear-gradient(180deg, color-mix(in srgb, var(--brand) 88%, white 12%), var(--brand)); border-color: color-mix(in srgb, var(--brand) 55%, transparent); }
      .btn--primary:hover{ transform:translateY(-2px); box-shadow:var(--shadow-md); }
      .btn--ghost{ background:var(--surface); border:1px solid var(--line); color:var(--ink); }
      .btn--ghost:hover{ transform:translateY(-2px); box-shadow:var(--shadow-md); border-color: color-mix(in srgb, var(--brand) 35%, var(--line)); }
      .btn--line{ background:transparent; color:var(--ink); border:1px solid var(--line); }
      .btn--line:hover{ transform:translateY(-2px); border-color: color-mix(in srgb, var(--brand) 40%, var(--line)); box-shadow:var(--shadow-md); }

      /* ------------------ ACCESSIBILITY & RESPONSIVE ------------------ */
      a:focus-visible, button:focus-visible, [tabindex]:focus-visible { outline:none; box-shadow:var(--ring); border-radius:12px; }
      /* Контейнер фото: повністю флюїдний, але з розумними межами */
      .portrait{
        width: clamp(220px, 40vw, 520px);  /* ← адаптивна ширина */
        aspect-ratio: 1 / 1;               /* квадратна форма */
        border-radius: 24px;
        overflow: hidden;
        border: 1px solid var(--line);
        box-shadow: var(--shadow-md);
        background:
                radial-gradient(220px 220px at 70% 20%, var(--brand-3), #fff),
                radial-gradient(220px 220px at 30% 80%, #fff, var(--brand-3));
      }

      /* Зображення заповнює картку і акуратно кропиться */
      .portrait img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform .25s ease;
      }
      @media (hover:hover){
        .portrait:hover img{ transform: scale(1.02); }
      }

      /* На дуже вузьких екранах — трохи ширше */
      @media (max-width: 700px){
        .portrait{ width: min(82vw, 520px); }
      }

      @media (max-width:960px){
        .about{ grid-template-columns:1fr; }
      }

      @media (prefers-reduced-motion: reduce){
        *{ animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; }
      }
    `]
})
export class Home {
    constructor(private title: Title) {
        this.title.setTitle('Кравченко Наталія — Інформаційні послуги з ментального здоров’я');
    }
}