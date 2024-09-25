import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';

export const validationFn = () => {
  const authService = inject(AuthService);
  return !authService.isTokenExpired();
};

export const authGuard: CanActivateFn = (_, __) => {
  const router = inject(Router);
  const validation = validationFn();
  if (!validation) {
    router.navigate(['login']);
  }
  return validation;
};
