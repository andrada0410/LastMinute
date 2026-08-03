import { Component, input, output } from "@angular/core";

@Component({
    selector: 'app-confirm-delete',
    standalone: true,
    template: `
        <div class="form">
            <div class="form-content">
                <p>{{ message() }}</p>
                <div class="form-actions">
                    <button type="button" class="button canceled" (click)="cancel.emit()">Anulează</button>
                    <button type="button" class="button primary" (click)="confirm.emit()">Confirm</button>
                </div>
            </div>
        </div>
    `,
    
    styleUrls: ['./confirm-delete.css']
})
export class ConfirmDelete {
    message = input('Sigur dorești să ștergi acest element?');
    confirm = output<void>();
    cancel = output<void>();
}