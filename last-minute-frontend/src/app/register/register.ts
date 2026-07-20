import { Component, inject } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule],
    template:  `
        <section class="page page-centered">
            <form class="card form-card" [formGroup]="registerForm" (submit)="submitRegister()">
                <h2>Creează un cont</h2>

                <label for="first-name">Prenume: </label>
                <input id="first-name" type="text" formControlName="firstName"/>
            
                <label for="last-name">Nume: </label>
                <input id="last-name" type="text" formControlName="lastName"/>

                <label for="email">Email: </label>
                <input id="email" type="text" formControlName="email"/>

                @if(registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched) {
                    <p class="message error">Adresa de email introdusă nu este validă.</p>
                }

                <label for="password">Parolă: </label>
                <input id="password" type="password" formControlName="password"/>

                @if(registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
                    <p class="message error">Parola trebuie să conțină cel puțin 6 caractere.</p>
                }

                <label for="confirm-password">Confirmare parolă: </label>
                <input id="confirm-password" type="password" formControlName="confirmPassword"/>

                @if(registerForm.hasError('passwordsDontMatch') && registerForm.get('confirmPassword')?.touched) {
                    <p class="message error">Parolele sunt diferite!</p>
                }

                @if(backendError) {
                    <p class="message error">{{ backendError }}</p>
                }

                <button type="submit" class='button primary' [disabled]="registerForm.invalid">Creare cont</button>

            </form>
        </section>
    `,
    styleUrls: ['./register.css']
})

export class Register {
    private authService = inject(AuthService);
    private router = inject(Router);

    backendError: string | null = null;

    passwordValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            return { passwordsDontMatch: true };
        }
        return null;
    }

    registerForm = new FormGroup({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', Validators.required)
    }, {
        validators: this.passwordValidator
    });

    submitRegister() {
        this.backendError = null;

        if (this.registerForm.invalid) {
            return;
        }

        const { firstName, lastName, email, password } = this.registerForm.value;

        this.authService.register(firstName!, lastName!, email!, password!)
            .subscribe({
                next: (response) => {
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    this.backendError = err.error.error || 'A apărut o eroare. Te rugăm să încerci din nou.';
                }
            });
    }
}