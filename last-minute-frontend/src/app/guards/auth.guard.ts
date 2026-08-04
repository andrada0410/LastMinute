import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const allowedRoles = route.data['roles'] as Array<string>;
  const allowUnauthenticated = route.data['allowUnauthenticated'] === true;

  if (!authService.isLoggedIn()) {
    if (allowUnauthenticated) {
      return true;
    }

    toastService.error('Acces interzis! Te rugăm sa te loghezi pentru a accesa această pagină.', 'Sesiune expirată');
    return router.createUrlTree(['/login']);
  }  

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const user = authService.currentUser();
  const userRole = user?.role;

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  toastService.error('Acces interzis! Nu ai permisiunea necesară pentru a accesa această pagină.', 'Acces interzis');
  return router.createUrlTree(['/']);
};