import { Component, input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop-offer-form-time',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="interval-fields" [formGroup]="form()">
      <div class="field-group">
        <label>Data de început:</label>
        <p class="field-value muted">{{ todayLabel }}</p>
      </div>

      <div class="field-group">
        <label>Ora de început:</label>
        <div class="time-select">
          <input type="number" min="0" max="23" formControlName="startHour">
          <span>:</span>
          <input type="number" min="0" max="59" formControlName="startMinute">
        </div>

        @if (form().get('startHour')?.invalid && form().get('startHour')?.touched) {
          <p class="error message">Ora trebuie să fie între 0 și 23.</p>
        }
        @if (form().get('startMinute')?.invalid && form().get('startMinute')?.touched) {
          <p class="error message">Minutul trebuie să fie între 0 și 59.</p>
        }
      </div>

      <div class="field-group">
        <label>Număr de ore active:</label>
        <input type="number" min="1" max="23" formControlName="hoursAvailable">

        @if (form().get('hoursAvailable')?.invalid && form().get('hoursAvailable')?.touched) {
          <p class="error message">Introdu un număr de ore valid (1-23).</p>
        }
      </div>

      <div class="field-group">
        <label>Data de sfârșit (calculată):</label>
        <p class="field-value muted">{{ endDateLabel() }}</p>
      </div>
    </div>

    @if (form().hasError('endsNextDay')) {
      <p class="error message">Oferta trebuie să se încheie tot în ziua curentă. Redu ora start sau numărul de ore active.</p>
    }
  `,
   styleUrls: ["./shop-offer-form-time.css"]
})
export class ShopOfferFormTime implements OnInit {
  form = input.required<FormGroup>();
  todayLabel = '';

  ngOnInit(): void {
    this.todayLabel = new Date().toLocaleDateString('ro-RO', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }

  endDateLabel(): string {
    const hour = this.form().get('startHour')?.value;
    const minute = this.form().get('startMinute')?.value;
    const hours = this.form().get('hoursAvailable')?.value;

    if (hour === null || hour === undefined || minute === null || minute === undefined || !hours) {
      return '-';
    }

    const start = new Date();
    start.setHours(hour, minute, 0, 0);
    const end = new Date(start.getTime() + hours * 60 * 60 * 1000);

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(end.getDate())}.${pad(end.getMonth() + 1)}.${end.getFullYear()}, ${pad(end.getHours())}:${pad(end.getMinutes())}`;
  }
}