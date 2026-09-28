import { Component, AfterViewInit, OnDestroy, HostListener } from '@angular/core';

@Component({
    selector: 'app-publichnyi-dogovir',
    standalone: true,
    template: `
        <a id="top"></a>

        <!-- Mobile TOC toggle (hidden on desktop) -->
        <div class="toc-toggle-wrap">
            <button
                    class="toc-toggle chip"
                    type="button"
                    aria-label="Відкрити зміст"
                    aria-controls="toc-drawer"
                    [attr.aria-expanded]="tocOpen"
                    (click)="openToc()">
                ☰ Зміст
            </button>
        </div>

        <!-- Off-canvas TOC for mobile -->
        <div class="toc-backdrop z-9999" aria-hidden="true" (click)="closeToc()" [class.open]="tocOpen"></div>
        <aside
                id="toc-drawer"
                class="toc-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby="toc-title"
                [class.open]="tocOpen">
            <div class="toc-drawer__header">
                <h2 id="toc-title" class="doc-nav__title">Зміст</h2>
                <button
                        class="toc-drawer__close"
                        type="button"
                        aria-label="Закрити"
                        (click)="closeToc()"
                        (keydown.enter)="closeToc()">
                    ✕
                </button>
            </div>
            <nav>
                @for (link of toc; track link) {
                    <a
                            [href]="'#' + link.id"
                            [attr.aria-current]="activeId===link.id ? 'page' : null"
                            (click)="goAndClose(link.id, $event)">
                        {{ link.label }}
                    </a>
                }
            </nav>
            <div class="doc-nav__tools">
                <a class="chip" href="#top" (click)="goAndClose('top', $event)">↑ До початку</a>
                <button class="chip" type="button" (click)="print()">Друк / PDF</button>
            </div>
        </aside>

        <div class="doc-page">
            <div class="layout">
                <!-- Desktop sticky TOC (hidden on mobile) -->
                <aside class="doc-nav" aria-label="Зміст договору">
                    <h2 class="doc-nav__title">Зміст</h2>
                    <nav>
                        @for (link of toc; track link) {
                            <a
                                    [href]="'#' + link.id"
                                    [attr.aria-current]="activeId===link.id ? 'page' : null"
                                    (click)="goAndClose(link.id, $event)">
                                {{ link.label }}
                            </a>
                        }
                    </nav>
                    <div class="doc-nav__tools">
                        <a class="chip" href="#top" (click)="go('top', $event)">↑ До початку</a>
                        <button class="chip" type="button" (click)="print()">Друк / PDF</button>
                    </div>
                </aside>

                <div class="content-wrapper">
                    <div class="content">
                        <h1 class="agreement-title">Публічний договір (оферта)</h1>

                        <!-- INTRO -->
                        <section class="agreement-section" id="intro">
                            <h2>
                                Вступ
                                <button class="anchor-link" type="button" (click)="copyLink('intro', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p>
                                Ці правила є публічним договором (офертою) (надалі – Договір) і відповідно до положень
                                ст. ст. 205, 633, 634, 638–642 Цивільного кодексу України
                                умови публічної оферти є однаковими для всіх осіб, а особа, що приймає зазначені в
                                Договорі умови, стає Замовником – акцепт Договору рівнозначний
                                укладенню/підписанню Договору на умовах, викладених у цьому публічному договорі (оферті)
                                Інформаційної платформи (надалі – «Інформаційна платформа», «Платформа»).
                            </p>
                            <p>
                                У разі незгоди з умовами цього Договору Замовник зобов'язаний не здійснювати дії,
                                спрямовані на замовлення консультації через Платформу у формі звернення або в
                                месенджерах
                                (Telegram, Viber, WhatsApp), у тому числі і їх оплати.
                            </p>
                        </section>

                        <!-- TERMS -->
                        <section class="agreement-section" id="terms">
                            <h2>
                                Терміни та визначення
                                <button class="anchor-link" type="button" (click)="copyLink('terms', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p><strong>Адміністратор</strong> – власник або уповноважена особа, яка забезпечує роботу Інформаційної платформи та взаємодію з Користувачами.</p>
                            <p><strong>Акцепт</strong> – надання Замовником повної та безумовної згоди на укладення цього Договору шляхом заповнення та направлення запиту на консультацію та/або здійснення оплати.</p>
                            <p><strong>Замовник</strong> – фізична особа, яка володіє цивільною та правовою дієздатністю і приєднується до умов цього Договору.</p>
                            <p><strong>Замовлення</strong> – доручення на надання послуг за зверненням Замовника до Платформи.</p>
                            <p><strong>Запит на Послугу</strong> – звернення Замовника через Платформу та/або за допомогою месенджерів (Telegram, Viber або WhatsApp).</p>
                            <p><strong>Консультація</strong> – фахові інформаційні роз’яснення Спеціаліста щодо психологічних/психіатричних питань у вигляді загальних порад та рекомендацій освітнього характеру.</p>
                            <p><strong>Користувач</strong> – будь-яка особа, що користується Платформою.</p>
                            <p><strong>Спеціаліст</strong> – особа, яку залучає Адміністратор для надання відповідних інформаційно-консультативних послуг, що пройшла верифікацію.</p>
                            <div class="notice">
                                <p><strong>Важливо:</strong> консультації, що надаються, є <strong>інформаційними послугами</strong>, мають виключно рекомендаційний характер, <strong>не є медичною послугою</strong> і <strong>не замінюють очний прийом лікаря</strong>.</p>
                            </div>
                        </section>

                        <!-- SUBJECT -->
                        <section class="agreement-section" id="subject">
                            <h2>
                                Предмет договору
                                <button class="anchor-link" type="button" (click)="copyLink('subject', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p>Замовник подає заявку на консультацію; представник Платформи контактує із Замовником для підбору Спеціаліста та організації зустрічі.</p>
                            <p>Спеціаліст надає Замовнику інформаційні роз’яснення та рекомендації освітнього характеру щодо психологічної допомоги.</p>
                            <p>Замовник зобов’язується прийняти і оплатити послуги на умовах цієї оферти та/або у приватних повідомленнях.</p>
                            <p>Вартість конкретної Послуги (консультації) може визначатися на сторінці інформування, у рекламних матеріалах або приватних повідомленнях.</p>
                            <p>Послуга надається у вигляді дзвінка/відеодзвінка та/або відео/аудіо консультації – на вибір Замовника. Про запис розмови Замовник повідомляє <u>до</u> початку; запис – лише для особистих цілей.</p>
                            <p>Послуги можуть надаватись неповнолітнім за обов’язковим інформуванням батьків/законних представників.</p>
                            <div class="notice">
                                <p><strong>Онлайн-роз’яснення фахівця не є медичною послугою і не замінює очний прийом лікаря. У разі погіршення психічного стану слід невідкладно звернутися до лікаря-психіатра.</strong></p>
                            </div>
                        </section>

                        <!-- SITE USE -->
                        <section class="agreement-section" id="site-use">
                            <h2>
                                Порядок використання Платформи
                                <button class="anchor-link" type="button" (click)="copyLink('site-use', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p>Користувач використовує Платформу для пошуку Спеціаліста. Користувач відповідає за наслідки надання недостовірних або неповних контактних даних.</p>
                            <p>Платформа дозволяє організувати зв’язок між Користувачем, Спеціалістом та/або Адміністратором. Якщо Спеціаліст не відповів протягом двох робочих днів, Адміністратор може запропонувати іншого.</p>
                        </section>

                        <!-- OFFER ACCEPTANCE -->
                        <section class="agreement-section" id="offer-acceptance">
                            <h2>
                                Порядок прийняття оферти
                                <button class="anchor-link" type="button" (click)="copyLink('offer-acceptance', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p>Акцептом є направлення Замовлення та/або оплата, у т.ч. через онлайн-платіжні сервіси.</p>
                            <p>Момент акцепту – підтвердження Замовлення в переписці (месенджер/електронна пошта/інший погоджений канал).</p>
                            <p>Договір укладений без підписання з моменту акцепту. Акцептуючи, Замовник підтверджує, що розуміє та погоджується з умовами.</p>
                            <p>Замовник підтверджує, що кінцевим бенефіціаром результатів послуг є він або особа, яку він уповноважує.</p>
                            <p>Для акцепту Замовник надає: прізвище, ім’я; повний вік (для неповнолітніх – підтвердження інформування батьків/законних представників).</p>
                            <p>Замовник надає згоду на обробку персональних даних Адміністратором протягом строку дії Договору. У разі надання даних третіх осіб – гарантує законність їх отримання і наявність згоди.</p>
                        </section>

                        <!-- DISCLAIMERS -->
                        <section class="agreement-section" id="disclaimers">
                            <h2>
                                Важливі застереження
                                <button class="anchor-link" type="button" (click)="copyLink('disclaimers', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p><strong>1)</strong> Надані послуги мають виключно інформаційний характер, не є медичною послугою та не встановлюють офіційний діагноз.</p>
                            <p><strong>2)</strong> Будь-які згадки про лікування/лікарські засоби мають рекомендаційний характер та не є призначенням. Для діагнозу/лікування потрібен очний прийом у профільного лікаря.</p>
                            <p><strong>3)</strong> У разі <u>погіршення психічного стану</u> Замовник <u>негайно</u> звертається на очний прийом до лікаря-психіатра або у невідкладні служби.</p>
                            <p><strong>4)</strong> Рішення щодо здоров’я приймає Замовник самостійно та несе відповідальність. Рекомендації слугують для підвищення обізнаності.</p>
                        </section>

                        <!-- PRICE & PAYMENT -->
                        <section class="agreement-section" id="price-payment">
                            <h2>
                                Ціна послуг та порядок розрахунків
                                <button class="anchor-link" type="button" (click)="copyLink('price-payment', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p>Ціни залежать від виду та тривалості послуги. Після першого контакту Спеціаліст може уточнити тривалість сесії, а Адміністратор – остаточну вартість.</p>
                            <p>Розрахунки здійснюються через погоджені онлайн-платіжні системи або на розрахунковий рахунок, наданий Адміністратором.</p>
                            <p>У вартість можуть входити комісія Адміністратора та вартість послуг Спеціаліста. Бронювання часу консультації – передоплата не пізніше ніж за 24 години до сесії. Банківська комісія – за Замовником (якщо інше не погоджено).</p>
                            <p>Після повної оплати кошти не повертаються, окрім випадків, визначених у цьому Договорі. Сплачена бронь (завдаток) є забезпечувальним платежем і не повертається.</p>
                            <p>Кошти не повертаються, якщо: (1) відмова від консультації менше ніж за 24 години; (2) запізнення понад 15 хв без попередження. За форс-мажору можливе перенесення за рішенням Спеціаліста/Адміністратора.</p>
                        </section>

                        <!-- PROVISION -->
                        <section class="agreement-section" id="provision">
                            <h2>
                                Порядок та строки надання послуг
                                <button class="anchor-link" type="button" (click)="copyLink('provision', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p>Послуги надаються онлайн або засобами телефонного зв’язку. Онлайн-послуги оплачуються до початку.</p>
                            <p>Рекомендації надаються на основі спілкування та аналізу запиту. Адміністратор і Спеціаліст не відповідають, якщо Замовник пропустив консультацію у заброньований час.</p>
                            <p>Сесія може проходити через сторонні застосунки (за погодженням). Адміністратор не відповідає за їх роботу.</p>
                            <p>Замовник самостійно веде нотатки/за згодою робить аудіозапис. Неповідомлення про запис – штраф у розмірі вартості консультації.</p>
                            <p>Моментом виконання вважається початок консультації та/або передача доступу до оплачених матеріалів.</p>
                        </section>

                        <!-- COMPLAINTS -->
                        <section class="agreement-section" id="complaints">
                            <h2>
                                Розгляд скарг користувачів
                                <button class="anchor-link" type="button" (click)="copyLink('complaints', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p>Послуги надаються з дотриманням відповідних етичних норм. Користувач може подати скаргу Адміністратору; строк і порядок розгляду визначає Адміністратор.</p>
                            <p>У разі підтвердження неетичної/непрофесійної поведінки Спеціаліста Адміністратор може припинити співпрацю.</p>
                            <p>Адміністратор не несе відповідальності за дії Спеціаліста та якість їхніх послуг.</p>
                        </section>

                        <!-- REFUNDS -->
                        <section class="agreement-section" id="refunds">
                            <h2>
                                Повернення коштів
                                <button class="anchor-link" type="button" (click)="copyLink('refunds', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p>Замовник не менше ніж за добу до початку надання послуг може відмовитися без пояснення причин – кошти повертаються у повному обсязі.</p>
                            <p>Якщо відмова після початку послуг або менше ніж за встановлений час – кошти не повертаються. Для повернення у передбачених випадках Замовник надсилає повідомлення Адміністратору (узгодженим каналом).</p>
                        </section>

                        <!-- LIABILITY -->
                        <section class="agreement-section" id="liability">
                            <h2>
                                Відповідальність сторін
                                <button class="anchor-link" type="button" (click)="copyLink('liability', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p>За порушення умов оплати Адміністратор має право розірвати Договір в односторонньому порядку та обмежити доступ до матеріалів/Платформи.</p>
                            <p>У разі несанкціонованого поширення матеріалів – Договір може бути розірвано, доступ заблоковано; можливі штрафні санкції.</p>
                            <p>Адміністратор і Спеціаліст не несуть відповідальності за наслідки використання Замовником результатів послуг; рішення Замовник приймає самостійно.</p>
                            <p>Недопустимі образи, обсценна лексика тощо; за порушення можуть застосовуватись штрафні санкції.</p>
                        </section>

                        <!-- FORCE MAJEURE -->
                        <section class="agreement-section" id="force-majeure">
                            <h2>
                                Обставини непереборної сили
                                <button class="anchor-link" type="button" (click)="copyLink('force-majeure', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p>Сторони звільняються від відповідальності за невиконання/неналежне виконання у разі форс-мажору (стихії, війна, технічні збої зв’язку, зміни законодавства тощо). Повідомлення – протягом 48 годин із моменту настання з належним підтвердженням.</p>
                            <p>Воєнний стан/військові дії не використовуються як підстава для ухилення від виконання зобов’язань поза випадками форс-мажору.</p>
                        </section>

                        <!-- CONFIDENTIALITY -->
                        <section class="agreement-section" id="confidentiality">
                            <h2>
                                Конфіденційність
                                <button class="anchor-link" type="button" (click)="copyLink('confidentiality', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p>Уся інформація за Договором є конфіденційною. Сторони не розкривають її третім особам і не використовують поза цілями виконання Договору під час дії і після припинення.</p>
                            <p>Конфіденційна інформація Замовника є його власністю. Після припинення дії Договору сторони утримуються від розголошення і повертають матеріали (крім обов’язкових до зберігання за законом).</p>
                            <p>Виняток: загроза життю/безпеці клієнта або інших осіб — можливе повідомлення компетентних органів.</p>
                        </section>

                        <!-- IP -->
                        <section class="agreement-section" id="ip">
                            <h2>
                                Права інтелектуальної власності
                                <button class="anchor-link" type="button" (click)="copyLink('ip', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p>Права на матеріали належать Адміністратору/правовласникам або використовуються на законних підставах.</p>
                            <p>Надається обмежена, невиключна, відклична, без права субліцензії ліцензія на особисте користування (перегляд/прослуховування/читання). Права ІВ не переходять.</p>
                            <p>Матеріали призначені лише для особистого використання Замовника; копіювання/публічне цитування/відтворення/переробка/поширення/продаж без письмової згоди заборонені.</p>
                        </section>

                        <!-- DISPUTES -->
                        <section class="agreement-section" id="disputes">
                            <h2>
                                Вирішення спорів
                                <button class="anchor-link" type="button" (click)="copyLink('disputes', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p>Спори вирішуються шляхом досудового врегулювання. До правовідносин застосовується матеріальне право України.</p>
                        </section>

                        <!-- TERM -->
                        <section class="agreement-section" id="term">
                            <h2>
                                Строк дії договору
                                <button class="anchor-link" type="button" (click)="copyLink('term', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p>Договір діє протягом строку надання послуг, а в частині розрахунків — до їх повного здійснення.</p>
                            <p>Адміністратор може розірвати Договір у разі невиконання Замовником обов’язків або в інших випадках, передбачених Договором.</p>
                        </section>

                        <!-- OTHER -->
                        <section class="agreement-section" id="other">
                            <h2>
                                Інші умови
                                <button class="anchor-link" type="button" (click)="copyLink('other', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p>Приєднуючись до цього Договору, Замовник надає згоду на збирання, обробку та зберігання персональних даних Адміністратором у межах виконання Договору.</p>
                            <p>Адміністратор може змінювати умови Договору шляхом публікації нової редакції та/або повідомлення Замовника погодженим каналом. Продовження користування означає згоду з оновленими умовами.</p>
                        </section>

                        <!-- REQUISITES -->
                        <section class="agreement-section" id="requisites">
                            <h2>
                                Реквізити Виконавця
                                <button class="anchor-link" type="button" (click)="copyLink('requisites', $event)" aria-label="Скопіювати посилання на розділ">#</button>
                            </h2>
                            <p><strong>Найменування отримувача:</strong> ФОП ВОРОНА КАТЕРИНА ІВАНІВНА</p>
                            <p><strong>Код отримувача:</strong> 2168706369</p>
                            <p><strong>Рахунок отримувача у форматі відповідно до стандарту IBAN:</strong> UA213052990000026002040149319</p>
                            <p><strong>Назва банку:</strong> АТ КБ «ПриватБанк»</p>
                        </section>

                        <div class="footer-actions">
                            <a href="#top" class="to-top" aria-label="До початку" (click)="go('top', $event)">↑ До початку</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
      /* ORCHID NOIR (purple + grey, dark) */
      :host{
        --bg:#0e0f13; --layer:#11131a; --surface:#151927; --surface-2:#171d30;
        --ink:#f6f7fb; --muted:#b8c0d4; --line:#283048;
        --indigo:#6fa7ff; --cyan:#69e3ff; --vio:#a98bff;
        --brand:var(--indigo);
        --brand-2:var(--vio);
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

      .doc-page{ padding:24px 12px 48px; }

      .layout{
        display:grid; grid-template-columns:260px minmax(0,1fr);
        gap:16px; align-items:start; max-width:1200px; margin:0 auto;
      }
      @media (max-width: 980px){ .layout{ grid-template-columns:1fr; } }
      .z-9999{ z-index: 99999; }

      /* Desktop sticky TOC */
      .doc-nav{
        position:sticky; top:16px;
        background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02)), var(--surface);
        border:1px solid var(--line); border-radius:14px; padding:12px 12px 10px;
        box-shadow: var(--shadow-sm);
      }
      @media (max-width: 980px){ .doc-nav{ display:none; } }

      .doc-nav__title{
        font-size:12px; letter-spacing:.12em; text-transform:uppercase;
        color: var(--muted); margin:4px 0 8px; padding-left:4px;
      }
      .doc-nav nav{ display:flex; flex-direction:column; gap:6px; }

      .doc-nav a, .toc-drawer nav a{
        display:block; padding:8px 10px; border-radius:10px; text-decoration:none;
        color:var(--ink); border:1px solid transparent;
        transition: background .2s ease, border-color .2s ease, transform .2s ease;
      }
      .doc-nav a:hover, .toc-drawer nav a:hover{
        background: color-mix(in srgb, var(--indigo) 10%, transparent);
        border-color: color-mix(in srgb, var(--indigo) 35%, transparent);
        transform: translateX(2px);
      }
      .doc-nav a[aria-current="page"], .toc-drawer nav a[aria-current="page"]{
        background: linear-gradient(180deg, rgba(159,184,255,.18), rgba(105,167,255,.08));
        border-color: color-mix(in srgb, var(--indigo) 45%, transparent);
        font-weight:600;
      }

      .doc-nav__tools{ display:flex; gap:6px; flex-wrap:wrap; margin-top:10px; }

      .chip{
        display:inline-block; padding:6px 10px; font-size:12px; border-radius:999px;
        background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
        border:1px solid var(--line); color:var(--ink); text-decoration:none; cursor:pointer;
      }
      .chip:hover{ border-color: color-mix(in srgb, var(--indigo) 40%, transparent); }

      .content-wrapper{ max-width:980px; width:100%; }

      .content{
        background: var(--surface);
        border:1px solid var(--line);
        border-radius:16px;
        padding: clamp(18px, 3vw, 32px);
        box-shadow: 0 1px 0 rgba(0,0,0,.2), var(--shadow-sm);
        position:relative;
      }
      .content::before{
        content:""; position:absolute; left:0; right:0; top:0; height:4px;
        border-radius:16px 16px 0 0;
        background: linear-gradient(90deg, var(--indigo), var(--vio));
        opacity:.9; pointer-events:none;
      }

      .agreement-title{
        font-size: clamp(26px, 3.6vw, 36px); line-height:1.15; letter-spacing:-.015em; margin:0 0 12px;
      }
      .agreement-title::after{
        content:""; display:block; width:88px; height:3px; margin-top:10px;
        background: linear-gradient(90deg, var(--indigo), var(--vio));
        border-radius:999px; opacity:.9;
      }

      .agreement-section{
        scroll-margin-top:96px; padding:10px 0; border-top:1px dashed var(--line); margin-top:16px;
      }
      .agreement-section:first-of-type{ border-top:none; margin-top:8px; padding-top:0; }

      .agreement-section>h2{
        font-size:clamp(20px,2.4vw,26px); margin:8px 0 6px; letter-spacing:-.01em; position:relative; padding-right:28px;
      }
      .agreement-section>h2::after{
        content:"§"; font-weight:600; color: color-mix(in srgb, var(--vio) 70%, var(--ink));
        position:absolute; left:-22px; top:0; opacity:.25;
      }

      .anchor-link{
        position:absolute; right:0; top:0; transform: translateY(10%);
        background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
        border:1px solid var(--line); border-radius:8px; padding:2px 8px;
        font-weight:700; color: var(--muted); cursor:pointer;
        transition:border-color .2s ease, color .2s ease, transform .2s ease;
      }
      .anchor-link:hover{ border-color: color-mix(in srgb, var(--indigo) 40%, transparent); color:var(--ink); transform: translateY(10%) scale(1.03); }
      .anchor-link:focus-visible{ outline:none; box-shadow: var(--ring); }

      p{ line-height:1.75; margin:8px 0; color: var(--ink); }
      strong{ font-weight:700; }
      a{ color: var(--indigo); text-decoration:none; }
      a:hover{ text-decoration:underline; }
      a:focus-visible{ outline:none; box-shadow: var(--ring); border-radius:8px; }

      .notice{
        margin:12px 0; padding:12px 14px;
        border:1px solid color-mix(in srgb, var(--indigo) 35%, var(--line));
        background: linear-gradient(180deg, rgba(111,167,255,.12), rgba(169,139,255,.08));
        color:#dde6ff; border-radius:12px; position:relative;
      }
      .notice::before{ content:"ℹ️"; position:absolute; left:12px; top:10px; opacity:.9; }
      .notice p{ margin-left:28px; color:var(--ink); }

      .footer-actions{ display:flex; justify-content:flex-end; margin-top:18px; }
      .to-top{
        display:inline-block; padding:10px 14px; border-radius:999px;
        background: linear-gradient(180deg, color-mix(in srgb, var(--indigo) 88%, white 12%), var(--indigo));
        color:#0e0f13; text-decoration:none;
        box-shadow: 0 12px 28px rgba(0,0,0,.35);
        transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease, filter .2s ease;
        border:1px solid color-mix(in srgb, var(--indigo) 55%, transparent);
      }
      .to-top:hover{ transform:translateY(-2px); box-shadow: var(--shadow-md); filter:saturate(108%); }
      .to-top:active{ transform:translateY(0); opacity:.92; }
      .to-top:focus-visible{ outline:none; box-shadow: var(--ring); }

      ul,ol{ padding-left:1.2rem; } li{ margin:6px 0; }
      u{ text-underline-offset:2px; }

      :target{ scroll-margin-top:96px; animation: targetFlash 1.2s ease; }
      @keyframes targetFlash{ 0%{ background: rgba(111,167,255,.18);} 100%{ background:transparent;} }

      table{ width:100%; border-collapse:collapse; margin:10px 0; }
      th,td{ border:1px solid var(--line); padding:8px 10px; text-align:left; }
      th{ background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02)); color:var(--ink); }

      @media (max-width: 720px){
        .content{ border-radius:12px; padding:16px; }
        .agreement-section>h2::after{ display:none; }
        .to-top{ position: sticky; bottom: 6px; }
      }

      /* Mobile TOC */
      .toc-toggle-wrap{ position:sticky; top:8px; z-index:40; padding:8px 12px 0; display:none; }
      .toc-toggle{ font-weight:600; }
      @media (max-width:980px){ .toc-toggle-wrap{ display:block; } }

      .toc-backdrop{
        position:fixed; inset:0; background: rgba(0,0,0,.45);
        opacity:0; pointer-events:none; transition:opacity .2s ease; z-index:900;
      }
      .toc-backdrop.open{ opacity:1; pointer-events:auto; }

      .toc-drawer{
        position:fixed; inset:0 auto 0 0; width:min(86vw,360px);
        background: var(--surface-2); border-right:1px solid var(--line);
        box-shadow: var(--shadow-md);
        transform: translateX(-100%); transition: transform .22s ease;
        display:flex; flex-direction:column; padding:12px; z-index:99999; pointer-events:auto;
      }
      .toc-drawer.open{ transform: translateX(0); }

      .toc-drawer__header{
        position:relative; display:flex; align-items:center; justify-content:center; margin-bottom:6px;
      }
      .toc-drawer__close{
        position:absolute; top:6px; right:6px; min-width:40px; min-height:40px;
        display:inline-flex; align-items:center; justify-content:center; line-height:1;
        background: transparent; color:var(--ink);
        border:1px solid var(--line); border-radius:10px; cursor:pointer; z-index:1; pointer-events:auto;
      }

      .toc-drawer nav{ display:flex; flex-direction:column; gap:6px; overflow:auto; padding-right:2px; margin-bottom:8px; }
      .toc-drawer, .toc-drawer *{ pointer-events:auto; }

      @media (min-width:981px){ .toc-backdrop, .toc-drawer{ display:none; } }

      @media (prefers-reduced-motion: reduce){
        .toc-backdrop, .toc-drawer, .doc-nav a, .toc-drawer nav a, .anchor-link, .to-top{ transition:none !important; }
      }

      @media print{
        .toc-toggle-wrap, .toc-backdrop, .toc-drawer{ display:none !important; }
      }
      @media print{
        :host{ background:#fff; color:#000; }
        .layout{ display:block; }
        .doc-nav{ display:none; }
        .content{ box-shadow:none; border:none; padding:0; }
        .content::before{ display:none; }
        .doc-page{ padding:0; }
        a{ color:#000; text-decoration:underline; }
        .to-top,.footer-actions,.anchor-link{ display:none; }
        .agreement-section{ break-inside:avoid; }
      }
    `]
})
export class PublichnyiDogovir implements AfterViewInit, OnDestroy {
    activeId = 'intro';
    tocOpen = false;

