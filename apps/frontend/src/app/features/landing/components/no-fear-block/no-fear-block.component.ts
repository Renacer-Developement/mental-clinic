import { Component, signal } from '@angular/core';
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

  /** Phones only: which fact is expanded (the first one by default). */
  readonly openFact = signal<number | null>(0);

  toggle(i: number): void {
    this.openFact.update(open => (open === i ? null : i));
  }

  protected setup({ animate, stagger, utils }: AnimeModule, root: HTMLElement): void {
    utils.set(['.no-fear-eyebrow', '.no-fear-heading', '.no-fear-lead'], { opacity: 0, translateY: 24 });
    this.whenVisible(root.querySelector('.no-fear-sticky'), () => {
      animate(['.no-fear-eyebrow', '.no-fear-heading', '.no-fear-lead'], {
        opacity: 1, translateY: 0, duration: 280, delay: stagger(100), ease: 'outExpo',
      });
    });

    utils.set('.fact-card', { opacity: 0, translateY: 24 });
    this.whenVisible(root.querySelector('.fact-list'), () => {
      animate('.fact-card', { opacity: 1, translateY: 0, duration: 280, delay: stagger(90), ease: 'outExpo' });
    }, 0.2);
  }
}
