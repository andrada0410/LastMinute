import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';


@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class.success]="toast.type === 'success'" [class.error]="toast.type === 'error'" [class.info]="toast.type === 'info'">
          <div class="toast-content">
            <strong>{{ toast.title }}</strong>
            <span>{{ toast.message }}</span>
          </div>
          <button class="close-btn" (click)="toastService.remove(toast.id)">&times;</button>
        </div>
      }
    </div>
  `,
  styleUrls: [`./toast.css`]
})
export class ToastComponent {
  toastService = inject(ToastService);
}