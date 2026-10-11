import { Component } from '@angular/core';
import { AnimatedSection } from '../../../../shared/animation/animated-section';
import { AnimeModule } from '../../../../shared/animation/anime.service';

interface FearFact {
  title: string;
  text: string;
}

@Component({
  standalone: true,
  selector: 'app-no-fear-block',
  templateUrl: './no-fear-block.component.html',
  styleUrl: './no-fear-block.component.scss'
})
export class NoFearBlockComponent extends AnimatedSection {
  facts: FearFact[] = [
    {
      title: 'Психіатр — це лікар, а не вирок',
      text: 'Звернення до психіатра не впливає на вашу роботу, водійське посвідчення чи соціальний статус. Це медична допомога — така ж звичайна, як похід до терапевта чи кардіолога.'
    },
    {
      title: 'Конфіденційність гарантована',
      text: 'Усі консультації захищені лікарською таємницею. Ніхто — ні роботодавець, ні родичі — не дізнається про ваш візит без вашої письмової згоди.'
    },
    {
      title: 'Ліки — не назавжди',
      text: 'Медикаментозне лікування призначається лише за потреби, у мінімально необхідних дозах і на чітко визначений строк. Мета — відновити ваш стан, а не створити залежність.'
    },
    {
      title: 'Рання допомога — кращий результат',
      text: 'Що раніше звернутися по допомогу, то коротший і легший шлях до одужання. Не чекайте, поки стан погіршиться — психічне здоров\'я заслуговує уваги зараз.'
    }
  ];

  protected setup({ animate, onScroll, stagger, utils }: AnimeModule, root: HTMLElement): void {
    // Progress bar fills as the list scrolls past.
    animate('.no-fear-progress__bar', {
      scaleY: [0, 1],
      ease: 'linear',
      autoplay: onScroll({
        target: root.querySelector<HTMLElement>('.fact-list')!,
        enter: { container: 'bottom', target: 'top' },
        leave: { container: 'center', target: 'bottom' },
        sync: 0.25,
      }),
    });

    utils.set(['.no-fear-eyebrow', '.no-fear-heading', '.no-fear-lead'], { opacity: 0, translateY: 40 });
    this.whenVisible(root.querySelector('.no-fear-sticky'), () => {
      animate(['.no-fear-eyebrow', '.no-fear-heading', '.no-fear-lead'], {
        opacity: 1, translateY: 0, duration: 1000, delay: stagger(120), ease: 'outExpo',
      });
    });

    // Each card flips up and its number counts in as it enters.
    root.querySelectorAll<HTMLElement>('.fact-card').forEach(card => {
      const num = card.querySelector('.fact-num');
      utils.set(card, { opacity: 0, translateY: 80, rotateX: -25, perspective: 900 });
      utils.set(num, { opacity: 0, translateX: -30 });
      this.whenVisible(card, () => {
        animate(card, { opacity: 1, translateY: 0, rotateX: 0, duration: 1100, ease: 'outExpo' });
        animate(num!, { opacity: 1, translateX: 0, duration: 900, delay: 200, ease: 'outBack(1.4)' });
      }, 0.25);
    });
  }
}
