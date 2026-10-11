import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { CONDITIONS } from '../../../conditions/conditions.data';

/** Home-page entry point into the /likuvannya-* condition pages. */
@Component({
  standalone: true,
  imports: [RouterLink, RevealDirective],
  selector: 'app-conditions-block',
  templateUrl: './conditions-block.component.html',
  styleUrls: ['./conditions-block.component.scss'],
})
export class ConditionsBlockComponent {
  readonly conditions = CONDITIONS;
}
