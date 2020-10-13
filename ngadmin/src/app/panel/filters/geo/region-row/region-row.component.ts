import { Component, OnInit, Input, ViewChild, ComponentRef, ViewChildren, QueryList, ViewContainerRef, ComponentFactoryResolver, Type, OnDestroy } from '@angular/core';
import { Region } from 'src/app/models/region';
import { CityRowComponent } from './city-row/city-row.component';
import { EditAddRegionComponent } from '../edit-add-region/edit-add-region.component';
import { EditAddCityComponent } from '../edit-add-city/edit-add-city.component';
import { CityService } from 'src/app/services/filters/city.service';
import { EditAddAttractionComponent } from '../edit-add-attraction/edit-add-attraction.component';
import { AttractionService } from 'src/app/services/filters/attraction.service';
import { RegionService } from 'src/app/services/filters/region.service';
import { Subscription } from 'rxjs';
import { RefreshFiltersGeoService } from 'src/app/services/refresh-filters-geo.service';

@Component({
  selector: 'app-region-row',
  templateUrl: './region-row.component.html',
  styleUrls: ['./region-row.component.less']
})
export class RegionRowComponent implements OnInit, OnDestroy {

  @Input() region: Region
  hideCities: boolean = true
  @ViewChild('editAdd', { read: ViewContainerRef, static: true }) editAdd: ViewContainerRef
  @ViewChildren(CityRowComponent) citiesList: QueryList<CityRowComponent>
  editAddC: ComponentRef<EditAddRegionComponent>
  editAddCityC: ComponentRef<EditAddCityComponent>
  editAddAttractionC: ComponentRef<EditAddAttractionComponent>

  regionsSub: Subscription
  citiesSub: Subscription



  constructor(
    private cf: ComponentFactoryResolver,
    private cityService: CityService,
    private attractionService: AttractionService,
    private regionService: RegionService,
    private refreshFiltersGeoService: RefreshFiltersGeoService) { }

  ngOnInit() {
  }

  hideShowCities() {
    this.hideCities = (this.hideCities) ? false : true
    this.citiesList.map(cr => {
      cr.hideAttractions = (this.hideCities) ? false : true
    })

  }

  editRegionOpen() {
    this.editAdd.clear()
    let edit = this.cf.resolveComponentFactory(<Type<EditAddRegionComponent>>EditAddRegionComponent)
    this.editAddC = this.editAdd.createComponent<EditAddRegionComponent>(edit)
    this.editAddC.instance.isNew = false
    this.editAddC.instance.editTitle = 'Edycja regionu ' + this.region.name
    this.editAddC.instance.region = this.region
    this.editAddC.instance.emitCloseSelect.subscribe(r => {
      this.editAddC.destroy()
    })
  }

  addCity(region: Region) {
    this.editAdd.clear()

    this.regionsSub = this.regionService.getRegions().subscribe(rs => {

      let edit = this.cf.resolveComponentFactory(<Type<EditAddCityComponent>>EditAddCityComponent)
      this.editAddCityC = this.editAdd.createComponent<EditAddCityComponent>(edit)
      this.editAddCityC.instance.isNew = true
      this.editAddCityC.instance.editTitle = 'Dodaj miasto'
      this.editAddCityC.instance.region = this.region
      this.editAddCityC.instance.regions = rs
      this.editAddCityC.instance.city = this.cityService.createEmptyCity()
      this.editAddCityC.instance.emitCloseSelect.subscribe(r => {
        this.editAddCityC.destroy()
      })

    })
  }


  addAttraction(region: Region) {

    this.editAdd.clear()

    this.regionsSub = this.regionService.getRegions().subscribe(rs => {

      this.citiesSub = this.cityService.getCities().subscribe(cs => {


        let edit = this.cf.resolveComponentFactory(<Type<EditAddAttractionComponent>>EditAddAttractionComponent)
        this.editAddAttractionC = this.editAdd.createComponent<EditAddAttractionComponent>(edit)
        this.editAddAttractionC.instance.isNew = true
        this.editAddAttractionC.instance.editTitle = 'Dodaj atrakcje'
        this.editAddAttractionC.instance.region = this.region
        this.editAddAttractionC.instance.attraction = this.attractionService.createEmpty()
        this.editAddAttractionC.instance.cities = cs
        this.editAddAttractionC.instance.regions = rs
        this.editAddAttractionC.instance.emitCloseSelect.subscribe(r => {
          this.editAddAttractionC.destroy()
        })

      })
    })
  }

  ngOnDestroy(): void {
    if (this.regionsSub)
      this.regionsSub.unsubscribe()

    if (this.citiesSub)
      this.citiesSub.unsubscribe()
  }

}
