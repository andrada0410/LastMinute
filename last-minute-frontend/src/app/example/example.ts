import {Component, input} from '@angular/core';
import {ExampleInfo} from '../example';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-housing-location',
  imports: [RouterModule],
  template: `
    <section class="listing">
      
      <h2 class="listing-heading">{{ housingLocation().NUME }}</h2>
      <a [routerLink]="['/details', housingLocation().ID]">Learn More</a>
    </section>
  `,
  styleUrls: ['./example.css'],
})
export class HousingLocation {
  housingLocation = input.required<ExampleInfo>();
}