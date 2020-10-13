import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Region } from 'src/app/models/region';
import { RegionRowComponent } from './region-row/region-row.component';
import { EditAddRegionComponent } from './edit-add-region/edit-add-region.component';
import { RegionService } from 'src/app/services/filters/region.service';
import { RefreshFiltersGeoService } from 'src/app/services/refresh-filters-geo.service';
import { Subscription } from 'rxjs';
import { FilterService } from 'src/app/services/filters/filter.service';

@Component({
  selector: 'app-geo',
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.less']
})
export class GeoComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('editAdd', { read: ViewContainerRef, static: true }) editAdd: ViewContainerRef
  @ViewChildren(RegionRowComponent) regionsList: QueryList<RegionRowComponent>
  editAddC: ComponentRef<EditAddRegionComponent>
  regions: Region[]

  isLoading: boolean = false

  subRefresh: Subscription
  subFilter: Subscription

  constructor(
    private activatedRoute: ActivatedRoute,
    private cf: ComponentFactoryResolver,
    private regionService: RegionService,
    private refreshFiltersGeoService: RefreshFiltersGeoService,
    private filterService: FilterService) {

  }


  ngOnInit() {
    this.subRefresh = this.refreshFiltersGeoService.refresh$.subscribe(bool => {
      if (bool) {
        this.isLoading = true
        this.subFilter = this.filterService.getGeoFilters().subscribe(filters => {
          this.isLoading = false
          this.regions = filters.tree
        })
      }
    })
    this.regions = this.activatedRoute.snapshot.data['filters'].tree
  }
  ngAfterViewInit(): void {

    this.regionsList.map(rr => {
      // console.log(rr)
    })
  }

  addRegionOpen() {
    let edit = this.cf.resolveComponentFactory(<Type<EditAddRegionComponent>>EditAddRegionComponent)
    this.editAddC = this.editAdd.createComponent<EditAddRegionComponent>(edit)
    this.editAddC.instance.isNew = true
    this.editAddC.instance.editTitle = 'Utwórz nowy region'
    this.editAddC.instance.region = this.regionService.createEmptyRegion()
    this.editAddC.instance.emitCloseSelect.subscribe(r => {
      this.editAddC.destroy()
    })
  }

  ngOnDestroy(): void {
    if (this.subRefresh)
      this.subRefresh.unsubscribe()

    if (this.subFilter)
      this.subFilter.unsubscribe()
  }

}
