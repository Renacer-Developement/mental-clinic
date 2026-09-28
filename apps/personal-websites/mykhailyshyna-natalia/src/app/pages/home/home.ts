import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink],
    template: `
        <div class="shell container">
            <!-- HERO: split grid (text | photo), clinical banner -->
            <section class="hero container" aria-labelledby="hero-title">
                <div class="hero__grid">
                    <div class="hero__content">
                        <span class="eyebrow">Інформаційні роз’яснення</span>
                        <h1 id="hero-title" class="display">
                            Спокійні пояснення про тривогу, панічні атаки, сон і стрес
                        </h1>
                        <p class="lead">
                            Онлайн-роз’яснення від <strong>Михайлишин Наталії</strong> — простою мовою, без діагнозів і рецептів.
                            <span class="muted d-block">Це не медична послуга і не замінює очний прийом лікаря чи консультацію психолога.</span>
                            <span class="muted d-block">Можливість запису до психолога для подальшої підтримки.</span>
                        </p>
                        <div class="cta">
                            <a routerLink="/publichnyi-dogovir" class="btn btn--primary">Публічний договір</a>
                            <a routerLink="/book-psychologist" class="btn btn--ghost">Запис до психолога</a>
                        </div>
                    </div>

                    <figure class="hero__media" aria-label="Фото спеціалістки">
                        <img
                                src="assets/mykhilyshyna.jpg"
                                alt="Михайлишина Наталія — інформаційні роз’яснення у сфері ментального здоров’я"
                                width="720" height="720" loading="lazy" decoding="async"/>
                    </figure>
                </div>
            </section>

            <!-- QUICK FACTS: compact clinical bar -->
            <section class="facts container" aria-label="Основні принципи">
                <div class="fact"><span class="badge" aria-hidden="true"></span> Лише інформування</div>
                <div class="fact"><span class="badge" aria-hidden="true"></span> Проста мова</div>
                <div class="fact"><span class="badge" aria-hidden="true"></span> Підготовка до очного візиту</div>
            </section>

            <!-- TOPICS first (prominent) -->
            <section id="topics" class="topics container" aria-labelledby="topics-title">
                <header class="section__header">
                    <h2 id="topics-title" class="h2">Основні напрямки роз’яснень</h2>
                    <p class="muted">Сфокусовані пояснення ключових станів і запитів.</p>
                </header>
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

            <!-- SERVICES as TIMELINE -->
            <section class="services container" id="services" aria-labelledby="services-title">
                <header class="section__header">
                    <h2 id="services-title" class="h2">Послуги (інформаційні)</h2>
                    <p class="muted">Структуровані формати: від базового до підготовки до очного візиту.</p>
                </header>

                <ol class="timeline" role="list">
                    <li class="titem">
                        <div class="tmarker" aria-hidden="true">1</div>
                        <div class="tcard">
                            <h3 class="h4">Базове роз’яснення</h3>
                            <ul class="list">
                                <li>Збір запиту та уточнення контексту</li>
                                <li>Пояснення термінів і типових проявів</li>
                                <li>Відповіді у межах інформування</li>
                                <li>Рекомендації для підготовки до візиту</li>
                            </ul>
                            <a routerLink="/publichnyi-dogovir" class="btn btn--line">Деталі</a>
                        </div>
                    </li>

                    <li class="titem">
                        <div class="tmarker" aria-hidden="true">2</div>
                        <div class="tcard">
                            <h3 class="h4">Поглиблене роз’яснення</h3>
                            <ul class="list">
                                <li>Огляд теми: симптоми, фактори, міфи</li>
                                <li>Типові помилки у самооцінці стану</li>
                                <li>Питання-відповіді, формулювання для лікаря</li>
                                <li>Індивідуальні нотатки за підсумком</li>
                            </ul>
                            <a routerLink="/publichnyi-dogovir" class="btn btn--line">Деталі</a>
                        </div>
                    </li>

                    <li class="titem">
                        <div class="tmarker" aria-hidden="true">3</div>
                        <div class="tcard">
                            <h3 class="h4">Підготовка до очної консультації</h3>
                            <ul class="list">
                                <li>Як описати симптоми, тригери, тривалість</li>
                                <li>Питання для лікаря</li>
                                <li>Що взяти із собою (аналізи/виписки)</li>
                                <li>Як відстежувати зміни стану</li>
                            </ul>
                            <a routerLink="/publichnyi-dogovir" class="btn btn--line">Деталі</a>
                        </div>
                    </li>
                </ol>
            </section>

            <!-- ABOUT (inverse / red tint) -->
            <section class="about container inv" aria-labelledby="about-title">
                <div class="about__grid">
                    <div class="about__text">
                        <h2 id="about-title" class="h2">Про Михайлишин Наталію</h2>
                        <p>Професіонал з багаторічним досвідом, яка допомагає людям розібратися у своєму стані — зрозуміти, чому з’являється тривога, як відрізнити панічну атаку від серцевого нападу та як повернути відчуття контролю над собою.</p>
                        <p>Пояснення — зрозуміло, без складної термінології. Мета — дати ясність і підготувати до продуктивної очної консультації. За потреби Наталія може порекомендувати запис до психолога для глибшої роботи.</p>
                    </div>
                </div>
            </section>

            <!-- TESTIMONIALS (plain cards, left red spine) -->
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
                        <blockquote>“Зрозуміла, що зі мною нічого страшного. Після розмови страх зник.”</blockquote>
                        <figcaption>— Аліна, 24 роки</figcaption>
                    </figure>
                    <figure class="q">
                        <blockquote>“Пояснення панічних атак змінило моє ставлення до них. Тепер не панікую.”</blockquote>
                        <figcaption>— Ігор, 41 рік</figcaption>
                    </figure>
                </div>
            </section>

            <!-- FAQ -->
            <section class="faq container" aria-labelledby="faq-title">
                <h2 id="faq-title" class="h2">Питання-відповіді</h2>
                <details>
                    <summary>Чи ставите ви діагнози або призначаєте лікування?</summary>
                    <p>Ні. Це інформаційні послуги без діагностики і лікування.</p>
                </details>
                <details>
                    <summary>Що отримаю після сесії?</summary>
                    <p>Зрозумілі пояснення вашого запиту та нотатки, що варто обговорити з лікарем очно.</p>
                </details>
                <details>
                    <summary>Коли потрібно терміново звертатися по допомогу?</summary>
                    <p>При різкому погіршенні стану, вираженому самопошкодженні, суїцидальних думках/планах — 103 або найближчий стаціонар.</p>
                </details>
                <details>
                    <summary>Чи можу я записатися до психолога?</summary>
                    <p>Так, Наталія може порекомендувати запис до психолога для подальшої підтримки. Для запису скористайтеся <a routerLink="/book-psychologist">формою</a> або зателефонуйте за номером <a href="tel:+380961562483">+380 (97) 133 35 63</a>.</p>
                </details>
            </section>

            <!-- BIG CTA (full inverse band) -->
        </div>
        <section class="cta-band" aria-labelledby="cta-title">
            <div class="container">
                <h2 id="cta-title" class="h2 inv-title">Готові зробити перший крок?</h2>
                <p class="inv-lead">Опишіть коротко ситуацію — <strong>Михайлишина Наталія</strong> допоможе розібратися або запишіться до психолога для глибшої роботи.</p>
                <div class="cta__actions">
                    <a routerLink="/publichnyi-dogovir" class="btn btn--inverted">Публічний договір</a>
                    <a routerLink="/book-psychologist" class="btn btn--inverted">Запис до психолога</a>
                    <a class="btn btn--ghost-inv" href="tel:+380961562483">Номер для запису: +380 (97) 133 35 63</a>
                </div>
                <small class="inv-muted">Це інформаційна послуга, не медична консультація.</small>
            </div>
        </section>
    `,
    styles: [`
      /* ------------------ MEDICAL RED / WHITE THEME (radically new) ------------------ */
      :host{
        --bg:#ffffff;
        --surface:#ffffff;
        --ink:#111827;        /* gray-900 */
        --muted:#6b7280;      /* gray-500 */
        --line:#e5e7eb;       /* gray-200 */

        --med-red:#c8161d;    /* clinical red */
        --med-red-dark:#9f0f14;
        --red-ink:#7a0d11;
        --tint:#fff2f3;       /* red-50 */
        --tint-strong:#ffe6e8;

        --ring:0 0 0 3px color-mix(in srgb, var(--med-red) 28%, transparent);
        --shadow-sm:0 2px 6px rgba(17,24,39,.06);
        --shadow-md:0 10px 24px rgba(17,24,39,.12);

        display:block; background:var(--bg); color:var(--ink);
        font-family:"Inter", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
        -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
        text-rendering:optimizeLegibility; accent-color:var(--med-red);
      }

      .container{ max-width:1120px; margin:0 auto; padding:0 20px; }

      /* ------------------ TYPE ------------------ */
      .display{ font-size:clamp(32px,5.3vw,56px); line-height:1.06; margin:8px 0 12px; }
      .lead{ font-size:18px; color:var(--muted); line-height:1.65; }
      .h2{ font-size:clamp(22px,3.1vw,32px); margin:0 0 8px; }
      .h4{ font-size:18px; margin:0; }
      .h5{ font-size:16px; margin:0 0 4px; }
      .muted{ color:var(--muted); }
      .d-block{ display:block; }
      .eyebrow{ font-weight:800; font-size:11px; letter-spacing:.7px; text-transform:uppercase; color:var(--med-red); }

      /* ------------------ HERO (split) ------------------ */
      .hero{ padding:36px 0 20px; }
      .hero__grid{
        display:grid; grid-template-columns: 1.1fr .9fr; gap:28px; align-items:center;
        background: linear-gradient(90deg, var(--tint) 0%, #fff 55%);
        border:1px solid var(--line); border-radius:16px; box-shadow:var(--shadow-sm); padding:20px;
      }
      .hero__content{ padding:8px 8px 8px 12px; }
      .hero__media{
        margin:0; border-radius:12px; overflow:hidden; border:1px solid var(--line);
        background:#fff; box-shadow:var(--shadow-sm);
        aspect-ratio: 1 / 1;
      }
      .hero__media img{ width:100%; height:100%; object-fit:cover; display:block; }

      .cta{ margin-top:16px; display:flex; gap:10px; flex-wrap:wrap; }

      /* ------------------ FACTS BAR ------------------ */
      .facts{
        display:grid; grid-template-columns:repeat(3,1fr); gap:12px; padding:14px 0 34px;
      }
      .fact{
        display:flex; align-items:center; gap:10px; background:#fff; border:2px solid var(--line);
        padding:10px 12px; border-radius:10px;
      }
      .fact .badge{
        width:10px; height:10px; border-radius:2px; background:var(--med-red); display:inline-block;
        box-shadow:0 0 0 3px color-mix(in srgb, var(--med-red) 18%, transparent);
      }

      /* ------------------ TOPICS (left red spine cards) ------------------ */
      .section__header{ text-align:left; margin-bottom:12px; }
      .topics{ padding:8px 0 6px; }
      .topics__grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:14px; }
      .tile{
        position:relative; background:#fff; border:2px solid var(--line); border-radius:10px; padding:14px 14px 14px 18px;
        transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
      }
      .tile::before{
        content:""; position:absolute; left:-2px; top:-2px; bottom:-2px; width:6px; border-radius:10px 0 0 10px; background:var(--med-red);
      }
      .tile:hover{ transform:translateY(-2px); box-shadow:var(--shadow-md); border-color: color-mix(in srgb, var(--med-red) 38%, var(--line)); }
      .tile p{ color:var(--muted); margin:6px 0 0; }

      /* ------------------ SERVICES TIMELINE ------------------ */
      .services{ padding:26px 0 8px; }
      .timeline{
        position:relative; margin:8px 0 0; padding-left:0; list-style:none;
        border-left:4px solid color-mix(in srgb, var(--med-red) 35%, var(--line));
      }
      .titem{ position:relative; padding-left:22px; }
      .titem + .titem{ margin-top:14px; }
      .tmarker{
        position:absolute; left:-16px; top:10px; transform:translateX(-50%);
        width:28px; height:28px; border-radius:99px; display:grid; place-items:center;
        background:var(--med-red); color:#fff; font-weight:800; font-size:13px; box-shadow:var(--shadow-sm);
        border:2px solid #fff;
      }
      .tcard{
        background:#fff; border:2px solid var(--line); border-radius:10px; padding:14px; box-shadow:var(--shadow-sm);
      }
      .list{ margin:8px 0 12px; padding-left:18px; }

      /* ------------------ ABOUT (inverse tint) ------------------ */
      .about.inv{ padding:28px 0; }
      .about__grid{
        display:grid; grid-template-columns:1.1fr .9fr; gap:20px; align-items:center;
        background: var(--tint); border:1px solid var(--line); border-radius:14px; padding:20px;
      }
      .about__text p{ color:#374151; line-height:1.75; }
      .about__media{ border-radius:10px; overflow:hidden; border:1px solid var(--line); background:#fff; box-shadow:var(--shadow-sm); aspect-ratio:1/1; }
      .about__media img{ width:100%; height:100%; object-fit:cover; display:block; }

      /* ------------------ TESTIMONIALS ------------------ */
      .testimonials{ padding:22px 0 6px; }
      .quotes{ display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:14px; }
      .q{ margin:0; }
      .q blockquote{
        margin:0; padding:14px 16px; border-radius:10px; border:2px solid var(--line); background:#fff;
        position:relative;
      }
      .q blockquote::before{
        content:""; position:absolute; left:-2px; top:-2px; bottom:-2px; width:6px; border-radius:10px 0 0 10px; background:var(--med-red);
      }
      .q figcaption{ margin-top:8px; color:var(--muted); font-size:14px; }

      /* ------------------ FAQ ------------------ */
      .faq{ padding:22px 0 36px; }
      .faq details{
        background:#fff; border:2px solid var(--line); border-radius:10px; padding:12px 14px; box-shadow:var(--shadow-sm);
      }
      .faq details + details{ margin-top:10px; }
      .faq summary{ cursor:pointer; list-style:none; font-weight:700; outline:none; }
      .faq summary::-webkit-details-marker{ display:none; }
      .faq summary::after{ content:"›"; float:right; transform:rotate(90deg); transition:transform .18s ease; opacity:.55; }
      .faq details[open] summary::after{ transform:rotate(-90deg); opacity:.85; }
      .faq details[open]{ border-color: color-mix(in srgb, var(--med-red) 28%, var(--line)); box-shadow:0 0 0 3px color-mix(in srgb, var(--med-red) 14%, transparent), var(--shadow-sm); }
      .faq p{ margin:10px 0 0; color:var(--muted); }

      /* ------------------ BIG CTA BAND (inverse) ------------------ */
      .cta-band{
        background: linear-gradient(180deg, var(--med-red), var(--med-red-dark));
        color:#fff; padding:36px 0 48px; margin-top:8px;
      }
      .inv-title{ color:#fff; margin:0; }
      .inv-lead{ color:#ffe6e8; margin:8px 0 0; }
      .inv-muted{ color:#ffe6e8; display:block; margin-top:10px; }
      .cta__actions{ margin-top:14px; display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }

      /* ------------------ BUTTONS (rectangular, high-contrast) ------------------ */
      .btn{
        display:inline-block; padding:12px 18px; border-radius:8px; font-weight:800; line-height:1;
        border:2px solid transparent; text-decoration:none; transition:transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease, color .18s ease;
        will-change:transform; box-shadow:var(--shadow-sm); text-transform:uppercase; letter-spacing:.3px;
      }
      .btn:focus-visible{ outline:none; box-shadow:var(--ring), var(--shadow-sm); }
      .btn--primary{
        color:#fff; background:var(--med-red); border-color: var(--med-red);
      }
      .btn--primary:hover{ transform:translateY(-2px); background:var(--med-red-dark); border-color:var(--med-red-dark); }
      .btn--ghost{
        background:#fff; border-color: var(--line); color:var(--ink);
      }
      .btn--ghost:hover{ transform:translateY(-2px); border-color: color-mix(in srgb, var(--med-red) 35%, var(--line)); box-shadow:var(--shadow-md); }
      .btn--line{
        background:transparent; color:var(--ink); border-color: var(--line);
      }
      .btn--line:hover{ transform:translateY(-2px); border-color: color-mix(in srgb, var(--med-red) 38%, var(--line)); box-shadow:var(--shadow-md); }
      .btn--inverted{ color:#c8102e; background:#fff; border-color:#fff; }
      .btn--inverted:hover{ transform:translateY(-2px); background:#ffe6e8; border-color:#ffe6e8; }
      .btn--ghost-inv{ color:#fff; background:transparent; border-color:#ffd6db; }
      .btn--ghost-inv:hover{ transform:translateY(-2px); background:rgba(255,255,255,.08); }

      /* ------------------ ACCESSIBILITY & RESPONSIVE ------------------ */
      a:focus-visible, button:focus-visible, [tabindex]:focus-visible { outline:none; box-shadow:var(--ring); border-radius:8px; }

      @media (max-width:1000px){
        .hero__grid{ grid-template-columns:1fr; }
        .about__grid{ grid-template-columns:1fr; }
      }
      @media (max-width:780px){
        .facts{ grid-template-columns:1fr; }
      }

      @media (prefers-reduced-motion: reduce){
        *{ animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; }
      }
    `]
})
export class Home {
    constructor(private title: Title) {
        this.title.setTitle('Михайлишина Наталія — Інформаційні роз’яснення (клінічний червоно-білий стиль)');
    }
}
