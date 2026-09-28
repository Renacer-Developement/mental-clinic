import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { MainPageComponent } from './content/main-page/main-page.component';
import { ContractComponent } from './content/contract/contract.component';
import {CommonModule} from "@angular/common";
import { PricingComponent } from './content/pricing/pricing.component';

const routes: Routes = [
  { path: '', component: MainPageComponent, pathMatch: 'full' }, // головна
  { path: 'contract', component: ContractComponent },             // договір
  { path: 'pricing', component: PricingComponent },             // договір
  { path: '**', redirectTo: '' },                                 // 404 -> головна
];

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    PricingComponent, // додано
  ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        ContractComponent,
        // !! НЕ додаємо RouterOutlet тут — він іде з RouterModule
    ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
