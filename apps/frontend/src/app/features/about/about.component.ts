import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { TelegramBannerComponent } from '../shared/components/telegram-banner/telegram-banner.component';
import { SeoService } from '../../core/seo/seo.service';
import { AnimatedSection } from '../../shared/animation/animated-section';
import { AnimeModule } from '../../shared/animation/anime.service';
import { ReviewService } from '../reviews/review.service';
import { clinicContacts } from '../shared/constants/contacts.constants';

interface Video {
  id: string;
  title: string;
}

interface Specialization {
  title: string;
  description: string;
  /** condition page, when the site has one */
  slug?: string;
}

interface Credential {
  src: string;
  title: string;
  subtitle: string;
}

// 1 відгук · 2–4 відгуки · 5+ (and 11–14) відгуків
function reviewNoun(n: number): string {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'відгук';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'відгуки';
  return 'відгуків';
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, TelegramBannerComponent],
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent extends AnimatedSection implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly reviews = inject(ReviewService);

  protected readonly phone = {
    href: 'tel:' + clinicContacts.doctors.phone,
    text: clinicContacts.doctors.phone.replace(/^\+38(\d{3})(\d{3})(\d{2})(\d{2})$/, '+38 ($1) $2-$3-$4'),
  };

  /** Live centre rating; the proof row shows a plain link until it arrives. */
  protected readonly rating = signal<{ avg: string; total: number; noun: string } | null>(null);

  protected readonly sections = [
    { id: 'bio', label: 'Про мене' },
    { id: 'path', label: 'Професійний шлях' },
    { id: 'spec', label: 'Напрямки' },
    { id: 'docs', label: 'Документи' },
    { id: 'patients', label: 'Відгуки' },
    { id: 'videos', label: 'Відео' },
  ];

  // Verbatim from patient reviews on /reviews that name Євген Скрипник
  protected readonly quotes = [
    { text: 'Після звернення до Євгена Васильовича, який повністю змінив ліки та схему, ожила!!!', author: 'Світлана, пацієнтка' },
    { text: 'Мене вразило, що достатньо було лише трохи розповісти про те, що зі мною відбувається, як лікар одразу зрозумів суть проблеми та поставив діагноз.', author: 'Yurii, пацієнт' },
    { text: 'Євген Васильович призначив лікування і розписав як вірно починати заново вчитися ходить (він так і сказав). Мене це дуже надихнуло.', author: 'Людмила, пацієнтка' },
  ];

  ngOnInit(): void {
    this.reviews.getPublic(1, 1).subscribe({
      next: ({ total, avgRating }) => {
        if (total && avgRating) this.rating.set({ avg: avgRating.toFixed(1).replace('.', ','), total, noun: reviewNoun(total) });
      },
    });

    this.seo.updatePage({
      title: "Євген Скрипник — психіатр, психотерапевт, нарколог | Про засновника центру",
      description: "Євген Скрипник — лікар-психіатр вищої категорії, 20+ років досвіду. Депресія, тривожні розлади, ПТСР, ОКР, залежності. Доказова медицина, онлайн.",
      canonical: '/about',
      ogType: 'profile',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        url: 'https://doctor-skripnik.com.ua/about',
        name: 'Про засновника центру — Євген Скрипник',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Головна', item: 'https://doctor-skripnik.com.ua/' },
            { '@type': 'ListItem', position: 2, name: 'Про засновника центру', item: 'https://doctor-skripnik.com.ua/about' },
          ],
        },
        mainEntity: {
          '@type': ['Person', 'Physician'],
          '@id': 'https://doctor-skripnik.com.ua/#physician',
          name: 'Євген Скрипник',
          honorificPrefix: 'Лікар',
          jobTitle: 'Психіатр, психотерапевт, нарколог, невролог',
          description: 'Лікар-психіатр вищої категорії з понад 20-річним досвідом. Консультує онлайн. Спеціалізується на доказовій психіатрії та лікуванні депресії, тривоги, ПТСР, ОКР та залежностей.',
          url: 'https://doctor-skripnik.com.ua/about',
          image: 'https://doctor-skripnik.com.ua/assets/founder.jpg',
          telephone: '+380665691677',
          award: 'Лікар року 2021',
          knowsAbout: ['Психотерапія', 'Наркологія', 'Депресія', 'Тривожні розлади', 'ПТСР', 'ОКР', 'Біполярний розлад', 'Залежності', 'Психосоматика', 'Неврози'],
          // Only values from schema.org's MedicalSpecialty enum are valid here; the rest live in knowsAbout.
          medicalSpecialty: ['https://schema.org/Psychiatric', 'https://schema.org/Neurologic'],
          alumniOf: {
            '@type': 'CollegeOrUniversity',
            name: 'Сумський державний університет',
            description: 'Медичний факультет, 1997–2003',
          },
          hasCredential: [
            { '@type': 'EducationalOccupationalCredential', name: 'Лікар-психіатр вищої категорії' },
            { '@type': 'EducationalOccupationalCredential', name: 'Спеціалізація з психіатрії, Харківська медична академія, 2003–2004' },
          ],
          worksFor: {
            '@type': 'MedicalOrganization',
            name: "Онлайн центр ментального здоров'я",
            url: 'https://doctor-skripnik.com.ua',
          },
          sameAs: [
            'https://www.facebook.com/p/%D0%84%D0%B2%D0%B3%D0%B5%D0%BD-%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D0%BD%D0%B8%D0%BA-100005860367602',
            'https://www.instagram.com/dr_skripnik_evgen_/',
            'https://t.me/skripnik_evgen',
          ],
        },
      },
    });
  }

  selectedCredential: Credential | null = null;

  credentials: Credential[] = [
    {
      src: '/assets/posvidchenia.jpg',
      title: 'Посвідчення',
      subtitle: 'Сумський державний університет, спеціальність «Лікувальна справа»',
    },
    {
      src: '/assets/posvidchecnia_1.jpg',
      title: 'Диплом',
      subtitle: 'Присвоєна кваліфікація лікаря-психіатра, атестаційна комісія Сумської облдержадміністрації.',
    },
    {
      src: '/assets/sertyficat.jpg',
      title: 'Сертифікат лікаря-спеціаліста',
      subtitle: 'Харківська медична академія післядипломної освіти, спеціальність «Психіатрія».',
    },
  ];

  private lastTrigger: HTMLElement | null = null;

  openCredential(doc: Credential, trigger: HTMLElement): void {
    this.lastTrigger = trigger;
    this.selectedCredential = doc;
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.querySelector<HTMLElement>('.ab-lightbox__close')?.focus());
  }

  closeCredential(): void {
    if (!this.selectedCredential) return;
    this.selectedCredential = null;
    document.body.style.overflow = '';
    this.lastTrigger?.focus();
  }

  scrollTo(id: string): void {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    // <base href="/"> would resolve a bare '#id' against the site root
    history.replaceState(null, '', location.pathname + '#' + id);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeCredential();
  }

  specializations: Specialization[] = [
    {
      title: 'Депресія та депресивні розлади',
      slug: 'likuvannya-depresii',
      description: 'Діагностика та лікування великого депресивного розладу, дистимії та сезонних депресій за міжнародними протоколами.',
    },
    {
      title: 'Тривожні розлади та панічні атаки',
      slug: 'likuvannya-tryvohy',
      description: 'Генералізований тривожний розлад, соціофобія, агорафобія та панічний розлад — доказова психотерапія та фармакотерапія.',
    },
    {
      title: 'ПТСР та психотравми',
      slug: 'likuvannya-ptsr',
      description: 'Робота з посттравматичним стресовим розладом, гострою стресовою реакцією та наслідками психологічної травми.',
    },
    {
      title: 'ОКР та обсесивні стани',
      slug: 'likuvannya-okr',
      description: 'Обсесивно-компульсивний розлад, нав’язливі думки та ритуали — лікування методами КПТ та ERP-терапії.',
    },
    {
      title: 'Біполярний розлад',
      slug: 'likuvannya-bipolyarnoho-rozladu',
      description: 'Стабілізація стану при біполярному афективному розладі І та ІІ типу, підбір нормотиміків і профілактика епізодів.',
    },
    {
      title: 'Неврози та психосоматика',
      description: 'Невротичні реакції, психосоматичні симптоми, хронічний стрес та вигорання — комплексний психіатричний підхід.',
    },
  ];

  videos: Video[] = [
    {
      id: 'cPLDL8TEZzA',
      title: 'Тривожний розлад: симптоми, причини та лікування у дорослих',
    },
    {
      id: '0NXuEurKKv0',
      title: 'Депресія та панічні атаки: як лікувати тривожність без шкоди для здоров’я',
    },
    {
      id: 'GSFTvKaqPbs',
      title: 'Депресивний розлад: симптоми, діагностика та антидепресанти — що правда?',
    },
    {
      id: 'G8Ve-WvYwZA',
      title: 'Лікування тривожних розладів: доказові методи психіатрії та психотерапії',
    },
    {
      id: 'BPIc-bCgGxc',
      title: 'Коли звертатися до психіатра: симптоми, які не можна ігнорувати',
    },
  ];

  /** Blocks below the hero fade up gently as they scroll into view. */
  protected setup({ animate, utils }: AnimeModule, root: HTMLElement): void {
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
      utils.set(el, { opacity: 0, translateY: 20 });
      this.whenVisible(el, () => animate(el, { opacity: 1, translateY: 0, duration: 280, ease: 'outQuad' }), 0.15);
    });
  }
}
