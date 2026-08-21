import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../toast';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  toasts = signal<Toast[]>([]);

  success(message: string, title: string = 'Succes'): void {
    this.show('success', message, title);
  }

  error(message: string, title: string = 'Eroare'): void {
    this.show('error', message, title);
  }

  info(message: string, title: string = 'Informație'): void {
    this.show('info', message, title);
  }

  remove(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  private show(type: ToastType, message: string, title: string): void {
    const toast: Toast = { 
        id: this.nextId++,
        type,
        message, 
        title 
    };

    this.toasts.update(list => [...list, toast]);

    setTimeout(() => this.remove(toast.id), 4000);
  }
}