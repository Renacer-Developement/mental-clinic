import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../../../shared/primeng-imports.module';
import { AnimatedSection } from '../../../../shared/animation/animated-section';
import { AnimeModule } from '../../../../shared/animation/anime.service';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTES, TEST_ROUTES } from '../../../../shared/constants/routes.constants';
import {TEST_CATEGORIES_CONST} from '../../../tests/constants/test-categories.constants';
import {GoogleAnalyticsService} from "../../../../analytics/google-analytics.service";
import {EVENT_TRACK} from "../../../../analytics/analytics.constants";

interface MentalCard {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  icon: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, ImportsModule, RouterLink],
  selector: 'app-test-block',
  templateUrl: './test-block.component.html',
  styleUrls: ['./test-block.component.scss']
})
export class TestBlockComponent extends AnimatedSection {
  constructor(private googleAnalyticsService: GoogleAnalyticsService) {
    super();
  }

  mentalCards: MentalCard[] = [
    {
      title: 'Депресія',
      description:
        'Депресія – розлад із постійним смутком та втратою інтересу. Дізнайтеся про сучасні методи лікування та підтримку.',
      imageUrl: 'assets/depression.svg',
      link: TEST_CATEGORIES_CONST.DEPRESSION,
      icon: 'depression'
    },
    {
      title: 'Тривога',
      description:
        'Тривога супроводжується надмірним занепокоєнням та страхом. Ознайомтеся з ефективними техніками управління тривогою.',
      imageUrl: 'assets/anxiety.svg',
      link: TEST_CATEGORIES_CONST.ANXIETY,
      icon: 'anxiety'
    },
    {
      title: 'Особистісні розлади',
      description:
        'Розлади особистості впливають на емоції та стосунки. Дізнайтеся про симптоми та сучасні методи терапії.',
      imageUrl: 'assets/disorder.svg',
      link: TEST_CATEGORIES_CONST.PERSONALITY_DISORDERS,
      icon: 'personality'
    },
    {
      title: 'Поведінкові розлади',
      description:
        'Поведінкові розлади характеризуються імпульсивністю та порушенням норм. Ознайомтеся з методами лікування.',
      imageUrl: 'assets/behaviour-disorder.svg',
      link: TEST_CATEGORIES_CONST.BEHAVIORAL_DISORDERS,
      icon: 'behavior'
    },
    {
      title: 'Залежності',
      description:
        'Залежності впливають на всі аспекти життя. Дізнайтеся про види залежностей та ефективні стратегії реабілітації.',
      imageUrl: 'assets/addition-tests.svg',
      link: TEST_CATEGORIES_CONST.ADDICTIONS,
      icon: 'addiction'
    }

  ];
  // Third arg (`source`) is passed from the template but not forwarded to GA4 —
  // page context is already captured by the router-level page_view tracking.
  googleAnalyticsTracker(eventName: string, itemText: string, _source?: string): void {
    this.googleAnalyticsService.trackEvent(eventName, { item_text: itemText });
  }
  protected readonly TEST_ROUTES = TEST_ROUTES;
  protected readonly EVENT_TRACK = EVENT_TRACK;
  protected readonly ROUTES = ROUTES;

  protected setup({ animate, stagger, utils }: AnimeModule, root: HTMLElement): void {
    utils.set('.test-row__line', { scaleX: 0 });
    utils.set('.test-row__title-inner', { translateY: '105%' });
    utils.set(['.test-row__num', '.test-row__desc', '.test-row__go'], { opacity: 0 });
    utils.set('.cards-disclaimer', { opacity: 0 });

    this.whenVisible(root.querySelector('.test-index'), () => {
      animate('.test-row__line', { scaleX: 1, duration: 1100, delay: stagger(110), ease: 'inOutQuart' });
      animate('.test-row__title-inner', { translateY: '0%', duration: 1000, delay: stagger(110, { start: 250 }), ease: 'outExpo' });
      animate(['.test-row__num', '.test-row__desc', '.test-row__go'], {
        opacity: 1, duration: 800, ease: 'outQuad',
        delay: stagger(40, { start: 450 }),
      });
      animate('.cards-disclaimer', { opacity: 1, duration: 800, delay: 1200 });
    }, 0.15);
  }
}
