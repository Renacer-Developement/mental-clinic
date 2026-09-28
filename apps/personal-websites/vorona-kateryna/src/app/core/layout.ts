import { Component } from '@angular/core';
import {Footer} from '../shared/components/footer/footer';
import {Header} from '../shared/components/header/header';

@Component({
  selector: 'app-layout',
  imports: [
    Footer,
    Header
  ],
  templateUrl: './layout.html',
  styles: ``
})
export class Layout {

}
