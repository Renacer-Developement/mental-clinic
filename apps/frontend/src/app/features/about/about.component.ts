import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImportsModule } from '../../shared/primeng-imports.module';
import { Component, inject, OnInit } from '@angular/core';
import { TelegramBannerComponent } from '../shared/components/telegram-banner/telegram-banner.component';
import { SeoService } from '../../core/seo/seo.service';

interface Video {
  id: string;
  title: string;
}

interface Review {
  name: string;
  date: string;
  rating: number;
  text: string;
}

interface Specialization {
  title: string;
  description: string;
  icon: string;
}

interface Credential {
  src: string;
  title: string;
  subtitle: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, ImportsModule, RouterLink, TelegramBannerComponent],
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updatePage({
      title: "Євген Скрипник — психіатр, психотерапевт, нарколог | Про лікаря",
      description: "Євген Скрипник — лікар-психіатр вищої категорії з 20+ роками досвіду. Спеціалізація: депресія, тривожні розлади, ПТСР, ОКР, залежності. Доказова медицина, онлайн консультація.",
      canonical: '/about',
      ogType: 'profile',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        url: 'https://doctor-skripnik.com.ua/about',
        name: 'Про лікаря — Євген Скрипник',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Головна', item: 'https://doctor-skripnik.com.ua/' },
            { '@type': 'ListItem', position: 2, name: 'Про лікаря', item: 'https://doctor-skripnik.com.ua/about' },
          ],
        },
        mainEntity: {
          '@type': ['Person', 'Physician'],
          '@id': 'https://doctor-skripnik.com.ua/#physician',
          name: 'Євген Скрипник',
          honorificPrefix: 'Лікар',
          jobTitle: 'Психіатр, психотерапевт, нарколог, невролог',
          description: 'Лікар-психіатр вищої категорії з понад 20-річним досвідом. Приймає онлайн та офлайн. Спеціалізується на доказовій психіатрії та лікуванні депресії, тривоги, ПТСР, ОКР та залежностей.',
          url: 'https://doctor-skripnik.com.ua/about',
          image: 'https://doctor-skripnik.com.ua/assets/owner.webp',
          telephone: '+380665691677',
          award: 'Лікар року 2021',
          knowsAbout: ['Депресія', 'Тривожні розлади', 'ПТСР', 'ОКР', 'Біполярний розлад', 'Залежності', 'Психосоматика', 'Неврози'],
          medicalSpecialty: ['Psychiatry', 'Neurology', 'Psychotherapy', 'Addiction Medicine'],
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

  openCredential(doc: Credential): void {
    this.selectedCredential = doc;
  }

  closeCredential(): void {
    this.selectedCredential = null;
  }

  carouselResponsiveOptions = [
    { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
    { breakpoint: '900px',  numVisible: 2, numScroll: 1 },
    { breakpoint: '560px',  numVisible: 1, numScroll: 1 },
  ];

  reviewCarouselOptions = [
    { breakpoint: '1100px', numVisible: 2, numScroll: 1 },
    { breakpoint: '640px',  numVisible: 1, numScroll: 1 },
  ];

  reviews: Review[] = [
    {
      name: 'Анна К.',
      date: 'Квітень 2025',
      rating: 5,
      text: 'Після місяців панічних атак нарешті знайшла лікаря, який пояснив причину та призначив чітке лікування. Євген Васильович — справжній професіонал без зайвих слів.',
    },
    {
      name: 'Олексій М.',
      date: 'Лютий 2025',
      rating: 5,
      text: 'Звернувся з тяжкою депресією. Лікар уважно вислухав, не знецінив стан і підібрав терапію, яка справді спрацювала. Вдячний за людяність та компетентність.',
    },
    {
      name: 'Марія Л.',
      date: 'Грудень 2025',
      rating: 5,
      text: 'Тривожність заважала жити роками. Після консультації отримала зрозумілий план — без зайвих пігулок, лише те, що реально потрібно. Дуже ціную доказовий підхід.',
    },
    {
      name: 'Дмитро В.',
      date: 'Жовтень 2025',
      rating: 5,
      text: 'Звернувся щодо залежності. Лікар без осуду, конкретно і по суті пояснив механізм і шлях виходу. Вперше відчув, що одужання — це реально.',
    },
    {
      name: 'Наталія С.',
      date: 'Серпень 2025',
      rating: 5,
      text: 'Онлайн-консультація пройшла чудово. Євген Васильович відповів на всі питання, розвіяв страхи щодо антидепресантів і дав чіткі рекомендації.',
    },
  ];

  specializations: Specialization[] = [
    {
      title: 'Депресія та депресивні розлади',
      description: 'Діагностика та лікування великого депресивного розладу, дистимії та сезонних депресій за міжнародними протоколами.',
      icon: 'cloud',
    },
    {
      title: 'Тривожні розлади та панічні атаки',
      description: 'Генералізований тривожний розлад, соціофобія, агорафобія та панічний розлад — доказова психотерапія та фармакотерапія.',
      icon: 'pulse',
    },
    {
      title: 'ПТСР та психотравми',
      description: 'Робота з посттравматичним стресовим розладом, гострою стресовою реакцією та наслідками психологічної травми.',
      icon: 'shield',
    },
    {
      title: 'ОКР та обсесивні стани',
      description: 'Обсесивно-компульсивний розлад, нав’язливі думки та ритуали — лікування методами КПТ та ERP-терапії.',
      icon: 'repeat',
    },
    {
      title: 'Біполярний розлад',
      description: 'Стабілізація стану при біполярному афективному розладі І та ІІ типу, підбір нормотиміків і профілактика епізодів.',
      icon: 'arrows',
    },
    {
      title: 'Неврози та психосоматика',
      description: 'Невротичні реакції, психосоматичні симптоми, хронічний стрес та вигорання — комплексний психіатричний підхід.',
      icon: 'brain',
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
}
