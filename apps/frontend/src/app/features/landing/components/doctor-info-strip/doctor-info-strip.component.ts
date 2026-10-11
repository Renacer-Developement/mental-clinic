import { Component } from '@angular/core';
import { AnimatedSection } from '../../../../shared/animation/animated-section';
import { AnimeModule } from '../../../../shared/animation/anime.service';

@Component({
  standalone: true,
  selector: 'app-doctor-info-strip',
  templateUrl: './doctor-info-strip.component.html',
  styleUrl: './doctor-info-strip.component.scss'
})
export class DoctorInfoStripComponent extends AnimatedSection {
  readonly specialties = [
    { title: 'Психіатр', text: 'Депресія, тривожні розлади, ПТСР, ОКР' },
    { title: 'Невролог', text: 'Неврози та стани, повʼязані з нервовою системою' },
    { title: 'Нарколог', text: 'Діагностика та лікування залежностей' },
  ];

  protected setup({ animate, stagger, utils }: AnimeModule, root: HTMLElement): void {
    const counter = root.querySelector<HTMLElement>('[data-count]');

    utils.set('.strip-title__line', { opacity: 0, translateY: 40 });
    utils.set(['.strip-desc', '.strip-meta'], { opacity: 0, translateY: 20 });
    utils.set('.strip-rule', { scaleX: 0 });
    utils.set('.strip-years', { opacity: 0 });
    utils.set('.spec__line', { scaleX: 0 });
    utils.set(['.spec__num', '.spec__title', '.spec__text'], { opacity: 0, translateY: 16 });

    this.whenVisible(root.querySelector('.strip-head'), () => {
      animate('.strip-title__line', { opacity: 1, translateY: 0, duration: 1000, delay: stagger(130), ease: 'outExpo' });
      animate(['.strip-desc', '.strip-meta'], { opacity: 1, translateY: 0, duration: 900, delay: stagger(120, { start: 250 }), ease: 'outExpo' });
      animate('.strip-rule', { scaleX: 1, duration: 1400, delay: 300, ease: 'inOutQuart' });
    }, 0.3);

    this.whenVisible(root.querySelector('.strip-body'), () => {
      animate('.strip-years', { opacity: 1, duration: 600, ease: 'outQuad' });
      if (counter) {
        const state = { n: 0 };
        animate(state, {
          n: Number(counter.dataset['count']),
          duration: 1600,
          ease: 'outExpo',
          onUpdate: () => (counter.textContent = String(Math.round(state.n))),
        });
      }
      animate('.spec__line', { scaleX: 1, duration: 1000, delay: stagger(150, { start: 200 }), ease: 'inOutQuart' });
      animate(['.spec__num', '.spec__title', '.spec__text'], {
        opacity: 1, translateY: 0, duration: 800, ease: 'outExpo',
        delay: stagger(60, { start: 450 }),
      });
    }, 0.3);
  }
}
