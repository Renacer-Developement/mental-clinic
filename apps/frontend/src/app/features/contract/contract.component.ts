import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SeoService } from '../../core/seo/seo.service';
import { ContractApiService } from './contract.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss',
})
export class ContractComponent implements OnInit {
  private readonly seo       = inject(SeoService);
  private readonly api       = inject(ContractApiService);
  private readonly sanitizer = inject(DomSanitizer);

  safeContent = signal<SafeHtml>('');
  loading     = signal(true);
  error       = signal(false);
  notFound    = signal(false);

  private processContent(html: string): string {
    return html
      // Quill inserts &nbsp; between words — replace with regular spaces so text wraps normally
      .replace(/&nbsp;/gi, ' ')
      .replace(/&#160;/g, ' ')
      .replace(/&#xA0;/gi, ' ')
      .replace(/ /g, ' ')
      // Strip inline color/font-size styles from spans so our CSS controls the appearance
      .replace(/<span([^>]*)\bstyle="[^"]*"([^>]*)>/gi, '<span$1$2>');
  }

  ngOnInit(): void {
    this.seo.updatePage({
      title: "Публічний договір (оферта) | Євген Скрипник",
      description: "Публічний договір про надання інформаційних послуг онлайн центром ментального здоров'я Євгена Скрипника. Умови надання консультацій, оплати та повернення коштів.",
      canonical: '/contract',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: "Публічний договір — Онлайн центр ментального здоров'я",
        url: 'https://doctor-skripnik.com.ua/contract',
        description: "Публічний договір про надання інформаційних послуг ФОП Скрипник Є.В.",
        inLanguage: 'uk',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Головна', item: 'https://doctor-skripnik.com.ua/' },
            { '@type': 'ListItem', position: 2, name: 'Публічний договір', item: 'https://doctor-skripnik.com.ua/contract' },
          ],
        },
      },
    });

    this.api.get().subscribe({
      next: (doc) => {
        if (doc.visible === false) {
          this.notFound.set(true);
          this.loading.set(false);
          return;
        }
        this.safeContent.set(this.sanitizer.bypassSecurityTrustHtml(this.processContent(doc.content)));
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
