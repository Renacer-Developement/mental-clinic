import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Only the PrimeNG modules actually referenced in templates (<p-accordion>,
// <p-button>, <p-carousel>, <p-progressSpinner>, <p-skeleton>) — everything
// else PrimeNG ships (Galleria, TreeTable, OrganizationChart, etc.) was
// imported here unused and bloated every bundle that imports this module.
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AccordionModule,
    ButtonModule,
    CarouselModule,
    ProgressSpinnerModule,
    SkeletonModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    AccordionModule,
    ButtonModule,
    CarouselModule,
    ProgressSpinnerModule,
    SkeletonModule,
  ],
})
export class ImportsModule {}
