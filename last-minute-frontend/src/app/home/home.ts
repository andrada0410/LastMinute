import { Component, inject, OnInit } from '@angular/core';
import { HousingLocation } from '../example/example';
import { ExampleInfo } from '../example';
import { ExampleService } from '../example.service';

@Component({
    selector: 'app-home',
    imports: [HousingLocation],
    template: `
    <section>
      <form>
        <input type="text" placeholder="Filter by city" #filter />
        <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button>
      </form>
    </section>
    <section class="results">
      @for(housingLocation of filteredLocationList; track $index) {
        <app-housing-location [housingLocation]="housingLocation"></app-housing-location>
      }
    </section>
  `,
    styleUrls: ['./home.css'],
})
export class Home implements OnInit {
    housingLocationList: ExampleInfo[] = [];
    housingService: ExampleService = inject(ExampleService);
    filteredLocationList: ExampleInfo[] = [];

    constructor() { }

    ngOnInit(): void {
        this.housingService
            .getAllExamples()
            .subscribe((housingLocationList: ExampleInfo[]) => {
                this.housingLocationList = housingLocationList;
                this.filteredLocationList = housingLocationList;
            });
    }

    filterResults(text: string) {
        if (!text) {
            this.filteredLocationList = this.housingLocationList;
            return;
        }

        this.filteredLocationList = this.housingLocationList.filter((housingLocation) =>
            housingLocation?.NUME.toLowerCase().includes(text.toLowerCase()),
        );
    }
}