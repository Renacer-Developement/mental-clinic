import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TEST_ROUTES } from '../../../../shared/constants/routes.constants';
import { AnimatedSection } from '../../../../shared/animation/animated-section';
import { AnimeModule } from '../../../../shared/animation/anime.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-testing-block',
  templateUrl: './testing-block.component.html',
  styleUrl: './testing-block.component.scss'
})
export class TestingBlockComponent extends AnimatedSection {
  title: string = 'Тестування для раннього виявлення ментальних порушень';
  description: string = 'Отримайте швидкий і надійний аналіз свого психічного стану. Довіртеся доказовій медицині та досвіду.';
  protected readonly TEST_ROUTES = TEST_ROUTES;

  protected setup({ animate, splitText, stagger, utils }: AnimeModule, root: HTMLElement): void {
    const title = splitText('.section-title', { words: { wrap: 'clip' } });
    utils.set(title.words, { translateY: '105%' });
    utils.set(['.section-eyebrow', '.section-desc', '.all-tests-link'], { opacity: 0, translateY: 24 });

    this.whenVisible(root.querySelector('.testing-section__header'), () => {
      animate('.section-eyebrow', { opacity: 1, translateY: 0, duration: 280, ease: 'outExpo' });
      animate(title.words, { translateY: '0%', duration: 280, delay: stagger(45, { start: 33 }), ease: 'outExpo' });
      animate(['.section-desc', '.all-tests-link'], { opacity: 1, translateY: 0, duration: 280, delay: stagger(120, { start: 166 }), ease: 'outExpo' });
    });
  }
}
