import { Component, signal } from "@angular/core";

@Component({
  selector: "app-dropdown-menu",
  standalone: true,
  template: `
    <div class="dropdown-wrapper">
      <button
        type="button"
        class="dropdown-trigger button primary"
        (click)="toggleMenu()"
      >
        <img src="assets/burger-icon.png" alt="Meniu" class="menu-icon" />
      </button>

      @if (isOpen()) {
        <div class="dropdown-backdrop" (click)="isOpen.set(false)"></div>

        <div class="dropdown-content" (click)="isOpen.set(false)">
          <ng-content></ng-content>
        </div>
      }
    </div>
  `,
  styleUrls: ["./dropdown-menu.css"],
})
export class DropdownMenu {
  isOpen = signal(false);

  toggleMenu(): void {
    this.isOpen.update((val) => !val);
  }
}