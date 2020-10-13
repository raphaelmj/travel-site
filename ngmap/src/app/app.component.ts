import { Component } from '@angular/core';
// import { attractions, cities, catalog } from './example-data';
import { Attraction } from "./models/attraction"
import { City } from "./models/city"
import { Catalog } from "./models/catalog"

declare var cities: City[];
declare var attractions: Attraction[];
declare var catalog: Catalog | null

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  cities: City[];
  attractions: Attraction[]
  catalog: Catalog;

  constructor() {
    this.cities = cities;
    this.attractions = attractions
    this.catalog = catalog
  }
}
