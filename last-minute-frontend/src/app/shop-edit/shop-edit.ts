import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ShopInfo } from "../shop";

@Component({
    selector: 'app-shop-edit',
    standalone: true,
    imports: [ReactiveFormsModule],
    template: `
        <div class="form">
            <div class="form-content">
                <h2>Editează magazin</h2>

                <form class="form-card" [formGroup]="editForm" (submit)="submitEdit()">
                    <label for="edit-name">Nume: </label>
                    <input id="edit-name" type="text" formControlName="name"/>

                    @if(editForm.get('name')?.hasError('required') && editForm.get('name')?.touched) {
                        <p class="error-text">Numele este obligatoriu.</p>
                    }

                    <label for="edit-address">Adresă: </label>
                    <textarea id="edit-address" formControlName="address" rows="2"></textarea>

                    @if(editForm.get('address')?.hasError('required') && editForm.get('address')?.touched) {
                        <p class="error-text">Adresa este obligatorie.</p>
                    }

                    @if(backendError) {
                        <p class="error-message">{{ backendError }}</p>
                    }

                    <div class="form-actions">
                        <button type="button" class="button canceled" (click)="cancel.emit()">Anulează</button>
                        <button type="submit" class="button primary" [disabled]="editForm.invalid || !hasChanges">Salvează modificări</button>
                    </div>
                </form>
            </div>
        </div>
    `,
    styleUrls: ['./shop-edit.css']
})
export class ShopEdit implements OnChanges {
    @Input({ required: true }) shop!: ShopInfo;
    @Input() backendError: string | null = null;

    @Output() save = new EventEmitter<{ id: number; name: string; address: string }>();
    @Output() cancel = new EventEmitter<void>();

    editForm = new FormGroup({
        name: new FormControl('', Validators.required),
        address: new FormControl('', Validators.required)
    });

    ngOnChanges(changes: SimpleChanges) {
        if (changes['shop'] && this.shop) {
            this.editForm.patchValue({
                name: this.shop.name,
                address: this.shop.address
            });
        }
    }

    get hasChanges(): boolean {
        if (!this.shop) return false;
        const { name, address } = this.editForm.value;
        return name !== this.shop.name || address !== this.shop.address;
    }

    submitEdit() {
        if (this.editForm.invalid || !this.hasChanges) return;

        const { name, address } = this.editForm.value;
        this.save.emit({ 
            id: this.shop.id,
            name: name!, 
            address: address! 
        });
    }
}