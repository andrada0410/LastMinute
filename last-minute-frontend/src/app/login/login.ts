import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <section class="page page-centered">
      <form class="card form-card" #loginForm="ngForm" (ngSubmit)="onSubmit()">
        <h1>Conectare</h1>

        <label for="email">Email</label>
        <input id="email" type="email" name="email" [(ngModel)]="email" #emailModel="ngModel" required email/>

        @if (emailModel.invalid && emailModel.touched) {
        <p class="message error">Adresa de email introdusă nu este validă.</p>
        }

        <label for="password">Parolă</label>
        <input id="password" type="password" name="password" [(ngModel)]="password" required password/>

        <button class="button primary" type="submit" [disabled]="loginForm.invalid">Conectare</button>

      </form>
    </section>
  `,
  styleUrls: ['./login.css'],
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  email = '';
  password = '';

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.toastService.error('Completează email și parolă.', 'Eroare');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.redirectByRole(response.userData.role);
      },
      error: (err) => {
        const errorMessage = typeof err.error === 'string' ? err.error : (err.error?.error || 'Email sau parolă incorectă.');
        this.toastService.error(errorMessage, 'Eroare');
      },
    });
  }

  private redirectByRole(role: string): void {
    switch (role.toLocaleLowerCase()) {
      case 'user':
        this.router.navigate(['/']);
        break;
      case 'shopuser':
        this.router.navigate(['/shop-dashboard'])
        break
      default:
        this.router.navigate(['/']);
    }
  }
}