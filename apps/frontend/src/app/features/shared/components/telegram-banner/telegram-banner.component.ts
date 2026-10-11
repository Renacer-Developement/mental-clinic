import { Component } from '@angular/core';
import {TELEGRAM_BANNER} from "../../constants/telegram-banner.constants";
import {GoogleAnalyticsService} from "../../../../analytics/google-analytics.service";
import {EVENT_TRACK} from "../../../../analytics/analytics.constants";
import { AnimatedSection } from '../../../../shared/animation/animated-section';
import { AnimeModule } from '../../../../shared/animation/anime.service';

@Component({
  standalone: true,
  selector: 'app-telegram-banner',
  templateUrl: './telegram-banner.component.html',
  styleUrl: './telegram-banner.component.scss'
})
export class TelegramBannerComponent extends AnimatedSection {
  readonly chats = [TELEGRAM_BANNER.PSYCHOLOGIST_CHAT, TELEGRAM_BANNER.PSYCHIATRIST_CHAT];

  constructor(private googleAnalyticsService: GoogleAnalyticsService) {
    super();
  }

  openTelegram(name:string,link: string) {
    this.googleAnalyticsService.trackEvent(EVENT_TRACK.TELEGRAM_OPEN, { button_name: name })
    window.open(link, '_blank');

  }

  protected setup({ animate, splitText, stagger, utils }: AnimeModule, root: HTMLElement): void {
    const heading = splitText('.tg-heading', { words: { wrap: 'clip' } });
    utils.set(heading.words, { translateY: '105%' });
    utils.set(['.tg-eyebrow', '.tg-subheading'], { opacity: 0, translateY: 20 });
    utils.set('.tg-link__line', { scaleX: 0 });
    utils.set(['.tg-link__label', '.tg-link svg'], { opacity: 0, translateX: -20 });

    this.whenVisible(root.querySelector('.tg-container'), () => {
      animate('.tg-eyebrow', { opacity: 1, translateY: 0, duration: 800, ease: 'outExpo' });
      animate(heading.words, { translateY: '0%', duration: 1000, delay: stagger(50, { start: 100 }), ease: 'outExpo' });
      animate('.tg-subheading', { opacity: 1, translateY: 0, duration: 900, delay: 500, ease: 'outExpo' });
      animate('.tg-link__line', { scaleX: 1, duration: 1000, delay: stagger(150, { start: 300 }), ease: 'inOutQuart' });
      animate(['.tg-link__label', '.tg-link svg'], { opacity: 1, translateX: 0, duration: 900, delay: stagger(80, { start: 600 }), ease: 'outExpo' });
    }, 0.3);
  }
}
