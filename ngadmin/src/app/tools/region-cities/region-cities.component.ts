import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Region } from 'src/app/models/region';
import { City } from 'src/app/models/city';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-region-cities',
  templateUrl: './region-cities.component.html',
  styleUrls: ['./region-cities.component.less']
})
export class RegionCitiesComponent implements OnInit, OnDestroy {

  @Input() region: Region
  @Input() city: City
  @Input() regions: Region[]
  @Input() cities: City[]
  @Output() emitChange: EventEmitter<{ region: Region, city: City | null }> = new EventEmitter()
  selectCities: City[]
  formC: FormGroup
  subChangeR: Subscription
  subChangeC: Subscription

  constructor(private fb: FormBuilder) { }


  ngOnInit() {

    this.findRegionCities(this.region.id)
    this.createForm()
    this.changeRegionS()
    this.changeCityS()
  }

  createForm() {
    var cityId: number = null
    if (this.city)
      cityId = this.city.id

    this.formC = this.fb.group({
      region: [this.region.id],
      city: [cityId]
    })
  }

  changeRegionS() {
    this.subChangeR = this.formC.get('region').valueChanges.subscribe(r => {
      this.formC.get('city').reset()
      this.findRegionCities(r)
      // this.emitChangeInSelects()
    })
  }

  changeCityS() {
    this.subChangeR = this.formC.get('city').valueChanges.subscribe(c => {
      // console.log(c)
      this.emitChangeInSelects()
    })
  }

  findRegionCities(regionId: number) {
    this.selectCities = this.cities.filter(c => {
      return c.regionId == regionId
    })
  }

  ngOnDestroy(): void {
    if (this.subChangeR)
      this.subChangeR.unsubscribe()

    if (this.subChangeC)
      this.subChangeC.unsubscribe()
  }

  emitChangeInSelects() {
    var city = this.findCityById(this.formC.get('city').value)
    var region = this.findRegionById(this.formC.get('region').value)
    this.emitChange.emit({ region, city })
  }

  findCityById(cityId: number): City {
    var city: City = null
    this.cities.map(c => {
      if (c.id == cityId) {
        city = c
      }
    })
    return city
  }

  findRegionById(regionId: number): Region {
    var region: Region = null
    this.regions.map(r => {
      if (r.id == regionId) {
        region = r
      }
    })
    return region
  }
}

