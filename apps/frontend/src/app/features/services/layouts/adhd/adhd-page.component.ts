import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingJourneyComponent } from '../../booking-journey/booking-journey.component';
import { ServiceFaqComponent } from '../service-faq.component';
import { ServiceLayout } from '../service-layout';

/** Діагностика РДУГ: peach banner with a big coral "РДУГ" → typographic hero, test "screen", equation strip. */
@Component({
  standalone: true,
  imports: [RouterLink, BookingJourneyComponent, ServiceFaqComponent],
  selector: 'app-adhd-page',
  templateUrl: './adhd-page.component.html',
  styleUrl: './adhd-page.component.scss',
})
export class AdhdPageComponent extends ServiceLayout {
  readonly measures = [
    { name: 'Увага', text: 'як довго вдається втримати фокус' },
    { name: 'Час реакції', text: 'наскільки швидко і стабільно' },
    { name: 'Імпульсивність', text: 'чи вдається стримати зайву реакцію' },
    { name: 'Гіперактивність', text: 'скільки зайвих рухів під час завдання' },
  ];

  /** The 5×5 stimulus grid on the "screen"; one cell is the target */
  readonly cells = Array.from({ length: 25 }, (_, i) => i);

  readonly signs = {
    children: [
      'Складно зосередитися на уроках і домашніх завданнях',
      'Непосидючість, постійно в русі',
      'Перебиває, складно дочекатися своєї черги',
      'Губить речі, забуває доручення',
      'Скарги вчителів на поведінку чи неуважність',
    ],
    adults: [
      'Хронічне відкладання справ, пропущені дедлайни',
      'Хаос у справах, забуті зустрічі',
      'Імпульсивні рішення та покупки',
      'Внутрішній неспокій, складно розслабитися',
      'Труднощі були помітні ще в дитинстві',
    ],
  };
}
