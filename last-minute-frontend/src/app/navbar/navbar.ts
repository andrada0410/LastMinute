import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
       @if (authService.isLoggedIn()) {
          @switch (authService.currentUser()?.role) {
            @case ('SUPERUSER') {
              <a routerLink="/superadmin" routerLinkActive="active">Conturi magazine</a>
            }
            @case ('SHOPUSER') {
              <a routerLink="/shop-dashboard" routerLinkActive="active">Dashboard</a>
              <a routerLink="/shop-offer" routerLinkActive="active">Oferta Zilei</a>
            }
            @default {
              <a routerLink="/map" routerLinkActive="active">Hartă</a>
              <a routerLink="/user-reservations" routerLinkActive="active">Rezervări</a>
            }
          }
          <button class="navbar-logout" type="button" (click)="onLogout()">Deconectare</button>
        } @else {
          <a routerLink="/map" routerLinkActive="active">Hartă</a>
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