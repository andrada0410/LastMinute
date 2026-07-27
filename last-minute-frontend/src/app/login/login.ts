import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <section class="page page-centered">
      <form class="card form-card" #loginForm="ngForm" (ngSubmit)="onSubmit()">
        <h1>Conectare</h1>

        @if (errorMessage()) {
          <p class="message error">{{ errorMessage() }}</p>
        }

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

  email = '';
  password = '';

  errorMessage = signal('');

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage.set('Completează email și parolă.');
      return;
    }

    this.errorMessage.set('');

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.redirectByRole(response.userData.role);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error || 'Email sau parolă incorectă.');
      },
    });
  }

  private redirectByRole(role: string): void {
    switch (role.toLocaleLowerCase()) {
      case 'user':
        this.router.navigate(['/']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}