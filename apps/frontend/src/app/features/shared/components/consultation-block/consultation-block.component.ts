import { Component } from '@angular/core';
import { AnimatedSection } from '../../../../shared/animation/animated-section';
import { AnimeModule } from '../../../../shared/animation/anime.service';

@Component({
  standalone: true,
  selector: 'app-consultation-block',
  templateUrl: './consultation-block.component.html',
  styleUrls: ['./consultation-block.component.scss'],
})
export class ConsultationBlockComponent extends AnimatedSection {
  steps = [
    {
      title: `Зв’яжіться з адміністратором`,
      description: `Зателефонуйте або напишіть — адміністратор відповість на всі запитання та допоможе підібрати зручний час.`,
    },
    {
      title: `Оберіть фахівця`,
      description: `Разом із адміністратором ви підберете лікаря з потрібною спеціалізацією, який найкраще відповідає вашому запиту.`,
    },
    {
      title: `Пройдіть консультацію`,
      description: `Консультація проходить у зручний для вас час — онлайн, з будь-якого місця. Перший крок до вашого ментального здоров’я.`,
    },
  ];

  protected setup({ animate, createTimeline, stagger, utils }: AnimeModule, root: HTMLElement): void {
    utils.set(['.consultation-eyebrow', '.consultation-title', '.consultation-cta'], { opacity: 0, translateY: 30 });
    utils.set('.timeline__progress', { scaleX: 0 });
    utils.set('.step__dot', { scale: 0 });
    utils.set('.step__num', { opacity: 0, translateY: 40 });
    utils.set(['.step__title', '.step__desc'], { opacity: 0, translateY: 16 });

    this.whenVisible(root.querySelector('.consultation-header'), () => {
      animate(['.consultation-eyebrow', '.consultation-title', '.consultation-cta'], {
        opacity: 1, translateY: 0, duration: 280, delay: stagger(120), ease: 'outExpo',
      });
    });

    // The progress line travels across, lighting up each step as it passes.
    this.whenVisible(root.querySelector('.timeline'), () => {
      const steps = Array.from(root.querySelectorAll<HTMLElement>('.step'));
      const tl = createTimeline({ defaults: { ease: 'outExpo' } })
        .add('.timeline__progress', { scaleX: 1, duration: 280, ease: 'inOutSine' }, 0);

      steps.forEach((step, i) => {
        const at = i * 700;
        tl.add(step.querySelector('.step__dot')!, { scale: [0, 1.4, 1], duration: 280, ease: 'outBack(2)' }, at)
          .add(step.querySelector('.step__num')!, { opacity: 1, translateY: 0, duration: 280 }, at)
          .add([step.querySelector('.step__title')!, step.querySelector('.step__desc')!], {
            opacity: 1, translateY: 0, duration: 280, delay: stagger(90),
          }, at + 150);
      });
    }, 0.3);
  }
}
