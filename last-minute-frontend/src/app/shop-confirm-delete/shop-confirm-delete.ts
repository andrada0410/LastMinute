import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'app-shop-confirm-delete',
    standalone: true,
    template: `
        <div class="form">
            <div class="form-content">
                <p>Sigur dorești să ștergi acest magazin?</p>
                <div class="form-actions">
                    <button type="button" class="button canceled" (click)="cancel.emit()">Anulează</button>
                    <button type="button" class="button primary" (click)="confirm.emit()">Confirm</button>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./shop-confirm-delete.css']
})
export class ShopConfirmDelete {
    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();
}