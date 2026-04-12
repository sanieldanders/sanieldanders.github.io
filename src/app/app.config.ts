import { APP_INITIALIZER, ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { DataStoreService } from './core/services/data-store.service';

function initAppData() {
  const store = inject(DataStoreService);
  return () => store.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: APP_INITIALIZER, useFactory: initAppData, multi: true }
  ]
};
