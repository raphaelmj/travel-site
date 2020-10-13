import { Component, OnInit, Input, ViewContainerRef, ComponentRef, ViewChild, ComponentFactoryResolver, Type, OnDestroy } from '@angular/core';
import { Attraction } from 'src/app/models/attraction';
import { Region } from 'src/app/models/region';
import { EditAddAttractionComponent } from '../../edit-add-attraction/edit-add-attraction.component';
import { RegionService } from 'src/app/services/filters/region.service';
import { CityService } from 'src/app/services/filters/city.service';
import { Subscription } from 'rxjs';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';
import { AttractionService } from 'src/app/services/filters/attraction.service';
import { RefreshFiltersGeoService } from 'src/app/services/refresh-filters-geo.service';

@Component({
  selector: 'app-region-attraction-row',
  templateUrl: './region-attraction-row.component.html',
  styleUrls: ['./region-attraction-row.component.less']
})
export class RegionAttractionRowComponent implements OnInit, OnDestroy {

  @ViewChild('editAdd', { read: ViewContainerRef, static: true }) editAdd: ViewContainerRef
  editAddAC: ComponentRef<EditAddAttractionComponent>
  @ViewChild('confirm', { read: ViewContainerRef, static: true }) confirmTemp: ViewContainerRef
  confirmC: ComponentRef<ConfirmWindowComponent>

  @Input() attraction: Attraction
  @Input() region: Region


  regionsSub: Subscription
  citiesSub: Subscription

  constructor(
    private cf: ComponentFactoryResolver,
    private regionService: RegionService,
    private cityService: CityService,
    private attractionService: AttractionService,
    private refreshFiltersGeoService: RefreshFiltersGeoService) { }


  ngOnInit() {

  }

  updateAttraction() {

    this.regionsSub = this.regionService.getRegions().subscribe(rs => {

      this.citiesSub = this.cityService.getCities().subscribe(cs => {

        let edit = this.cf.resolveComponentFactory(<Type<EditAddAttractionComponent>>EditAddAttractionComponent)
        this.editAddAC = this.editAdd.createComponent<EditAddAttractionComponent>(edit)
        this.editAddAC.instance.isNew = false
        this.editAddAC.instance.attraction = this.attraction
        this.editAddAC.instance.region = this.region
        this.editAddAC.instance.city = null
        this.editAddAC.instance.cities = cs
        this.editAddAC.instance.regions = rs
        this.editAddAC.instance.emitCloseSelect.subscribe(r => {
          this.editAddAC.destroy()
        })

      })

    })



  }


  beforeDeleteAttraction(a: Attraction) {
    this.confirmTemp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.confirmTemp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = a
    this.confirmC.instance.message = 'Czy checesz usunąć atrakcje?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {
      if (r.do) {
        this.deleteAttraction(r.bundleData)
        this.confirmC.destroy()
      } else {
        this.confirmC.destroy()
      }
    })
  }

  deleteAttraction(a: Attraction) {
    this.attractionService.deleteAttractionNameReafactorIndex(a.id).then(r => {
      // console.log(r)
      this.refreshFiltersGeoService.makeRefresh()
    })
  }



  ngOnDestroy(): void {
    if (this.regionsSub)
      this.regionsSub.unsubscribe()

    if (this.citiesSub)
      this.citiesSub.unsubscribe()
  }


}
