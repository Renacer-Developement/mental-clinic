import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImportsModule } from '../../shared/primeng-imports.module';
import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  standalone: true,
  imports: [CommonModule, ImportsModule, RouterLink],
  selector: 'app-drugs',
  templateUrl: './drugs.component.html',
  styleUrl: './drugs.component.scss',
})
export class DrugsComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updatePage({
      title: "Перевірка ліків та взаємодія препаратів — доказова медицина | Євген Скрипник",
      description: "Перевірте взаємодію ліків та рівень доказовості препаратів за допомогою надійних медичних баз даних. Medscape, Drugs.com — актуальна інформація для безпечного лікування.",
      canonical: '/drugs',
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'MedicalWebPage',
          name: 'Перевірка ліків та взаємодія препаратів',
          url: 'https://doctor-skripnik.com.ua/drugs',
          description: 'Ресурси для перевірки взаємодії ліків та рівня доказовості препаратів. Medscape Drug Interaction Checker, Drugs.com.',
          inLanguage: 'uk',
          audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Головна', item: 'https://doctor-skripnik.com.ua/' },
              { '@type': 'ListItem', position: 2, name: 'Перевірка ліків', item: 'https://doctor-skripnik.com.ua/drugs' },
            ],
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'Як перевірити взаємодію ліків',
          description: 'Покрокова інструкція перевірки взаємодії препаратів за допомогою медичних баз даних',
          step: [
            {
              '@type': 'HowToStep',
              position: 1,
              name: 'Відкрийте перевірювач взаємодій',
              text: 'Перейдіть на Medscape Drug Interaction Checker або Drugs.com — провідні медичні бази даних.',
            },
            {
              '@type': 'HowToStep',
              position: 2,
              name: 'Введіть назви препаратів',
              text: 'Введіть назви всіх препаратів, які ви приймаєте або плануєте приймати.',
            },
            {
              '@type': 'HowToStep',
              position: 3,
              name: 'Проконсультуйтесь з лікарем',
              text: 'Результати перевірки — лише інформація. Остаточне рішення про лікування приймає лікар. Запишіться на консультацію до психіатра Євгена Скрипника.',
            },
          ],
        },
      ],
    });
  }
}
