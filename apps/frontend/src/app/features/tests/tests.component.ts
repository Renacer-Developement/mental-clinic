import { RouterOutlet } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.scss',
})
export class TestsComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updatePage({
      title: "Психологічні тести онлайн — безкоштовно | Центр ментального здоров'я",
      description: "Клінічно валідовані психологічні тести для самодіагностики: тривога, депресія, ПТСР, ОКР, СДУГ, залежності. Безкоштовно. За результатами — консультація психіатра.",
      canonical: '/test',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Психологічні тести онлайн',
        url: 'https://doctor-skripnik.com.ua/test',
        description: 'Клінічно валідовані психологічні тести для самодіагностики: тривога, депресія, ПТСР, ОКР, СДУГ та залежності.',
        inLanguage: 'uk',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Головна', item: 'https://doctor-skripnik.com.ua/' },
            { '@type': 'ListItem', position: 2, name: 'Психологічні тести', item: 'https://doctor-skripnik.com.ua/test' },
          ],
        },
        mainEntity: {
          '@type': 'ItemList',
          name: 'Психологічні тести',
          description: 'Клінічно валідовані тести для самодіагностики психічного здоров\'я',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Тести на тривогу', url: 'https://doctor-skripnik.com.ua/test/list/anxiety' },
            { '@type': 'ListItem', position: 2, name: 'Тести на депресію', url: 'https://doctor-skripnik.com.ua/test/list/depression' },
            { '@type': 'ListItem', position: 3, name: 'Тести на особистісні розлади', url: 'https://doctor-skripnik.com.ua/test/list/personality-disorders' },
            { '@type': 'ListItem', position: 4, name: 'Тести на поведінкові розлади', url: 'https://doctor-skripnik.com.ua/test/list/behavioral-disorders' },
            { '@type': 'ListItem', position: 5, name: 'Тести на залежності', url: 'https://doctor-skripnik.com.ua/test/list/addictions' },
            { '@type': 'ListItem', position: 6, name: 'Спеціалізовані тести', url: 'https://doctor-skripnik.com.ua/test/list/specialized' },
          ],
        },
      },
    });
  }
}
