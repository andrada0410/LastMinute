import { Component, OnInit, OnDestroy, input, output, signal } from '@angular/core';
import { OfferInfo, OfferProduct } from '../offer';
import { ReservationModalComponent } from '../product-reservation/reservation-modal/reservation-modal.component';
import { CreateReservationRequest } from '../reservation';
import { environment } from '../environments/environment';
import { OfferProductItemComponent } from '../offer-product-item/offer-product-item';

@Component({
  selector: 'app-offer-ticket',
  standalone: true,
  imports: [ReservationModalComponent, OfferProductItemComponent],
  template: `
    <div class="promo-ticket"
      [class.is-expired]="getOfferState(offer().startDate, offer().endDate) === 'expired'"
      [class.is-upcoming]="getOfferState(offer().startDate, offer().endDate) === 'upcoming'">

      <div class="ticket-timer-header">
        <div class="header-text">
          @switch (getOfferState(offer().startDate, offer().endDate)) {
            @case ('expired') {
              <span class="valability">Ofertă </span>
              <strong class="date countdown-timer">EXPIRATĂ</strong>
            }
            @case ('upcoming') {
              <span class="valability">Începe în:</span>
              <strong class="date countdown-timer">
                {{ getCountdown(offer().startDate) }}
              </strong>
            }
            @case ('active') {
              <span class="valability">Expiră în:</span>
              <strong class="date countdown-timer">
                {{ getCountdown(offer().endDate) }}
              </strong>
            }
          }
        </div>

        <div class="interval-badge">
          {{ getFormattedTime(offer().startDate) }} - {{ getFormattedTime(offer().endDate) }}
        </div>
      </div>

      @if (getOfferState(offer().startDate, offer().endDate) === 'active') {
        <div class="progress-container-top">
          <div class="progress-bar" 
               [style.width.%]="getProgressPercentage(offer().startDate, offer().endDate)"
               [style.--progress-val]="getProgressPercentage(offer().startDate, offer().endDate)">
          </div>
        </div>
      }
      
      <div class="ticket-content">
        <ul class="bundle-items">
        @for (item of products(); track item.id) {
          <app-offer-product-item
            [item]="item"
            [isLoggedIn]="isLoggedIn()"
            [isOfferActive]="getOfferState(offer().startDate, offer().endDate) === 'active'"
            (reserveProduct)="openModal($event)"
            (productClick)="onProductClick()">
          </app-offer-product-item>
        }
        </ul>
      </div>
    </div>

    @if (selectedProductForReservation()) {
      <app-reservation-modal
        [product]="selectedProductForReservation()!"
        (close)="closeModal()"
        (reserve)="handleReservation($event)">
      </app-reservation-modal>
    }
  `,
  styleUrls: ['./offer-ticket.component.css']
})
export class OfferTicketComponent implements OnInit, OnDestroy {
  offer = input.required<OfferInfo>();
  products = input.required<OfferProduct[]>();
  isLoggedIn = input<boolean>(false);

  reserve = output<CreateReservationRequest>();
  productClick = output<void>();

  public currentTime = signal<Date>(new Date());
  public selectedProductForReservation = signal<OfferProduct | null>(null);

  private timerInterval: any;
  private url = environment.apiUrl;

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  public getProgressPercentage(startDate: string | Date, endDate: string | Date): number {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = this.currentTime().getTime();

    if (now >= end) {
      return 100;
    }
    
    if (now <= start) {
      return 0;
    }

    const totalDuration = end - start;
    const elapsedDuration = now - start;
    
    return (elapsedDuration / totalDuration) * 100;
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.currentTime.set(new Date());
    }, 250);
  }

  public getOfferState(startDate: string | Date, endDate: string | Date): 'upcoming' | 'active' | 'expired' {
    const now = this.currentTime().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (now < start) return 'upcoming'; 
    if (now > end) return 'expired';    
    return 'active';                    
  }

  public getFormattedTime(date: string | Date): string {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  public getCountdown(endDate: string | Date): string {
    const end = new Date(endDate).getTime();
    const now = this.currentTime().getTime();
    const diffInSeconds = Math.floor((end - now) / 1000);

    if (diffInSeconds <= 0) {
      return '0h 0m 0s';
    }

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  public getDiscountPercent(originalPrice: number, offerPrice: number): number {
    if (!originalPrice) return 0;
    return Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
  }

  public openModal(product: OfferProduct): void {
    this.selectedProductForReservation.set(product);
  }

  public closeModal(): void {
    this.selectedProductForReservation.set(null);
  }

  public handleReservation(event: { productId: number, quantity: number }): void {
    this.closeModal();
    this.reserve.emit({
      offerId: this.offer().id,
      productId: event.productId,
      quantity: event.quantity
    });
  }

  public resolveImagePath(path?: string, fallback?: string): string {
    if (!path) {
      return fallback ?? '';
    }
    
    const isExternalLink = /^https?:\/\//i.test(path);
    
    return isExternalLink
      ? path
      : `${this.url}/uploads/${path}`;
  }

  public onProductClick(): void {
    this.productClick.emit();
  }
}