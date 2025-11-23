import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Si ya hay sesión, no permitas entrar a login/register
  if (auth.isAuthenticated() && auth.user) {
    router.navigateByUrl('/');
    return false;
  }
  return true;
};