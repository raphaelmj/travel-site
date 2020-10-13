import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { City } from 'src/app/models/city';
import { EditAddCityComponent } from '../../edit-add-city/edit-add-city.component';
import { CityService } from 'src/app/services/filters/city.service';
import { Region } from 'src/app/models/region';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';
import { EditAddAttractionComponent } from '../../edit-add-attraction/edit-add-attraction.component';
import { AttractionService } from 'src/app/services/filters/attraction.service';
import { Subscription } from 'rxjs';
import { RegionService } from 'src/app/services/filters/region.service';
import { RefreshFiltersGeoService } from 'src/app/services/refresh-filters-geo.service';

@Component({
  selector: 'app-city-row',
  templateUrl: './city-row.component.html',
  styleUrls: ['./city-row.component.less']
})
export class CityRowComponent implements OnInit, OnChanges {


  @Input() city: City
  @Input() region: Region
  @Input() hideAttractions: boolean = true
  @ViewChild('editAdd', { read: ViewContainerRef, static: true }) editAdd: ViewContainerRef
  editAddCityC: ComponentRef<EditAddCityComponent>
  @ViewChild('confirm', { read: ViewContainerRef, static: true }) confirmTemp: ViewContainerRef
  confirmC: ComponentRef<ConfirmWindowComponent>
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hideAttractions) {
      if (!changes.hideAttractions.firstChange) {
        // console.log(changes.hideAttractions.currentValue)
      }
    }
  }


  hideShowAttraction() {
    this.hideAttractions = (this.hideAttractions) ? false : true
  }

  editCity() {
    this.regionsSub = this.regionService.getRegions().subscribe(rs => {
      let edit = this.cf.resolveComponentFactory(<Type<EditAddCityComponent>>EditAddCityComponent)
      this.editAddCityC = this.editAdd.createComponent<EditAddCityComponent>(edit)
      this.editAddCityC.instance.isNew = false
      this.editAddCityC.instance.editTitle = 'Edytuj miasto ' + this.city.name
      this.editAddCityC.instance.city = this.city
      this.editAddCityC.instance.region = this.region
      this.editAddCityC.instance.regions = rs
      this.editAddCityC.instance.emitCloseSelect.subscribe(r => {
        this.editAddCityC.destroy()
      })
    })
  }


  addAttraction(region: Region) {

    this.regionsSub = this.regionService.getRegions().subscribe(rs => {

      this.citiesSub = this.cityService.getCities().subscribe(cs => {


        this.editAdd.clear()
        let edit = this.cf.resolveComponentFactory(<Type<EditAddAttractionComponent>>EditAddAttractionComponent)
        this.editAddAttractionC = this.editAdd.createComponent<EditAddAttractionComponent>(edit)
        this.editAddAttractionC.instance.isNew = true
        this.editAddAttractionC.instance.editTitle = 'Dodaj atrakcje'
        this.editAddAttractionC.instance.region = this.region
        this.editAddAttractionC.instance.city = this.city
        this.editAddAttractionC.instance.cities = cs
        this.editAddAttractionC.instance.regions = rs
        this.editAddAttractionC.instance.attraction = this.attractionService.createEmpty()
        this.editAddAttractionC.instance.emitCloseSelect.subscribe(r => {
          this.editAddAttractionC.destroy()
        })

      })
    })
  }


  beforeDeleteCity(c: City) {
    this.confirmTemp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.confirmTemp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = c
    this.confirmC.instance.message = 'Czy checesz usunąć miasto?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {
      if (r.do) {
        this.deleteCity(r.bundleData)
        this.confirmC.destroy()
      } else {
        this.confirmC.destroy()
      }
    })
  }

  deleteCity(c: City) {
    this.cityService.deleteCityNameReafactorIndex(c.id).then(r => {
      // console.log(r)
      this.refreshFiltersGeoService.makeRefresh()
    })
  }

}
