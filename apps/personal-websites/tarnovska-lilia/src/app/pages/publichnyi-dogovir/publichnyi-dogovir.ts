import { Component } from '@angular/core';

@Component({
    selector: 'app-publichnyi-dogovir',
    standalone: true,
    template: `
        <a id="top"></a>
        <div class="doc-page">
            <div class="content-wrapper">
                <div class="content">
                    <h1 class="agreement-title">Публічний договір (оферта)</h1>

                    <section class="agreement-section" id="intro">
                        <p>
                            Ці правила є публічним договором (офертою) (надалі – Договір) і відповідно до положень ст. ст. 205, 633, 634, 638–642 Цивільного кодексу України
                            умови публічної оферти є однаковими для всіх осіб, а особа, що приймає зазначені в Договорі умови, стає Замовником – акцепт Договору рівнозначний
                            укладенню/підписанню Договору на умовах, викладених у цьому публічному договорі (оферті) Інформаційної платформи (надалі – «Інформаційна платформа», «Платформа»).
                        </p>
                        <p>
                            У разі незгоди з умовами цього Договору Замовник зобов'язаний не здійснювати дії, спрямовані на замовлення консультації через Платформу у формі звернення або в месенджерах
                            (Telegram, Viber, WhatsApp), у тому числі і їх оплати.
                        </p>
                    </section>

                    <section class="agreement-section" id="terms">
                        <h2>Терміни та визначення</h2>
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

                    <section class="agreement-section" id="subject">
                        <h2>Предмет договору</h2>
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

                    <section class="agreement-section" id="site-use">
                        <h2>Порядок використання Платформи</h2>
                        <p>Користувач використовує Платформу для пошуку Спеціаліста. Користувач відповідає за наслідки надання недостовірних або неповних контактних даних.</p>
                        <p>Платформа дозволяє організувати зв’язок між Користувачем, Спеціалістом та/або Адміністратором. Якщо Спеціаліст не відповів протягом двох робочих днів, Адміністратор може запропонувати іншого.</p>
                    </section>

                    <section class="agreement-section" id="offer-acceptance">
                        <h2>Порядок прийняття оферти</h2>
                        <p>Акцептом є направлення Замовлення та/або оплата, у т.ч. через онлайн-платіжні сервіси.</p>
                        <p>Момент акцепту – підтвердження Замовлення в переписці (месенджер/електронна пошта/інший погоджений канал).</p>
                        <p>Договір укладений без підписання з моменту акцепту. Акцептуючи, Замовник підтверджує, що розуміє та погоджується з умовами.</p>
                        <p>Замовник підтверджує, що кінцевим бенефіціаром результатів послуг є він або особа, яку він уповноважує.</p>
                        <p>Для акцепту Замовник надає: прізвище, ім’я; повний вік (для неповнолітніх – підтвердження інформування батьків/законних представників).</p>
                        <p>Замовник надає згоду на обробку персональних даних Адміністратором протягом строку дії Договору. У разі надання даних третіх осіб – гарантує законність їх отримання і наявність згоди.</p>
                    </section>

                    <section class="agreement-section">
                        <h2>Важливі застереження</h2>
                        <p><strong>1)</strong> Надані послуги мають виключно інформаційний характер, не є медичною послугою та не встановлюють офіційний діагноз.</p>
                        <p><strong>2)</strong> Будь-які згадки про лікування/лікарські засоби мають рекомендаційний характер та не є призначенням. Для діагнозу/лікування потрібен очний прийом у профільного лікаря.</p>
                        <p><strong>3)</strong> У разі <u>погіршення психічного стану</u> Замовник <u>негайно</u> звертається на очний прийом до лікаря-психіатра або у невідкладні служби.</p>
                        <p><strong>4)</strong> Рішення щодо здоров’я приймає Замовник самостійно та несе відповідальність. Рекомендації слугують для підвищення обізнаності.</p>
                    </section>

                    <section class="agreement-section" id="price-payment">
                        <h2>Ціна послуг та порядок розрахунків</h2>
                        <p>Ціни залежать від виду та тривалості послуги. Після першого контакту Спеціаліст може уточнити тривалість сесії, а Адміністратор – остаточну вартість.</p>
                        <p>Розрахунки здійснюються через погоджені онлайн-платіжні системи або на розрахунковий рахунок, наданий Адміністратором.</p>
                        <p>У вартість можуть входити комісія Адміністратора та вартість послуг Спеціаліста. Бронювання часу консультації – передоплата не пізніше ніж за 24 години до сесії. Банківська комісія – за Замовником (якщо інше не погоджено).</p>
                        <p>Після повної оплати кошти не повертаються, окрім випадків, визначених у цьому Договорі. Сплачена бронь (завдаток) є забезпечувальним платежем і не повертається.</p>
                        <p>Кошти не повертаються, якщо: (1) відмова від консультації менше ніж за 24 години; (2) запізнення понад 15 хв без попередження. За форс-мажору можливе перенесення за рішенням Спеціаліста/Адміністратора.</p>
                    </section>

                    <section class="agreement-section" id="provision">
                        <h2>Порядок та строки надання послуг</h2>
                        <p>Послуги надаються онлайн або засобами телефонного зв’язку. Онлайн-послуги оплачуються до початку.</p>
                        <p>Рекомендації надаються на основі спілкування та аналізу запиту. Адміністратор і Спеціаліст не відповідають, якщо Замовник пропустив консультацію у заброньований час.</p>
                        <p>Сесія може проходити через сторонні застосунки (за погодженням). Адміністратор не відповідає за їх роботу.</p>
                        <p>Замовник самостійно веде нотатки/за згодою робить аудіозапис. Неповідомлення про запис – штраф у розмірі вартості консультації.</p>
                        <p>Моментом виконання вважається початок консультації та/або передача доступу до оплачених матеріалів.</p>
                    </section>

                    <section class="agreement-section" id="complaints">
                        <h2>Розгляд скарг користувачів</h2>
                        <p>Послуги надаються з дотриманням відповідних етичних норм. Користувач може подати скаргу Адміністратору; строк і порядок розгляду визначає Адміністратор.</p>
                        <p>У разі підтвердження неетичної/непрофесійної поведінки Спеціаліста Адміністратор може припинити співпрацю.</p>
                        <p>Адміністратор не несе відповідальності за дії Спеціаліста та якість їхніх послуг.</p>
                    </section>

                    <section class="agreement-section" id="refunds">
                        <h2>Повернення коштів</h2>
                        <p>Замовник не менше ніж за добу до початку надання послуг може відмовитися без пояснення причин – кошти повертаються у повному обсязі.</p>
                        <p>Якщо відмова після початку послуг або менше ніж за встановлений час – кошти не повертаються. Для повернення у передбачених випадках Замовник надсилає повідомлення Адміністратору (узгодженим каналом).</p>
                    </section>

                    <section class="agreement-section" id="liability">
                        <h2>Відповідальність сторін</h2>
                        <p>За порушення умов оплати Адміністратор має право розірвати Договір в односторонньому порядку та обмежити доступ до матеріалів/Платформи.</p>
                        <p>У разі несанкціонованого поширення матеріалів – Договір може бути розірвано, доступ заблоковано; можливі штрафні санкції.</p>
                        <p>Адміністратор і Спеціаліст не несуть відповідальності за наслідки використання Замовником результатів послуг; рішення Замовник приймає самостійно.</p>
                        <p>Недопустимі образи, обсценна лексика тощо; за порушення можуть застосовуватись штрафні санкції.</p>
                    </section>

                    <section class="agreement-section" id="force-majeure">
                        <h2>Обставини непереборної сили</h2>
                        <p>Сторони звільняються від відповідальності за невиконання/неналежне виконання у разі форс-мажору (стихії, війна, технічні збої зв’язку, зміни законодавства тощо). Повідомлення – протягом 48 годин із моменту настання з належним підтвердженням.</p>
                        <p>Воєнний стан/військові дії не використовуються як підстава для ухилення від виконання зобов’язань поза випадками форс-мажору.</p>
                    </section>

                    <section class="agreement-section" id="confidentiality">
                        <h2>Конфіденційність</h2>
                        <p>Уся інформація за Договором є конфіденційною. Сторони не розкривають її третім особам і не використовують поза цілями виконання Договору під час дії і після припинення.</p>
                        <p>Конфіденційна інформація Замовника є його власністю. Після припинення дії Договору сторони утримуються від розголошення і повертають матеріали (крім обов’язкових до зберігання за законом).</p>
                        <p>Виняток: загроза життю/безпеці клієнта або інших осіб — можливе повідомлення компетентних органів.</p>
                    </section>

                    <section class="agreement-section" id="ip">
                        <h2>Права інтелектуальної власності</h2>
                        <p>Права на матеріали належать Адміністратору/правовласникам або використовуються на законних підставах.</p>
                        <p>Надається обмежена, невиключна, відклична, без права субліцензії ліцензія на особисте користування (перегляд/прослуховування/читання). Права ІВ не переходять.</p>
                        <p>Матеріали призначені лише для особистого використання Замовника; копіювання/публічне цитування/відтворення/переробка/поширення/продаж без письмової згоди заборонені.</p>
                    </section>

                    <section class="agreement-section" id="disputes">
                        <h2>Вирішення спорів</h2>
                        <p>Спори вирішуються шляхом досудового врегулювання. До правовідносин застосовується матеріальне право України.</p>
                    </section>

                    <section class="agreement-section" id="term">
                        <h2>Строк дії договору</h2>
                        <p>Договір діє протягом строку надання послуг, а в частині розрахунків — до їх повного здійснення.</p>
                        <p>Адміністратор може розірвати Договір у разі невиконання Замовником обов’язків або в інших випадках, передбачених Договором.</p>
                    </section>

                    <section class="agreement-section" id="other">
                        <h2>Інші умови</h2>
                        <p>Приєднуючись до цього Договору, Замовник надає згоду на збирання, обробку та зберігання персональних даних Адміністратором у межах виконання Договору.</p>
                        <p>Адміністратор може змінювати умови Договору шляхом публікації нової редакції та/або повідомлення Замовника погодженим каналом. Продовження користування означає згоду з оновленими умовами.</p>
                    </section>

                    <section class="agreement-section" id="requisites">
                        <h2>Реквізити Виконавця</h2>
                        <p><strong>Найменування отримувача:</strong>ФОП Тарновська Лілія Володимирівна</p>
                        <p><strong>Код отримувача:</strong> 3309702746</p>
                        <p><strong>Рахунок отримувача у форматі відповідно до стандарту IBAN:</strong> UA503052990000026006015518421</p>
                        <p><strong>Назва банку:</strong> АТ КБ «ПриватБанк»</p>
                    </section>

                    <div class="footer-actions">
                        <a href="#top" class="to-top" aria-label="До початку">↑ До початку</a>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
      /* ------------------ ORCHID NOIR (Purple + Grey) ------------------ */
      :host{
        --bg:#0f0f18;            /* near-black indigo-grey */
        --layer:#131320;         /* deeper layer (glass) */
        --surface:#161627;       /* cards */
        --ink:#f0f0ff;           /* off-white */
        --muted:#b5b6c9;         /* cool grey */
        --line:#2a2a3e;          /* outline grey */

        --orchid:#9b5cff;        /* primary purple */
        --orchid-2:#7e44ef;      /* deeper */
        --iris:#c6b6ff;          /* pale purple for text */

        --ring:0 0 0 3px color-mix(in srgb, var(--orchid) 36%, transparent);
        --shadow-sm:0 10px 28px rgba(0,0,0,.35);
        --shadow-md:0 26px 70px rgba(0,0,0,.55);

        display:block; background:var(--bg); color:var(--ink);
        font-family:"Inter", system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", sans-serif;
        -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
        text-rendering:optimizeLegibility; accent-color:var(--orchid);
      }

      .doc-page{ padding:28px 12px 56px; }
      .content-wrapper{ max-width:980px; margin:0 auto; }
      .content{
        position:relative;
        background:
                linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02)),
                var(--layer);
        border:1px solid var(--line);
        border-radius:16px;
        padding:clamp(18px,3vw,32px);
        box-shadow:var(--shadow-sm);
        backdrop-filter:saturate(115%) blur(6px);
      }
      /* фіолетова підкреслююча смуга зверху, як у хедері/футері */
      .content::before{
        content:""; position:absolute; left:0; right:0; top:-1px; height:3px; border-radius:16px 16px 0 0;
        background: linear-gradient(90deg, var(--orchid), color-mix(in srgb, var(--orchid-2) 80%, #fff));
        opacity:.85; pointer-events:none;
      }

      .agreement-title{
        font-size:clamp(26px,3.4vw,36px); line-height:1.15; letter-spacing:-.015em; margin:0 0 12px; color:#ffffff;
      }
      .agreement-title::after{
        content:""; display:block; width:110px; height:4px; margin-top:10px;
        background: linear-gradient(90deg, var(--orchid), var(--orchid-2));
        border-radius:2px;
      }

      .agreement-section{
        scroll-margin-top:96px; padding:12px 0; border-top:1px dashed var(--line); margin-top:16px;
      }
      .agreement-section:first-of-type{ border-top:none; margin-top:8px; padding-top:0; }
      .agreement-section>h2{
        font-size:clamp(20px,2.4vw,26px); margin:8px 0 6px; letter-spacing:-.01em; position:relative; color:#ffffff;
      }
      .agreement-section>h2::before{
        content:""; position:absolute; left:-14px; top:4px; width:6px; height:18px;
        background: linear-gradient(180deg, var(--orchid), var(--orchid-2));
        border-radius:2px;
      }

      p{ line-height:1.8; margin:8px 0; color:var(--iris); }
      strong{ font-weight:700; color:#ffffff; }
      a{ color:var(--orchid); text-decoration:none; }
      a:hover{ text-decoration:underline; }
      a:focus-visible{ outline:none; box-shadow:var(--ring); border-radius:8px; }

      /* Інфо-попередження у фіолетовому тінті */
      .notice{
        margin:12px 0; padding:12px 14px;
        border:1px solid color-mix(in srgb, var(--orchid) 28%, var(--line));
        background: color-mix(in srgb, var(--surface) 80%, #2a1f56 20%);
        color:#e7e2ff;
        border-radius:12px; position:relative; box-shadow:0 6px 18px rgba(155,92,255,.18);
      }
      .notice::before{
        content:"✦"; position:absolute; left:12px; top:10px; opacity:.95; font-weight:700; color:var(--orchid);
        text-shadow:0 0 16px rgba(155,92,255,.45);
      }
      .notice p{ margin-left:28px; }

      .footer-actions{ display:flex; justify-content:flex-end; margin-top:18px; }
      .to-top{
        display:inline-block; padding:12px 16px; border-radius:10px; font-weight:800; text-transform:uppercase; letter-spacing:.3px;
        background: var(--orchid); color:#0f0f18; text-decoration:none; box-shadow:var(--shadow-sm);
        transition:transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease, color .18s ease;
        border:2px solid color-mix(in srgb, var(--orchid) 65%, #fff);
      }
      .to-top:hover{ transform:translateY(-2px); box-shadow:var(--shadow-md); background:var(--orchid-2); border-color:var(--orchid-2); }
      .to-top:active{ transform:translateY(0); opacity:.96; }
      .to-top:focus-visible{ outline:none; box-shadow:var(--ring), var(--shadow-sm); }

      ul,ol{ padding-left:1.2rem; } li{ margin:6px 0; color:var(--iris); }
      u{ text-underline-offset:2px; text-decoration-color: color-mix(in srgb, var(--orchid) 65%, #fff); }

      :target{ scroll-margin-top:110px; animation:targetFlash 1.2s ease; }
      @keyframes targetFlash{ 0%{ background:rgba(155,92,255,.14);} 100%{ background:transparent;} }

      table{ width:100%; border-collapse:collapse; margin:10px 0; }
      th,td{ border:1px solid var(--line); padding:8px 10px; text-align:left; color:var(--iris); }
      th{ background: color-mix(in srgb, var(--surface) 85%, #2a2750 15%); color:#ffffff; }

      @media (max-width: 720px){
        .content{ border-radius:14px; padding:16px; }
        .agreement-section>h2::before{ display:none; }
        .to-top{ position: sticky; bottom: 6px; }
      }

      @media print{
        :host{ background:#fff; color:#000; }
        .content{ box-shadow:none; border:none; padding:0; }
        .content::before{ display:none; }
        .doc-page{ padding:0; }
        a{ color:#000; text-decoration:underline; }
        .to-top,.footer-actions{ display:none; }
        .agreement-section{ break-inside: avoid; }
        .notice{ border:1px solid #000; background:#fff; color:#000; }
      }
    `]
})
export class PublichnyiDogovir {}
