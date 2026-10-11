import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    // Reuses the server-rendered DOM and the API responses fetched during SSR (HTTP transfer
    // cache), so the browser doesn't refetch tests/articles — a failed client refetch would
    // otherwise swap the page for the noindex "not found" view
    provideClientHydration(withEventReplay()),
    providePrimeNG({ theme: { preset: Lara, options: { darkModeSelector: false } } }),
  ],
};
