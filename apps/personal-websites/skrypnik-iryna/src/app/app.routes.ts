import { Routes } from '@angular/router';
import {Home} from './pages/home/home';
import {PublichnyiDogovir} from './pages/publichnyi-dogovir/publichnyi-dogovir';

export const routes: Routes = [
  { path: '', component: Home, title: 'Скрипник Ірина — Інформаційні послуги з психіатрії' },
  { path: 'publichnyi-dogovir', component: PublichnyiDogovir, title: 'Публічний договір — Скрипник Ірина' },
  { path: '**', redirectTo: '' },
];
