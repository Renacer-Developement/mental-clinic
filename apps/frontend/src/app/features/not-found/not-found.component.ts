import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-not-found',
  template: `
    <div class="nf">
      <div class="nf__code">404</div>
      <h1 class="nf__title">{{ title }}</h1>
      <p class="nf__desc">{{ description }}</p>
      <a [routerLink]="ctaLink" class="nf__btn">{{ ctaLabel }}</a>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex: 1;
    }
    .nf {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      padding: 24px;
      text-align: center;
      font-family: 'Inter', sans-serif;
    }
    .nf__code {
      font-size: clamp(72px, 20vw, 140px);
      font-weight: 800;
      color: #003168;
      line-height: 1;
      opacity: .08;
      margin-bottom: -16px;
      user-select: none;
    }
    .nf__title {
      font-size: clamp(20px, 4vw, 28px);
      font-weight: 700;
      color: #003168;
      margin: 0 0 12px;
    }
    .nf__desc {
      font-size: 16px;
      color: #718096;
      max-width: 420px;
      margin: 0 0 32px;
      line-height: 1.6;
    }
    .nf__btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 28px;
      background: #5f75d6;
      color: #fff;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      transition: background .18s;
      &:hover { background: #4a5fc0; }
    }
  `],
})
export class NotFoundComponent implements OnInit {
  private readonly seo = inject(SeoService);

  @Input() title       = 'Сторінку не знайдено';
  @Input() description = 'Можливо, посилання застаріле або сторінки ніколи не існувало.';
  @Input() ctaLink     = '/';
  @Input() ctaLabel    = '← На головну';

  ngOnInit(): void {
    this.seo.updatePage({
      title: 'Сторінку не знайдено — 404',
      description: 'Можливо, посилання застаріле або сторінки ніколи не існувало.',
      robots: 'noindex, follow',
    });
  }
}
