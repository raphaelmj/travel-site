import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { Region } from 'src/app/models/region';
import { City } from 'src/app/models/city';
import { Attraction } from 'src/app/models/attraction';
import { FilterService } from 'src/app/services/filters/filter.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-filters-find-add',
  templateUrl: './filters-find-add.component.html',
  styleUrls: ['./filters-find-add.component.less']
})
export class FiltersFindAddComponent implements OnInit, OnDestroy, OnChanges {

  @Input() eventRegions: Region[]
  @Input() eventCities: City[]
  @Input() eventAttractions: Attraction[]
  @Output() addRegionEmit: EventEmitter<Region> = new EventEmitter<Region>()
  @Output() addCityEmit: EventEmitter<City> = new EventEmitter<City>()
  @Output() addAttractionEmit: EventEmitter<Attraction> = new EventEmitter<Attraction>()
  isFirstLoad: boolean = true

  regions: Region[] = []
  cities: City[] = []
  attractions: Attraction[] = []
  regionSelected: Region



  subR: Subscription
  subC: Subscription
  subA: Subscription

  constructor(private filterService: FilterService) { }

  ngOnInit() {
    this.getRegionsList()
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes)
  }


  addRegion(r: Region, index: number) {
    this.addRegionEmit.emit(r)
    this.regions[index].added = true
  }

  addCity(c: City, index: number) {
    this.addCityEmit.emit(c)
    this.cities[index].added = true
  }


  addAttraction(a: Attraction, index: number) {
    this.addAttractionEmit.emit(a)
    this.attractions[index].added = true
  }


  getRegionsList() {
    this.subR = this.filterService.getRegions().pipe(
      map(rs => {
        var nrs = rs.map(r => {
          r.added = false
          if (this.findIsId(this.eventRegions, r.id)) {
            r.added = true
          }
          return r
        })
        return nrs
      })
    ).subscribe(regions => {
      this.regions = regions
    })
  }

  findIsId(collection: any[], id) {
    var bool = false
    collection.map(el => {
      if (el.id == id) {
        bool = true
      }
    })
    return bool
  }


  showCA(r: Region) {
    this.regionSelected = r
    this.subC = this.filterService.getRegionCities(this.regionSelected.id)
      .pipe(
        map(els => {
          var ns = els.map(r => {
            r.added = false
            if (this.findIsId(this.eventCities, r.id)) {
              r.added = true
            }
            return r
          })
          return ns
        }))
      .subscribe(c => {
        this.cities = c
      })
    this.subA = this.filterService.getRegionAttractions(this.regionSelected.id)
      .pipe(
        map(els => {
          var ns = els.map(r => {
            r.added = false
            if (this.findIsId(this.eventAttractions, r.id)) {
              r.added = true
            }
            return r
          })
          return ns
        }))
      .subscribe(a => {
        this.attractions = a
      })
  }

  ngOnDestroy(): void {
    if (this.subR)
      this.subR.unsubscribe()
    if (this.subC)
      this.subC.unsubscribe()
    if (this.subA)
      this.subA.unsubscribe()
  }

}
