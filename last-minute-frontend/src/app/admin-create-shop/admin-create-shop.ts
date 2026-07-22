import { Component, inject, ViewChild } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AdminShopList } from "../admin-shop-list/admin-shop-list";
import { ShopService } from "../shop.service";

@Component({
    selector: 'app-super-admin-page',
    standalone: true,
    imports: [ReactiveFormsModule, AdminShopList],
    template: `
        <div class='admin-dashboard-layout'>
            <section class='list-section'>
                <h2>Conturi Magazin</h2>
                <app-shop-list></app-shop-list>
            </section>

            <section class='form-section'>
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

                    @if(backendError) {
                        <p class="error-message">{{ backendError }}</p>
                    }

                    <button type="submit" class="primary" [disabled]="shopForm.invalid">Creare magazin</button>
                </form>
            </section>
        </div>

    `,

    styleUrls: ['./admin-create-shop.css']
})

export class SuperAdminPage {
    private router = inject(Router);
    private shopService = inject(ShopService);

    @ViewChild(AdminShopList) shopListComponent!: AdminShopList;

    backendError: string | null = null;

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

        const { email, password, name, address } = this.shopForm.value;

        this.shopService.registerShop(email!, password!, name!, address!).subscribe({
        next: (response) => {
            console.log('Success!', response);
            this.shopForm.reset();
            this.backendError = null;

            this.shopListComponent.currentPage = 1;
            this.shopListComponent.loadShops();
        },
        error: (err) => {
            this.backendError = err.error?.error || "A apărut o eroare neașteptată.";
        }
    });
    }

}