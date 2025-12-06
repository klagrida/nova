import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeSupabase } from '@ice-breaker/data-access-supabase';
import config from '../config.json';

function initializeApp() {
  return () => {
    initializeSupabase({
      url: config.supabase.url,
      anonKey: config.supabase.anonKey,
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
    },
  ]
};
