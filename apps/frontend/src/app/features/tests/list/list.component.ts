import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ImportsModule } from '../../../shared/primeng-imports.module';
import { TestsGridComponent } from '../components/tests-grid/tests-grid.component';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SECTION } from '../../../shared/constants/section-ids.constants';
import { SeoService } from '../../../core/seo/seo.service';

const BASE_URL = 'https://doctor-skripnik.com.ua';

const CATEGORY_SEO: Record<string, { title: string; description: string; label: string }> = {
  anxiety: {
    label: 'Тести на тривогу',
    title: "Тести на тривогу онлайн — безкоштовно | Центр ментального здоров'я",
    description: 'Клінічно валідовані тести для діагностики тривожних розладів, панічних атак та генералізованої тривоги. Пройдіть тест онлайн та запишіться на консультацію психіатра.',
  },
  depression: {
    label: 'Тести на депресію',
    title: "Тести на депресію онлайн — безкоштовно | Центр ментального здоров'я",
    description: 'Валідовані тести на депресивні розлади: PHQ-9, BDI та інші. Дізнайтесь свій стан та отримайте консультацію психіатра Євгена Скрипника онлайн.',
  },
  'personality-disorders': {
    label: 'Особистісні розлади',
    title: "Тести на особистісні розлади — безкоштовно | Центр ментального здоров'я",
    description: 'Психологічні тести для діагностики особистісних розладів. Клінічно валідовані методики. Безкоштовно онлайн без реєстрації.',
  },
  'behavioral-disorders': {
    label: 'Поведінкові розлади',
    title: "Тести на поведінкові розлади — безкоштовно | Центр ментального здоров'я",
    description: 'Тести для виявлення поведінкових розладів у дорослих і дітей. Клінічно валідовані методики. Пройдіть безкоштовний онлайн-тест.',
  },
  addictions: {
    label: 'Тести на залежності',
    title: "Тести на залежності онлайн — безкоштовно | Центр ментального здоров'я",
    description: 'Клінічно валідовані тести для виявлення залежностей: алкоголізм, наркотики, ігрова залежність. Безкоштовно онлайн.',
  },
  specialized: {
    label: 'Спеціалізовані тести',
    title: "Спеціалізовані психологічні тести — безкоштовно | Центр ментального здоров'я",
    description: 'Спеціалізовані клінічні тести: HADS, PHQ-9, ASRS, PCL-5 та інші. Для поглибленої психіатричної самодіагностики.',
  },
};

@Component({
  standalone: true,
  imports: [CommonModule, ImportsModule, RouterLink, TestsGridComponent],
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly SECTION = SECTION;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

    const type = this.route.snapshot.paramMap.get('type') ?? '';
    const cat = CATEGORY_SEO[type];

    const title = cat?.title ?? "Всі психологічні тести онлайн — безкоштовно | Центр ментального здоров'я";
    const description = cat?.description ?? 'Клінічно валідовані психологічні тести для самодіагностики: тривога, депресія, ПТСР, ОКР, СДУГ, залежності. Безкоштовно. За результатами — консультація психіатра.';
    const canonical = type ? `/test/list/${type}` : '/test/list';
    const label = cat?.label ?? 'Психологічні тести';

    this.seo.updatePage({
      title,
      description,
      canonical,
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        url: `${BASE_URL}${canonical}`,
        description,
        inLanguage: 'uk',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Головна', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Психологічні тести', item: `${BASE_URL}/test` },
            { '@type': 'ListItem', position: 3, name: label, item: `${BASE_URL}${canonical}` },
          ],
        },
      },
    });
  }
}
