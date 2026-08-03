import { Component, input, output, signal, OnDestroy } from "@angular/core";
import { ShopInfo } from "../shop";
import { ShopItem } from "../admin-shop-list-item/admin-shop-list-item";
import { Subject } from 'rxjs';
import { debounceTime} from 'rxjs/operators';

@Component({
    selector: 'app-shop-list',
    standalone: true,
    template: `
        <div class="list-container">
            <h2>Conturi Magazin</h2>
                <div class="search-bar">
                    <input
                    type="email"
                    name="searchEmail"
                    placeholder="Caută magazin după email"
                    [value]="searchEmail()"
                    (input)="onSearchInputChange($event)"
                    />
                    @if(searchEmail()) {
                    <button type="button" class="clear-btn" (click)="onClear()">&times;</button>
                }
                </div>

            <ul class="shop-list">
                @for(shop of shops(); track shop.id) {
                    <li class="shop-item">
                        <app-admin-shop-list-item 
                        [shop]="shop"
                        (editShopEvent)="editShopEvent.emit($event)"
                        (deleteShopEvent)="deleteShopEvent.emit($event)"
                        />
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
export class AdminShopList implements OnDestroy {
    shops = input.required<ShopInfo[]>();
    totalItems = input.required<number>();
    currentPage = input.required<number>();

    changePageEvent = output<number>();
    editShopEvent = output<ShopInfo>();
    deleteShopEvent = output<ShopInfo>();
    searchEvent = output<string>();
    clearSearchEvent = output<void>();

    searchEmail = signal<string>("");

    private searchSubject = new Subject<string>();

    constructor() {
        this.searchSubject
        .pipe(debounceTime(300))
        .subscribe((value) => {
            const email = value.trim();
            if (!email) {
                this.clearSearchEvent.emit()
            }
            else {
                this.searchEvent.emit(email);
            }
        })
    }

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

    onSearchInputChange(event: Event) {
        const email = (event.target as HTMLInputElement).value
        this.searchEmail.set(email);
        this.searchSubject.next(email);
    }

    onClear() {
        this.searchEmail.set("");
        this.searchSubject.next("");
    }

    ngOnDestroy() {
        this.searchSubject.complete();
    }
}