import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <a routerLink="/" class="navbar-logo">
        <img src="assets/logo.png" alt="Logo" />
        <span>Last Minute</span>
      </a>

      <div class="navbar-links">
        <a routerLink="/map" routerLinkActive="active">Hartă</a>

        @if (authService.isLoggedIn()) {
          <a routerLink="/active-orders" routerLinkActive="active">Comenzi active</a>
          <a routerLink="/order-history" routerLinkActive="active">Istoric comenzi</a>
          <button class="navbar-logout" type="button" (click)="onLogout()">Deconectare</button>
        } @else {
          <a routerLink="/login" routerLinkActive="active">Conectare</a>
          <a routerLink="/register" routerLinkActive="active">Înregistrare</a>
        }
      </div>
    </nav>
  `,
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  authService = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}