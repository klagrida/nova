import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeSupabase } from '@ice-breaker/data-access-supabase';

function initializeApp() {
  return () => {
    // Initialize Supabase with environment variables
    // In production, these should come from environment files
    initializeSupabase({
      url: 'https://your-project.supabase.co',
      anonKey: 'your-anon-key',
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
