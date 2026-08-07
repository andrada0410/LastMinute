import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { OfferInfo, OfferProduct } from '../offer';
import { PricePipe } from '../pipes/price';

@Component({
    selector: 'app-offer-ticket',
    standalone: true,
    imports: [PricePipe],
    template: `
    <div class="promo-ticket"
        [class.is-expired]="getOfferState(offer.startDate, offer.endDate) === 'expired'"
         [class.is-upcoming]="getOfferState(offer.startDate, offer.endDate) === 'upcoming'">

        <div class="ticket-timer-header">
            <div class="header-text">
                @switch (getOfferState(offer.startDate, offer.endDate)) {
                    @case ('expired') {
                        <span class="valability">Ofertă </span>
                        <strong class="date countdown-timer">EXPIRATĂ</strong>
                    }
                    @case ('upcoming') {
                        <span class="valability">Începe în:</span>
                        <strong class="date countdown-timer">
                            {{ getCountdown(offer.startDate) }}
                        </strong>
                    }
                    @case ('active') {
                        <span class="valability">Expiră în:</span>
                        <strong class="date countdown-timer">
                            {{ getCountdown(offer.endDate) }}
                        </strong>
                    }
                }
            </div>

            <div class="interval-badge">
                {{ getFormattedTime(offer.startDate) }} - {{ getFormattedTime(offer.endDate) }}
            </div>
        </div>

        @if (getOfferState(offer.startDate, offer.endDate) === 'active') {
            <div class="progress-container-top">
                <div class="progress-bar" 
                        [style.width.%]="getProgressPercentage(offer.startDate, offer.endDate)"
                        [style.--progress-val]="getProgressPercentage(offer.startDate, offer.endDate)">
                </div>
            </div>
        }
        
        <div class="ticket-content">
            <ul class="bundle-items">
            @for (item of products; track item.id) {
                <li>
                <div class="item-main">
                    <img [src]="item.photoPath || 'assets/shop-dashboard/default-logo.png'" 
                        alt="Produs" 
                        class="item-thumb">
                    <div class="item-info">
                    <span class="item-name">
                        <span class="qty">{{ item.quantity }}x</span> {{ item.name }}
                    </span>
                    <div class="item-prices">
                        <span class="old-price">{{ item.price | price }}</span>
                        <span class="new-price">{{ item.offerPrice | price }}</span>
                        @if (getDiscountPercent(item.price, item.offerPrice) > 0) {
                            <span class="badge-discount">-{{ getDiscountPercent(item.price, item.offerPrice) }}%</span>
                        }
                    </div>
                    </div>
                </div>
                
                </li>
            }
            </ul>
        </div>

    </div>
    `,
    styleUrls: ['./offer-ticket.component.css']
})
export class OfferTicketComponent implements OnInit, OnDestroy {
    @Input({ required: true }) offer!: OfferInfo;
    @Input({ required: true }) products!: OfferProduct[];

    public currentTime: Date = new Date();
    private timerInterval: any;

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
    const now = this.currentTime.getTime();

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
      this.currentTime = new Date();
    }, 250);
  }

  public getOfferState(startDate: string | Date, endDate: string | Date): 'upcoming' | 'active' | 'expired' {
    const now = this.currentTime.getTime();
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
    const now = this.currentTime.getTime();
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
}