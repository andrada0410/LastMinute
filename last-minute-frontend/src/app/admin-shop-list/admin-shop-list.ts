import { Component, inject, OnInit } from "@angular/core";
import { ShopInfo } from "../shop";
import { ShopService } from "../shop.service";

@Component({
    selector: 'app-shop-list',
    standalone: true,
    template: `
        <div class="list-container">
            <ul class="shop-list">
                @for(shop of shops; track shop.id) {
                    <li class="shop-item">
                        <span class="shop-name">{{ shop.name }}</span>
                        <span class="shop-email">{{ shop.email }}</span>
                    </li>
                } @empty {
                    <li class="empty-state">Nu există magazine adăugate încă.</li>
                }
            </ul>

            <div class="pagination-footer">
                <div class="pagination-controls">
                    <button 
                        (click)="prevPage()" 
                        [disabled]="currentPage === 1"
                        class="primary">
                        Înapoi
                    </button>
                    
                    <button 
                        (click)="nextPage()" 
                        [disabled]="currentPage === totalPages"
                        class="primary">
                        Înainte
                    </button>
                </div>

                <span class="page-info">
                    Pagina {{ currentPage }} din {{ totalPages }} 
                    (Total: {{ totalItems }})
                </span>
            </div>
        </div>
    `,
    styleUrls: ['./admin-shop-list.css']
})
export class AdminShopList implements OnInit {
    ngOnInit() {
        this.loadShops();
    }

    private shopService = inject(ShopService);
    shops: ShopInfo[] = []; 

    currentPage = 1;
    itemsPerPage = 5;
    totalItems = 0;

    get totalPages(): number {
        return Math.ceil(this.totalItems / this.itemsPerPage) || 1;
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.loadShops();
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadShops();
        }
    }
    
    loadShops() {
        this.shopService.getShopsInfo(this.currentPage, this.itemsPerPage).subscribe({
            next: (response) => {
                this.shops = response.entry;
                this.totalItems = response.total;
                console.log(response);
            },
            error: (err) => {
                console.error("Eroare la preluarea magazinelor:", err);
            }
        });
    }

    
}