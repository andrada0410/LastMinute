import { Component, input, output } from "@angular/core";
import { ShopInfo } from "../shop";
import { ShopItem } from "../admin-shop-list-item/admin-shop-list-item";

@Component({
    selector: 'app-shop-list',
    standalone: true,
    template: `
        <div class="list-container">
            <h2>Conturi Magazin</h2>
            <ul class="shop-list">
                @for(shop of shops(); track shop.id) {
                    <li class="shop-item">
                        <app-admin-shop-list-item [shop]="shop"/>
                    </li>
                } @empty {
                    <li class="empty-state">Nu există magazine adăugate încă.</li>
                }
            </ul>

            <div class="pagination-footer">
                <div class="pagination-controls">
                    <button 
                        (click)="prevPage()" 
                        [disabled]="currentPage() === 1"
                        class="primary">
                        Înapoi
                    </button>
                    
                    <button 
                        (click)="nextPage()" 
                        [disabled]="currentPage() === totalPages"
                        class="primary">
                        Înainte
                    </button>
                </div>

                <span class="page-info">
                    Pagina {{ currentPage() }} din {{ totalPages }} 
                    (Total: {{ totalItems() }})
                </span>
            </div>
        </div>
    `,
    styleUrls: ['./admin-shop-list.css'],
    imports: [ShopItem]
})
export class AdminShopList {
    shops = input.required<ShopInfo[]>();
    totalItems = input.required<number>();
    currentPage = input.required<number>();

    changePageEvent = output<number>();

    get totalPages(): number {
        return Math.ceil(this.totalItems() / 5) || 1;
    }

    nextPage() {
        if (this.currentPage() < this.totalPages) {
            this.changePageEvent.emit(this.currentPage() + 1);
        }
    }

    prevPage() {
        if (this.currentPage() > 1) {
            this.changePageEvent.emit(this.currentPage() - 1)
        }
    }
}