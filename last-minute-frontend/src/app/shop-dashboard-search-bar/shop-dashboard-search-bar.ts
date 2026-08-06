import { Component, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-shop-dashboard-search-bar',
  standalone: true,
  imports: [],
  template: `
    <div class="search-bar">
      <input
        type="text"
        placeholder="Caută după nume"
        [value]="name()"
        (input)="onInputChange($event)"
        (keydown.enter)="$event.preventDefault()"
        name="search"
        class="search-input"
      />
      @if (name()) {
        <button type="button" class="clear-btn" (click)="onClear()">&times;</button>
      }
    </div>
  `,
  styleUrls: ['./shop-dashboard-search-bar.css']
})
export class SearchBar {
  name = input<string>('');
  nameChange = output<string>();

  onInputChange(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    this.nameChange.emit(newValue);
  }

  onClear(): void {
    this.nameChange.emit('');
  }
}