import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../shared/primeng-imports.module';
import { HeroBannerComponent } from '../shared/components/hero-banner/hero-banner.component';
import { TestingBlockComponent } from '../shared/components/testing-block/testing-block.component';
import { TestBlockComponent } from './components/test-block/test-block.component';
import { ConsultationBlockComponent } from '../shared/components/consultation-block/consultation-block.component';
import { FaqBlockComponent } from '../shared/components/faq-block/faq-block.component';
import { TelegramBannerComponent } from '../shared/components/telegram-banner/telegram-banner.component';
import { DoctorInfoStripComponent } from './components/doctor-info-strip/doctor-info-strip.component';
import { NoFearBlockComponent } from './components/no-fear-block/no-fear-block.component';
import { AfterViewInit, Component, ElementRef, inject, OnInit, PLATFORM_ID, Renderer2, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SECTION } from '../../shared/constants/section-ids.constants';
import { ROUTES } from '../../shared/constants/routes.constants';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { LatestArticlesComponent } from '../articles/components/latest-articles/latest-articles.component';
import { ContractApiService } from '../contract/contract.service';

@Component({
  standalone: true,
  imports: [CommonModule, ImportsModule, RouterLink, HeroBannerComponent, DoctorInfoStripComponent, NoFearBlockComponent, TestingBlockComponent, TestBlockComponent, ConsultationBlockComponent, TelegramBannerComponent, LatestArticlesComponent],
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, AfterViewInit {
  private readonly renderer    = inject(Renderer2);
  private readonly el          = inject(ElementRef);
  private readonly seo         = inject(SeoService);
  private readonly contractApi = inject(ContractApiService);
  private readonly platformId  = inject(PLATFORM_ID);

  isHeroBannerVisible = false;
  isTestingBlockVisible = false;
  isConsultationBlockVisible = false;
  isFaqBlockVisible = false;
  isTelegramBannerVisible = false;
  contractVisible = signal(true);
  protected readonly SECTION = SECTION;
  protected readonly ROUTES = ROUTES;

  ngOnInit(): void {
    this.contractApi.get().subscribe({
      next: (doc) => this.contractVisible.set(doc.visible !== false),
      error: ()    => this.contractVisible.set(false),
    });
    this.seo.updatePage({
      title: "Ментальне здоров'я Євгена Скрипника — психіатр онлайн",
      description: "Психіатр Євген Скрипник — 20+ років досвіду. Лікування депресії, тривоги, ПТСР, ОКР та залежностей онлайн. Доказова медицина. Запис щодня 8:00–22:00.",
      canonical: '/',
      schema: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://doctor-skripnik.com.ua/#webpage',
          url: 'https://doctor-skripnik.com.ua/',
          name: "Онлайн центр ментального здоров'я Євгена Скрипника",
          description: "Психіатр Євген Скрипник — 20+ років досвіду. Лікування депресії, тривоги, ПТСР та залежностей методами доказової медицини.",
          inLanguage: 'uk',
          isPartOf: { '@id': 'https://doctor-skripnik.com.ua/#website' },
          about: { '@id': 'https://doctor-skripnik.com.ua/#organization' },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Головна', item: 'https://doctor-skripnik.com.ua/' }],
          },
        },
      ],
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.observeElement('#hero-banner', 'isHeroBannerVisible');
    this.observeElement('#testing-block', 'isTestingBlockVisible');
    this.observeElement('#consultation-block', 'isConsultationBlockVisible');
    this.observeElement('#faq-block', 'isFaqBlockVisible');
    this.observeElement('#telegram-banner', 'isTelegramBannerVisible');
  }

  private observeElement(selector: string, stateVariable: string) {
    const element = this.el.nativeElement.querySelector(selector);
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this[stateVariable] = true;
          observer.unobserve(entry.target);
        }
      },
      {threshold: 0.1}
    );

    observer.observe(element);
  }
}
