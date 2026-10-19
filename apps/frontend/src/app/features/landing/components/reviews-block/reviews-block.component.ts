import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImportsModule } from '../../../../shared/primeng-imports.module';
import { ROUTES } from '../../../../shared/constants/routes.constants';
import { CAROUSEL_NAV_BUTTON_PROPS } from '../../../../shared/constants/carousel.constants';
import { Review, ReviewService } from '../../../reviews/review.service';

@Component({
  standalone: true,
  imports: [RouterLink, ImportsModule],
  selector: 'app-reviews-block',
  templateUrl: './reviews-block.component.html',
  styleUrls: ['./reviews-block.component.scss'],
})
export class ReviewsBlockComponent implements OnInit {
  private readonly service = inject(ReviewService);

  protected readonly ROUTES = ROUTES;
  protected readonly navButtonProps = CAROUSEL_NAV_BUTTON_PROPS;

  reviews = signal<Review[]>([]);

  carouselOptions = [
    { breakpoint: '1100px', numVisible: 2, numScroll: 1 },
    { breakpoint: '640px',  numVisible: 1, numScroll: 1 },
  ];

  ngOnInit(): void {
    this.service.getPublic(1, 9).subscribe({
      next: res => this.reviews.set(res.data ?? []),
      error: () => this.reviews.set([]),
    });
  }

  starsArray(n: number): number[] {
    return Array.from({ length: Math.round(n) }, (_, i) => i);
  }
}
