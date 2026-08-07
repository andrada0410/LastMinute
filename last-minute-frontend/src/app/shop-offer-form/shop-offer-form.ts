import { Component, input, output, signal, computed, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Product } from "../product";
import { CreateOfferProduct, CreateOfferRequest } from "../offer";
import { CapitalisePipe } from "../pipes/capitalise";

@Component({
    selector: "app-shop-offer-form",
    standalone: true,
    imports: [ReactiveFormsModule, CapitalisePipe],
    template: `
    <div class="form">
        <div class="form-content">

            <h2>Creează ofertă</h2>

            <form class="form-card" [formGroup]="offerForm" (ngSubmit)="submit()">

                <div class="interval-fields">
                    <div class="field-group">
                        <label>Data de început:</label>
                        <p class="field-value muted">{{ todayLabel }}</p>
                    </div>

                    <div class="field-group">
                        <label>Ora de început:</label>
                        <div class="time-select">
                            <input
                                type="number"
                                min="0"
                                max="23"
                                formControlName="startHour">
                            <span>:</span>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                formControlName="startMinute">
                        </div>

                        @if (offerForm.get('startHour')?.invalid && offerForm.get('startHour')?.touched) {
                            <p class="error message">Ora trebuie să fie între 0 și 23.</p>
                        }
                        @if (offerForm.get('startMinute')?.invalid && offerForm.get('startMinute')?.touched) {
                            <p class="error message">Minutul trebuie să fie între 0 și 59.</p>
                        }
                    </div>

                    <div class="field-group">
                        <label>Număr de ore active:</label>
                        <input type="number" min="1" max="23" formControlName="hoursAvailable">

                        @if (offerForm.get('hoursAvailable')?.invalid && offerForm.get('hoursAvailable')?.touched) {
                            <p class="error message">Introdu un numar de ore valid (1-23).</p>
                        }
                    </div>

                    <div class="field-group">
                        <label>Data de sfârșit (calculată):</label>
                        <p class="field-value muted">{{ endDateLabel }}</p>
                    </div>
                </div>

                @if (offerForm.hasError('endsNextDay')) {
                    <p class="error message">Oferta trebuie să se încheie tot în ziua curentă. Redu ora start sau numărul de ore active.</p>
                }

                <hr class="section-divider" />

                <div class="bulk-container">
                    <div class="bulk-fields">
                        <div class="field-group">
                            <label>Cantitate (toate produsele selectate):</label>
                            <input type="number" min="1" [formControl]="bulkQuantity">
                        </div>

                        <div class="field-group">
                            <label>Procent reducere (toate produsele selectate):</label>
                            <input type="number" min="0" max="100" [formControl]="bulkDiscount">
                        </div>
                    </div>

                    @if ((bulkQuantity.invalid && bulkQuantity.touched) || (bulkDiscount.invalid && bulkDiscount.touched)) {
                        <div class="bulk-errors">
                            @if (bulkQuantity.invalid && bulkQuantity.touched) {
                                <p class="error message">Cantitatea trebuie să fie cel puțin 1.</p>
                            }

                            @if (bulkDiscount.invalid && bulkDiscount.touched) {
                                <p class="error message">Procentul trebuie să fie între 0 și 100.</p>
                            }
                        </div>
                    }

                    <div class="bulk-actions">
                        <button
                            type="button"
                            class="button secondary"
                            [disabled]="bulkQuantity.invalid || bulkDiscount.invalid"
                            (click)="applyBulkToAll()">
                            Aplică la toate produsele
                        </button>
                    </div>
                </div>

                <hr class="section-divider" />

                <div class="search-bar">
                    <input
                        type="text"
                        placeholder="Caută produse după nume..."
                        [value]="searchTerm()"
                        (input)="onSearchChange($event)">

                    @if (searchTerm()) {
                        <button type="button" class="clear-btn" (click)="onClearSearch()">&times;</button>
                    }
                </div>

                <div class="products-list" formArrayName="products">
                    @for (group of visibleProductGroups(); track group) {
                        <div class="product-row" [formGroupName]="getIndex(group)">

                            <label class="product-checkbox">
                                <input type="checkbox" formControlName="included">
                                {{ group.get('name')?.value | capitalise }}
                            </label>

                            <div class="product-row-fields">
                                <div class="field-inline">
                                    <label>Cantitate:</label>
                                    <input type="number" min="1" formControlName="quantity">
                                </div>

                                <div class="field-inline">
                                    <label>Procent reducere:</label>
                                    <input type="number" min="0" max="100" formControlName="discountPercent">
                                </div>
                            </div>

                            @if (group.get('quantity')?.invalid && group.get('quantity')?.touched) {
                                <p class="error message">Cantitate invalidă.</p>
                            }
                            @if (group.get('discountPercent')?.invalid && group.get('discountPercent')?.touched) {
                                <p class="error message">Procent invalid (0-100).</p>
                            }

                        </div>
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
export class ShopOfferForm implements OnInit, OnChanges {

    products = input.required<Product[]>();
    backendError = input("");

    save = output<CreateOfferRequest>();
    cancel = output<void>();

    todayLabel = "";
    private today = new Date();

    hours = Array.from({ length: 24 }, (_, i) => i);
    minutes = Array.from({ length: 60 }, (_, i) => i);

    searchTerm = signal("");

    offerForm = new FormGroup({
        startHour: new FormControl(this.today.getHours(), { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(23)] }),
        startMinute: new FormControl(this.today.getMinutes(), { nonNullable: true, validators: [Validators.required, Validators.min(0), Validators.max(59)] }),
        hoursAvailable: new FormControl(1, { nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(23)] }),
        products: new FormArray<FormGroup>([])
    }, { validators: this.sameDayEndValidator() });

    bulkQuantity = new FormControl<number | null>(null, [Validators.min(1)]);
    bulkDiscount = new FormControl<number | null>(null, [Validators.min(0), Validators.max(100)]);

    get productsArray(): FormArray<FormGroup> {
        return this.offerForm.get("products") as FormArray<FormGroup>;
    }

    visibleProductGroups = computed(() => {
        const term = this.searchTerm().trim().toLowerCase();
        if (!term) {
            return this.productsArray.controls;
        }
        return this.productsArray.controls.filter(group =>
            (group.get("name")?.value as string).toLowerCase().includes(term)
        );
    });

    ngOnInit(): void {
        this.todayLabel = this.today.toLocaleDateString("ro-RO", {
            day: "2-digit", month: "2-digit", year: "numeric"
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["products"]) {
            this.buildProductRows();
        }
    }

    pad(n: number): string {
        return n.toString().padStart(2, "0");
    }

    getIndex(group: FormGroup): number {
        return this.productsArray.controls.indexOf(group);
    }

    onSearchChange(event: Event): void {
        this.searchTerm.set((event.target as HTMLInputElement).value);
    }

    onClearSearch(): void {
        this.searchTerm.set("");
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

            const isSameDay =
                end.getFullYear() === start.getFullYear() &&
                end.getMonth() === start.getMonth() &&
                end.getDate() === start.getDate();

            const isMidnightBoundary =
                end.getHours() === 0 && end.getMinutes() === 0 && end.getSeconds() === 0 &&
                end.getDate() !== start.getDate();

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
                    quantityControl.setValidators([Validators.required, Validators.min(1)]);
                    discountControl.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
                } else {
                    quantityControl.clearValidators();
                    discountControl.clearValidators();
                }
                quantityControl.updateValueAndValidity();
                discountControl.updateValueAndValidity();
            });

            const group = new FormGroup({
                productId: new FormControl(product.id, { nonNullable: true }),
                name: new FormControl(product.name, { nonNullable: true }),
                included: includedControl,
                quantity: quantityControl,
                discountPercent: discountControl
            });

            this.productsArray.push(group);
        }
    }

    get hasSelectedProducts(): boolean {
        return this.productsArray.controls.some(group => group.get("included")?.value === true);
    }

    get endDateLabel(): string {
        const startDate = this.buildStartDate();
        const hours = this.offerForm.get("hoursAvailable")?.value;

        if (!startDate || !hours) {
            return "-";
        }

        const end = new Date(startDate.getTime() + hours * 60 * 60 * 1000);
        return this.formatDateTime(end);
    }

    private formatDateTime(date: Date): string {
        const day = this.pad(date.getDate());
        const month = this.pad(date.getMonth() + 1);
        const year = date.getFullYear();
        const hours = this.pad(date.getHours());
        const minutes = this.pad(date.getMinutes());

        return `${day}.${month}.${year}, ${hours}:${minutes}`;
    }

    applyBulkToAll(): void {
        this.bulkQuantity.markAsTouched();
        this.bulkDiscount.markAsTouched();

        if (this.bulkQuantity.invalid || this.bulkDiscount.invalid) {
            return;
        }

        const quantity = this.bulkQuantity.value;
        const discount = this.bulkDiscount.value;

        for (const group of this.productsArray.controls) {
            if (quantity !== null) {
                group.get("quantity")?.setValue(quantity);
            }
            if (discount !== null) {
                group.get("discountPercent")?.setValue(discount);
            }
            group.get("quantity")?.markAsTouched();
            group.get("discountPercent")?.markAsTouched();
        }
    }

    private buildStartDate(): Date | null {
        const hour = this.offerForm.get("startHour")?.value;
        const minute = this.offerForm.get("startMinute")?.value;

        if (hour === null || hour === undefined || minute === null || minute === undefined) {
            return null;
        }

        const startDate = new Date(this.today);
        startDate.setHours(hour, minute, 0, 0);

        return startDate;
    }

    submit(): void {
        if (this.offerForm.invalid || !this.hasSelectedProducts) {
            return;
        }

        const selectedProducts: CreateOfferProduct[] = this.productsArray.controls
            .filter(group => group.get("included")?.value === true)
            .map(group => ({
                productId: group.get("productId")!.value,
                quantity: group.get("quantity")!.value!,
                discountPercent: group.get("discountPercent")!.value!
            }));

        const startDate = this.buildStartDate()!;

        this.save.emit({
            startDate: startDate.toISOString(),
            hoursAvailable: this.offerForm.get("hoursAvailable")!.value,
            products: selectedProducts
        });
    }
}