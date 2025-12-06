import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth service to finish initializing (max 5 seconds)
  const maxWaitTime = 5000;
  const startTime = Date.now();

  while (authService.loading()) {
    if (Date.now() - startTime > maxWaitTime) {
      console.error('Auth guard timeout waiting for auth service initialization');
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/login');
};