    readonly toc = [
        { id: 'intro', label: 'Вступ' },
        { id: 'terms', label: 'Терміни та визначення' },
        { id: 'subject', label: 'Предмет договору' },
        { id: 'site-use', label: 'Використання Платформи' },
        { id: 'offer-acceptance', label: 'Прийняття оферти' },
        { id: 'disclaimers', label: 'Важливі застереження' },
        { id: 'price-payment', label: 'Ціна та оплата' },
        { id: 'provision', label: 'Надання послуг' },
        { id: 'complaints', label: 'Скарги' },
        { id: 'refunds', label: 'Повернення коштів' },
        { id: 'liability', label: 'Відповідальність' },
        { id: 'force-majeure', label: 'Форс-мажор' },
        { id: 'confidentiality', label: 'Конфіденційність' },
        { id: 'ip', label: 'Права ІВ' },
        { id: 'disputes', label: 'Спори' },
        { id: 'term', label: 'Строк дії' },
        { id: 'other', label: 'Інші умови' },
        { id: 'requisites', label: 'Реквізити' },
    ];

    private sectionIds = [...this.toc.map(t => t.id), 'top'];
    private observer?: IntersectionObserver;

    ngAfterViewInit(): void {
        const hash = typeof window !== 'undefined' ? decodeURIComponent(location.hash.replace('#','')) : '';
        if (hash) {
            setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
            this.activeId = hash;
        }

        if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                const visible = entries.filter(e => e.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length) {
                    const id = (visible[0].target as HTMLElement).id;
                    if (id && this.sectionIds.includes(id)) this.activeId = id;
                }
            }, { root: null, rootMargin: '-100px 0px -60% 0px', threshold: [0, 0.1, 0.25, 0.5] });

            this.sectionIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) this.observer!.observe(el);
            });
        }
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
        this.unlockBodyScroll();
    }

    go(id: string, e: Event): void {
        e.preventDefault();
        this.activeId = id;
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (typeof history !== 'undefined') history.replaceState(null, '', `#${id}`);
    }

    goAndClose(id: string, e: Event): void {
        this.go(id, e);
        this.closeToc();
    }

    copyLink(id: string, e: Event): void {
        e.preventDefault();
        if (typeof window === 'undefined') return;
        const url = `${location.origin}${location.pathname}#${id}`;
        navigator.clipboard?.writeText?.(url);
    }

    print(): void {
        if (typeof window !== 'undefined') window.print();
    }

    openToc(): void {
        this.tocOpen = true;
        this.lockBodyScroll();
        setTimeout(() => {
            const first = document.querySelector('#toc-drawer nav a') as HTMLAnchorElement | null;
            first?.focus?.();
        }, 0);
    }

    closeToc(): void {
        this.tocOpen = false;
        this.unlockBodyScroll();
    }

    private lockBodyScroll() {
        if (typeof document === 'undefined') return;
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
    }
    private unlockBodyScroll() {
        if (typeof document === 'undefined') return;
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
    }

    @HostListener('document:keydown.escape') onEsc() {
        if (this.tocOpen) this.closeToc();
    }

    @HostListener('window:resize') onResize() {
        if (typeof window !== 'undefined' && window.innerWidth >= 981 && this.tocOpen) {
            this.closeToc();
        }
    }
}
