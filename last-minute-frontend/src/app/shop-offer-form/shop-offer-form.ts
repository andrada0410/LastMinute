import { Component, input, output, signal, computed, OnChanges, SimpleChanges } from "@angular/core";
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Product } from "../product";
import { CreateOfferProduct, CreateOfferRequest } from "../offer";
import { ShopOfferFormProduct } from "../shop-offer-form-product/shop-offer-form-product";
import { ShopOfferFormTime } from "../shop-offer-form-time/shop-offer-form-time";
import { ShopOfferFormBulk } from "../shop-offer-form-bulk/shop-offer-form-bulk";
import { SearchBar } from "../shop-dashboard-search-bar/shop-dashboard-search-bar";

@Component({
    selector: "app-shop-offer-form",
    standalone: true,
    imports: [ReactiveFormsModule, ShopOfferFormProduct, ShopOfferFormTime, ShopOfferFormBulk, SearchBar],
    template: `
    <div class="form">
        <div class="form-content">
            <h2>Creează ofertă</h2>

            <form class="form-card" [formGroup]="offerForm" (ngSubmit)="submit()">

                <app-shop-offer-form-time [form]="offerForm" />

                <hr class="section-divider" />

                <app-shop-offer-form-bulk (applyBulk)="onApplyBulk($event)" />

                <hr class="section-divider" />

                <app-shop-dashboard-search-bar [(name)]="searchTerm" placeholder="Caută produse după nume..." />

                <div class="products-list" formArrayName="products">
                    @for (group of visibleProductGroups(); track group) {
                        <app-shop-offer-form-product [group]="group" />
                    } @empty {
                        <p class="text-muted">Niciun produs găsit.</p>
                    }
                </div>

                @if (!hasSelectedProducts) {
                    <p class="error message">Selectează cel puțin un produs pentru ofertă.</p>
                }

                @if (backendError()) {
                    <p class="error message">{{ backendError() }}</p>
                }

                <div class="form-actions">
                    <button type="button" class="button cancel" (click)="cancel.emit()">Anulează</button>
                    <button type="submit" class="button primary" [disabled]="offerForm.invalid || !hasSelectedProducts">
                        Creează oferta
                    </button>
                </div>

            </form>
        </div>
    </div>
    `,
    styleUrls: ["./shop-offer-form.css"]
})
export class ShopOfferForm implements OnChanges {
    products = input.required<Product[]>();
    backendError = input("");

    save = output<CreateOfferRequest>();
    cancel = output<void>();

    private today = new Date();
    searchTerm = signal("");

    offerForm = new FormGroup({
        startHour: new FormControl(this.today.getHours(), { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(23)] }),
        startMinute: new FormControl(this.today.getMinutes(), { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(59)] }),
        hoursAvailable: new FormControl(1, { nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(23)] }),
        products: new FormArray<FormGroup>([])
    }, { validators: this.sameDayEndValidator() });

    get productsArray(): FormArray<FormGroup> {
        return this.offerForm.get("products") as FormArray<FormGroup>;
    }

    visibleProductGroups = computed(() => {
        const term = this.searchTerm().trim().toLowerCase();
        if (!term) return this.productsArray.controls;
        return this.productsArray.controls.filter(group =>
            (group.get("name")?.value as string).toLowerCase().includes(term)
        );
    });

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["products"]) {
            this.buildProductRows();
        }
    }

    onSearchChange(event: Event): void {
        this.searchTerm.set((event.target as HTMLInputElement).value);
    }

    onClearSearch(): void {
        this.searchTerm.set("");
    }

    onApplyBulk(data: { quantity: number | null; discount: number | null }): void {
        for (const group of this.productsArray.controls) {
            if (data.quantity !== null) group.get("quantity")?.setValue(data.quantity);
            if (data.discount !== null) group.get("discountPercent")?.setValue(data.discount);
            group.get("quantity")?.markAsTouched();
            group.get("discountPercent")?.markAsTouched();
        }
    }

    private sameDayEndValidator(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const hour = group.get("startHour")?.value;
            const minute = group.get("startMinute")?.value;
            const hoursAvailable = group.get("hoursAvailable")?.value;

            if (hour === null || hour === undefined || minute === null || minute === undefined || !hoursAvailable) {
                return null;
            }

            const start = new Date(this.today);
            start.setHours(hour, minute, 0, 0);
            const end = new Date(start.getTime() + hoursAvailable * 60 * 60 * 1000);

            const isSameDay = end.getFullYear() === start.getFullYear() &&
                end.getMonth() === start.getMonth() &&
                end.getDate() === start.getDate();

            const isMidnightBoundary = end.getHours() === 0 && end.getMinutes() === 0 &&
                end.getSeconds() === 0 && end.getDate() !== start.getDate();

            return (isSameDay || isMidnightBoundary) ? null : { endsNextDay: true };
        };
    }

    private buildProductRows(): void {
        this.productsArray.clear();
        for (const product of this.products()) {
            const includedControl = new FormControl(false, { nonNullable: true });
            const quantityControl = new FormControl<number | null>(null);
            const discountControl = new FormControl<number | null>(null);

            includedControl.valueChanges.subscribe((included) => {
                if (included) {
                    quantityControl.setValidators([Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]);
                    discountControl.setValidators([Validators.required, Validators.min(5), Validators.max(100), Validators.pattern('^[0-9]+$')]);
                } else {
                    quantityControl.clearValidators();
                    discountControl.clearValidators();
                }
                quantityControl.updateValueAndValidity();
                discountControl.updateValueAndValidity();
            });

            this.productsArray.push(new FormGroup({
                productId: new FormControl(product.id, { nonNullable: true }),
                name: new FormControl(product.name, { nonNullable: true }),
                included: includedControl,
                quantity: quantityControl,
                discountPercent: discountControl
            }));
        }
    }

    get hasSelectedProducts(): boolean {
        return this.productsArray.controls.some(group => group.get("included")?.value === true);
    }

    submit(): void {
        if (this.offerForm.invalid || !this.hasSelectedProducts) return;

        const selectedProducts: CreateOfferProduct[] = this.productsArray.controls
            .filter(group => group.get("included")?.value === true)
            .map(group => ({
                productId: group.get("productId")!.value,
                quantity: group.get("quantity")!.value!,
                discountPercent: group.get("discountPercent")!.value!
            }));

        const hour = this.offerForm.get("startHour")!.value;
        const minute = this.offerForm.get("startMinute")!.value;
        const startDate = new Date(this.today);
        startDate.setHours(hour, minute, 0, 0);

        this.save.emit({
            startDate: startDate.toISOString(),
            hoursAvailable: this.offerForm.get("hoursAvailable")!.value,
            products: selectedProducts
        });
    }
}