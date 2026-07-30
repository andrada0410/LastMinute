import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { ToastComponent } from "./toast/toast";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ToastComponent],
  template: `
    <main>
      <header>
      <app-navbar></app-navbar>
      </header>
      <section class="content">
        <app-toast></app-toast>
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrls: ['./app.css'],
})
export class App {
  title = 'homes';
}