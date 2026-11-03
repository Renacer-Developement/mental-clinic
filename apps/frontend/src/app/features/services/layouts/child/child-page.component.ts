import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingJourneyComponent } from '../../booking-journey/booking-journey.component';
import { ServiceFaqComponent } from '../service-faq.component';
import { ServiceLayout } from '../service-layout';

/** Дитячий психолог: pastel banner with toy blocks and a rainbow → soft, rounded, playful. */
@Component({
  standalone: true,
  imports: [RouterLink, BookingJourneyComponent, ServiceFaqComponent],
  selector: 'app-child-page',
  templateUrl: './child-page.component.html',
  styleUrl: './child-page.component.scss',
})
export class ChildPageComponent extends ServiceLayout {
  readonly tips = [
    { title: 'Поясніть простими словами', text: 'Наприклад: «Це людина, яка допомагає дітям і дорослим розібратися з почуттями». Без слів «лікар» чи «щось не так з тобою».' },
    { title: 'Не робіть із сесії нагороду чи покарання', text: 'Зустріч із психологом — звичайна турбота, як візит до стоматолога, а не наслідок поганої поведінки.' },
    { title: 'Підготуйте тихе місце', text: 'Для онлайн-зустрічі — кімната, де дитину ніхто не перериватиме, і зручний пристрій із камерою.' },
  ];
}
