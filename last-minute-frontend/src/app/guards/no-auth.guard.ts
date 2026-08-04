import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const noAuthGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const toastService = inject(ToastService);

    if (authService.isLoggedIn()) {
        toastService.error('Nu puteți accesa această pagină deoarece sunteți deja autentificat.', 'Autentificare');
        return router.createUrlTree(['/']);
    }

    return true;
}