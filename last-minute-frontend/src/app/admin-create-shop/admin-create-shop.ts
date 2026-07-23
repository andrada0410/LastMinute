import { Component, effect, input, output } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { CreateShopRequest } from "../shop";

@Component({
    selector: 'app-admin-create-shop',
    standalone: true,
    imports: [ReactiveFormsModule],
    template: `
        <form [formGroup]="shopForm" (submit)="submitShop()">
            <h2>Adaugă un magazin nou</h2>

            <label for="name">Nume: </label>
            <input id="name" type="text" formControlName="name"/>

            @if(shopForm.get('name')?.hasError('required') && shopForm.get('name')?.touched) {
                <p class="error-text">Numele este obligatoriu.</p>
            }

            <label for="email">Email: </label>
            <input id="email" type="text" formControlName="email"/>

            @if(shopForm.get('email')?.hasError('email') && shopForm.get('email')?.touched) {
                <p class="error-text">Adresa de email introdusă nu este validă.</p>
            }

            <label for="password">Parolă: </label>
            <input id="password" type="password" formControlName="password"/>

            @if(shopForm.get('password')?.hasError('minlength') && shopForm.get('password')?.touched) {
                <p class="error-text">Parola trebuie să conțină cel puțin 6 caractere.</p>
            }

            <label for="confirm-password">Confirmare parolă: </label>
            <input id="confirm-password" type="password" formControlName="confirmPassword"/>

            @if(shopForm.hasError('passwordsDontMatch') && shopForm.get('confirmPassword')?.touched) {
                <p class="error-text">Parolele sunt diferite!</p>
            }

            <label for="address">Adresă: </label>
            <textarea id="address" formControlName="address" rows="2" placeholder="Introduceți adresa completă a magazinului...">

            </textarea>
            
            @if(shopForm.get('address')?.hasError('required') && shopForm.get('address')?.touched) {
                <p class="error-text">Adresa este obligatorie.</p>
            }

            @if(backendError()) {
                <p class="error-message">{{ backendError() }}</p>
            }

            <button type="submit" class="primary" [disabled]="shopForm.invalid">Creare magazin</button>
        </form>
    `,

    styleUrls: ['./admin-create-shop.css']
})

export class AdminCreateShop {
    addShopEvent = output<CreateShopRequest>();
    backendError = input<string | null>(null);
    requestStatus = input<'loading' | 'success'>('loading');
    
    constructor() {
        effect(() => {
            if (this.requestStatus() === 'success') {
                this.shopForm.reset();
            }
        });
    }

    passwordValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            return { passwordsDontMatch: true };
        }
        return null;
    }

    shopForm = new FormGroup({
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', Validators.required),
        address: new FormControl('', Validators.required)
    }, {
        validators: this.passwordValidator
    });

    submitShop() {
        if (this.shopForm.invalid) return;

        this.addShopEvent.emit({
            email: this.shopForm.value.email!,
            password: this.shopForm.value.password!,
            name: this.shopForm.value.name!,
            address: this.shopForm.value.address!
        });
    };
}