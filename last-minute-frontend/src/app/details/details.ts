import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExampleService } from '../example.service';
import { ExampleInfo } from '../example';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-details',
    imports: [ReactiveFormsModule],
    template: `
    <article>
      <img
        class="listing-photo"
        src="/assets/location-pin.svg"
        alt="Exterior photo of {{ housingLocation?.NUME }}"
      />
      <section class="listing-description">
        <h2 class="listing-heading">{{ housingLocation?.NUME }}</h2>
      </section>
      <section class="listing-features">
        <h2 class="section-heading">About this housing location</h2>
        <ul>
          <li>Units available: {{ housingLocation?.ID }}</li>
          <li>Does this location have wifi: {{ housingLocation?.NUME }}</li>
        </ul>
      </section>
      <section class="listing-apply">
        <h2 class="section-heading">Apply now to live here</h2>
        <form [formGroup]="applyForm" (submit)="submitApplication()">
          <label for="first-name">First Name</label>
          <input id="first-name" type="text" formControlName="firstName" />

          <label for="last-name">Last Name</label>
          <input id="last-name" type="text" formControlName="lastName" />

          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" />
          <button type="submit" class="primary">Apply now</button>
        </form>
      </section>
    </article>
  `,
    styleUrls: ['./details.css'],
})
export class Details implements OnInit {
    route: ActivatedRoute = inject(ActivatedRoute);
    housingService = inject(ExampleService);
    housingLocation: ExampleInfo | undefined;

    applyForm = new FormGroup({
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl(''),
    });

    constructor() { }

    ngOnInit(): void {
        const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
        this.housingService.getExampleById(housingLocationId).subscribe((housingLocation: any) => {
            this.housingLocation = housingLocation;
        });
    }

    submitApplication() {
        this.housingService.submitApplication(
            this.applyForm.value.firstName ?? '',
            this.applyForm.value.lastName ?? '',
            this.applyForm.value.email ?? '',
        );
    }
}