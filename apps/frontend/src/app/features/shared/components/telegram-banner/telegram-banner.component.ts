import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../../../shared/primeng-imports.module';
import { Component } from '@angular/core';
import {TELEGRAM_BANNER} from "../../constants/telegram-banner.constants";
import {GoogleAnalyticsService} from "../../../../analytics/google-analytics.service";
import {EVENT_TRACK} from "../../../../analytics/analytics.constants";
import {ROUTES} from "../../../../shared/constants/routes.constants";

@Component({
  standalone: true,
  imports: [CommonModule, ImportsModule],
  selector: 'app-telegram-banner',
  templateUrl: './telegram-banner.component.html',
  styleUrl: './telegram-banner.component.scss'
})
export class TelegramBannerComponent {
  constructor(private googleAnalyticsService: GoogleAnalyticsService) {}

  openTelegram(name:string,link: string) {
    this.googleAnalyticsService.trackEvent(EVENT_TRACK.TELEGRAM_OPEN, { button_name: name })
    window.open(link, '_blank');

  }

  protected readonly TELEGRAM_BANNER = TELEGRAM_BANNER;
}
