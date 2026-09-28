import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-consultation-block',
  templateUrl: './consultation-block.component.html',
  styleUrls: ['./consultation-block.component.scss'],
})
export class ConsultationBlockComponent {
  steps = [
    {
      title: `Зв’яжіться з адміністратором`,
      description: `Зателефонуйте або напишіть — адміністратор відповість на всі запитання та допоможе підібрати зручний час.`,
      icon: 'chat',
    },
    {
      title: `Оберіть фахівця`,
      description: `Разом із адміністратором ви підберете лікаря з потрібною спеціалізацією, який найкраще відповідає вашому запиту.`,
      icon: 'person',
    },
    {
      title: `Пройдіть консультацію`,
      description: `Консультація проходить у зручний для вас час — онлайн або в клініці. Перший крок до вашого ментального здоров’я.`,
      icon: 'calendar',
    },
  ];
}
