import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingJourneyComponent } from '../../booking-journey/booking-journey.component';
import { ServiceFaqComponent } from '../service-faq.component';
import { ServiceLayout } from '../service-layout';

type Audience = 'adults' | 'children';

/** Психіатр і невролог: blue botanical banner → split hero with two "doors", audience tabs. */
@Component({
  standalone: true,
  imports: [RouterLink, BookingJourneyComponent, ServiceFaqComponent],
  selector: 'app-doctors-page',
  templateUrl: './doctors-page.component.html',
  styleUrl: './doctors-page.component.scss',
})
export class DoctorsPageComponent extends ServiceLayout {
  readonly doors = [
    { title: 'Психіатр', text: 'Настрій, тривога, сон, мислення і поведінка. Діагностика та, за показаннями, підбір ліків.' },
    { title: 'Невролог', text: 'Головний біль, запаморочення, оніміння, наслідки травм і контузій, аналіз МРТ та ЕЕГ.' },
  ];

  readonly audience = signal<Audience>('adults');

  readonly lists: Record<Audience, { psychiatry: string[]; neurology: string[] }> = {
    adults: {
      psychiatry: ['Депресія, апатія', 'Тривога, панічні атаки', 'Безсоння', 'Біполярний розлад, ОКР, ПТСР', 'РДУГ у дорослих', 'Корекція вже призначених ліків'],
      neurology: ['Головний біль, мігрень', 'Запаморочення', 'Оніміння, поколювання', 'Наслідки травм і контузій', 'Розшифрування МРТ, ЕЕГ'],
    },
    children: {
      psychiatry: ['Увага, гіперактивність, імпульсивність', 'Страхи, тривожність', 'Зміни настрою у підлітків', 'Розлади поведінки', 'Особливості розвитку і спілкування'],
      neurology: ['Головний біль у дітей і підлітків', 'Тики', 'Порушення сну', 'Наслідки травм', 'Оцінка за результатами обстежень'],
    },
  };

  readonly prepare = [
    'Список скарг і коли вони почалися',
    'Ліки, які приймаєте, і дози',
    'Виписки, аналізи, МРТ, ЕЕГ',
    'Для дитини — характеристика зі школи чи садка',
    'Тихе місце і стабільний інтернет',
  ];
}
