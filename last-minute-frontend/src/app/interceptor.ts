import { inject, Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from "./services/toast.service";

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
    private router = inject(Router);
    private toastService = inject(ToastService);
    private excludedRoutes = ['/login', '/register', '/map']

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let modifiedRequest = req;
        const isExcluded = this.excludedRoutes.some(url => req.url.endsWith(url));

        if (!isExcluded) {
            const token = localStorage.getItem("token");
            if (token) {
                modifiedRequest = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        }
        
        return next.handle(modifiedRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.toastService.error('Acces interzis! Te rugăm sa te loghezi din nou.', 'Sesiune expirată');
                    localStorage.removeItem('token');
                    this.router.navigate(['/login']);
                }
                else if (error.status === 400) {
                    console.error("Eroare de validare:", error.error.error);
                }
                else if (error.status === 403) {
                    this.toastService.error('Nu aveți permisiunea de a vizualiza conținutul acestei pagini.', 'Acces interzis');
                }
                else if (error.status === 500) {
                    console.error("problemă server", error.error.error);
                }

                return throwError(() => error);
            })
        )
    }
}