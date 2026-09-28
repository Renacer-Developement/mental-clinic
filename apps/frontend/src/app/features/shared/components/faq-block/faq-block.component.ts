import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../../../shared/primeng-imports.module';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, ImportsModule],
  selector: 'app-faq-block',
  templateUrl: './faq-block.component.html',
  styleUrls: ['./faq-block.component.scss'],
})
export class FaqBlockComponent {
  faqs = [
    {
      question: 'Як проходить онлайн-консультація?',
      answer:
        'Інформування відбудеться у будь-якому зручному для Вас меседжері(Telegram, Viber, Google meet, Zoom) за допомогою відео-зв’язку.',
    },
    {
      question: 'Я боюсь іти до психолога/психіатра. Що мені робити?',
      answer:
        'Відчувати страх перед зверненням до психолога чи психіатра — це нормально. Наші спеціалісти ніколи не засуджують, завжди підтримують і ведуть відкритий діалог. Ви можете познайомитися з нами через Instagram або поставити запитання безкоштовно.',
    },

    {
      question: 'Хто мені потрібен: психолог чи психіатр?',
      answer:
        'Спершу до лікаря - психіатра, він встановлює діагноз, за потреби призначає медикаментозне лікування та направляє до фахівця з психотерапії у відповідному методі.',
    }
  ];
}
