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
                        <p class="message error">Numele este obligatoriu.</p>
                    }
                    @else if(editForm.get('name')?.hasError('maxlength') && editForm.get('name')?.touched) {
                        <p class="message error">Numele nu poate avea mai mult de 100 de caractere.</p>
                    }

                    <label for="edit-address">Adresă: </label>
                    <textarea id="edit-address" formControlName="address" rows="2"></textarea>

                    @if(editForm.get('address')?.hasError('required') && editForm.get('address')?.touched) {
                        <p class="message error">Adresa este obligatorie.</p>
                    }
                    @else if(editForm.get('address')?.hasError('maxlength') && editForm.get('address')?.touched) {
                        <p class="message error">Adresa nu poate avea mai mult de 255 de caractere.</p>
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

    @Output() save = new EventEmitter<{ id: number; name: string; address: string }>();
    @Output() cancel = new EventEmitter<void>();

    editForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        address: new FormControl('', [Validators.required, Validators.maxLength(255)])
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