import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ImportsModule } from '../../shared/primeng-imports.module';
import { SeoService } from '../../core/seo/seo.service';
import { ReviewService, Review, SubmitReview } from './review.service';
import { ClinicContactsService } from '../shared/components/clinic-contacts-dialog/clinic-contacts.service';
import { clinicContacts } from '../shared/constants/contacts.constants';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ImportsModule],
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  private readonly seo      = inject(SeoService);
  private readonly service  = inject(ReviewService);
  private readonly contacts = inject(ClinicContactsService);

  reviews       = signal<Review[]>([]);
  loading       = signal(true);
  loadingMore   = signal(false);
  hasMore       = signal(false);
  totalCount    = signal(0);
  avgRating     = signal(5);

  submitLoading = signal(false);
  submitDone    = signal(false);
  submitError   = signal('');

  private page = 0;
  private readonly pageSize = 9;

  // form fields
  formName   = '';
  formText   = '';
  formRating = 5;

  // validation flags
  nameTouched   = false;
  textTouched   = false;
  ratingTouched = false;

  readonly stars = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.seo.updatePage({
      title: "Відгуки пацієнтів — Євген Скрипник | Центр ментального здоров'я",
      description: 'Реальні відгуки пацієнтів про психіатра Євгена Скрипника. Онлайн консультації, доказова психіатрія, відкритий підхід.',
      canonical: '/reviews',
      ogType: 'website',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        url: 'https://doctor-skripnik.com.ua/reviews',
        name: 'Відгуки пацієнтів — Євген Скрипник',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Головна', item: 'https://doctor-skripnik.com.ua/' },
            { '@type': 'ListItem', position: 2, name: 'Відгуки', item: 'https://doctor-skripnik.com.ua/reviews' },
          ],
        },
      },
    });

    this.loadPage(1);
  }

  loadMore(): void {
    if (this.hasMore() && !this.loadingMore()) this.loadPage(this.page + 1);
  }

  private loadPage(page: number): void {
    if (page === 1) this.loading.set(true);
    else this.loadingMore.set(true);

    this.service.getPublic(page, this.pageSize).subscribe({
      next: (result) => {
        this.reviews.update(prev => page === 1 ? result.data : [...prev, ...result.data]);
        this.totalCount.set(result.total);
        this.avgRating.set(result.avgRating);
        this.hasMore.set(result.hasMore);
        this.page = page;
        this.loading.set(false);
        this.loadingMore.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadingMore.set(false);
      },
    });
  }

  starsArray(n: number): number[] {
    return Array.from({ length: Math.round(n) }, (_, i) => i);
  }

  setRating(r: number): void {
    this.formRating = r;
    this.ratingTouched = true;
  }

  isFormValid(): boolean {
    return this.formName.trim().length >= 2 &&
           this.formText.trim().length >= 10 &&
           this.formRating >= 1;
  }

  onSubmit(): void {
    this.nameTouched   = true;
    this.textTouched   = true;
    this.ratingTouched = true;

    if (!this.isFormValid()) return;

    const payload: SubmitReview = {
      name:   this.formName.trim(),
      text:   this.formText.trim(),
      rating: this.formRating,
    };

    this.submitLoading.set(true);
    this.submitError.set('');

    this.service.submit(payload).subscribe({
      next: () => {
        this.submitLoading.set(false);
        this.submitDone.set(true);
        this.formName   = '';
        this.formText   = '';
        this.formRating = 5;
        this.nameTouched   = false;
        this.textTouched   = false;
        this.ratingTouched = false;
      },
      error: () => {
        this.submitLoading.set(false);
        this.submitError.set('Помилка надсилання. Спробуйте ще раз.');
      },
    });
  }

  openContacts(): void {
    this.contacts.openDialog(clinicContacts);
  }
}
