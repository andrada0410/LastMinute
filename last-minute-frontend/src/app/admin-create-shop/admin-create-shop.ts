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
                <p class="message error">Numele este obligatoriu.</p>
            }

            @if(shopForm.get('name')?.hasError('maxlength') && shopForm.get('name')?.touched) {
                <p class="message error">Numele nu poate avea mai mult de 100 de caractere.</p>
            }    

            <label for="email">Email: </label>
            <input id="email" type="text" formControlName="email"/>

            @if(shopForm.get('email')?.hasError('email') && shopForm.get('email')?.touched) {
                <p class="message error">Adresa de email introdusă nu este validă.</p>
            }

            @else if(shopForm.get('email')?.hasError('maxlength') && shopForm.get('email')?.touched) {
                <p class="message error">Emailul nu poate avea mai mult de 50 de caractere.</p>
            }

            <label for="password">Parolă: </label>
            <input id="password" type="password" formControlName="password"/>

            @if(shopForm.get('password')?.hasError('minlength') && shopForm.get('password')?.touched) {
                <p class="message error">Parola trebuie să conțină cel puțin 6 caractere.</p>
            }

            @if(shopForm.get('password')?.hasError('required') && shopForm.get('password')?.touched) {
                <p class="message error">Parola este obligatorie.</p>
            }

            @if(shopForm.get('password')?.hasError('maxlength') && shopForm.get('password')?.touched) {
                <p class="message error">Parola nu poate avea mai mult de 50 de caractere.</p>
            }

            <label for="confirm-password">Confirmare parolă: </label>
            <input id="confirm-password" type="password" formControlName="confirmPassword"/>

            @if(shopForm.hasError('passwordsDontMatch') && shopForm.get('confirmPassword')?.touched) {
                <p class="message error">Parolele sunt diferite!</p>
            }

            <label for="address">Adresă: </label>
            <textarea id="address" formControlName="address" rows="2" placeholder="Introduceți adresa completă a magazinului...">

            </textarea>
            
            @if(shopForm.get('address')?.hasError('required') && shopForm.get('address')?.touched) {
                <p class="message error">Adresa este obligatorie.</p>
            }
            @if(shopForm.get('address')?.hasError('maxlength') && shopForm.get('address')?.touched) {
                <p class="message error">Adresa nu poate avea mai mult de 255 de caractere.</p>
            }

            <button type="submit" class="primary" [disabled]="shopForm.invalid">Creare magazin</button>
        </form>
    `,

    styleUrls: ['./admin-create-shop.css']
})

export class AdminCreateShop {
    requestStatus = input<'loading' | 'success'>('loading');
    addShopEvent = output<CreateShopRequest>();
    
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
        name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]),
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
        confirmPassword: new FormControl('', Validators.required),
        address: new FormControl('', [Validators.required, Validators.maxLength(255)])
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