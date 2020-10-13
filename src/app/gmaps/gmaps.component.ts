import { Component, OnInit, ViewChildren, QueryList, Directive, ContentChildren, ComponentRef, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Criteria } from '../models/criteria';
import { MapQueryParams } from '../models/map-query-params';
import { Region } from '../models/region';
import { API_URL, AttractionType, ATTRACTIONS_TYPE } from '../config';
import { City } from '../models/city';
import { Attraction } from '../models/attraction';
import { AgmInfoWindow, InfoWindowManager, AgmMarker } from '@agm/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventService } from '../services/event.service';
import { Catalog } from '../models/catalog';
import { IndexCriteria } from '../models/index-criteria';
import { Location } from '@angular/common';
import { SelectRegionComponent } from './select-region/select-region.component';
import { ES_GTE_THEN_6 } from '../config'
import { WidgetsGroup, WidgetMapInfoData } from '../models/widget';

export interface WirturViewMarker {
  data: City | Attraction;
  attractionType: string | null;
  localType: string | null;
  icon?: string;
  onMap: boolean;
}

@Component({
  selector: 'app-gmaps',
  templateUrl: './gmaps.component.html',
  styleUrls: ['./gmaps.component.less']
})
export class GmapsComponent implements OnInit {

  esGteThen6: boolean = ES_GTE_THEN_6;
  singlePoint: IndexCriteria = null
  menu: string;
  criteria: Criteria;
  currentCatalog: Catalog | null = null;
  viewCatalog: string = null
  lat: number = 52.069325;
  lng: number = 19.480297;
  zoom: number = 6
  mapQueryParams: MapQueryParams = {}
  selectedRegion: Region = null;
  apiUrl: string = API_URL;
  markersFullList: WirturViewMarker[] = []
  @ViewChild('singlePointEl', { static: false }) singlePointElement: ElementRef<AgmMarker>;
  @ViewChild('singlePointInfoWindowEl', { static: false }) singlePointInfoWindowEl: ElementRef<AgmInfoWindow>;
  @ViewChild(SelectRegionComponent, { static: true }) appSelectRegion: SelectRegionComponent
  @ViewChildren(AgmInfoWindow) infoWindows: QueryList<AgmInfoWindow> = new QueryList<AgmInfoWindow>()
  @ViewChildren(AgmMarker) markersRefs: QueryList<AgmMarker> = new QueryList<AgmMarker>()
  filterForm: FormGroup;
  types: AttractionType[] = ATTRACTIONS_TYPE
  widgetsGroup: WidgetsGroup
  instruct: string


  constructor(private activatedRoute: ActivatedRoute, private router: Router, private fb: FormBuilder, private renderer: Renderer2, private eventService: EventService, private location: Location) {
    this.menu = activatedRoute.snapshot.data['menu']
    this.criteria = activatedRoute.snapshot.data['criteria']
    this.widgetsGroup = activatedRoute.snapshot.data['widgets']
    // console.log(this.criteria)
    this.currentCatalog = this.findCurrentCatalog(this.criteria)
    this.subscribeToQueryParams()
  }
  ngOnInit() {
    this.filterForm = this.makeFormGroup()
    // this.subscribeToAttractionFilter()
    let widMap: WidgetMapInfoData = <WidgetMapInfoData>this.widgetsGroup.map_info.data
    this.instruct = widMap.content
  }

  // subscribeToAttractionFilter() {
  //   this.filterForm.get('cityPhrase').valueChanges.subscribe(p => {
  //     console.log(p)
  //   })
  // }

  makeFormGroup(): FormGroup {
    return this.fb.group({
      cityPhrase: [''],
      attractionPhrase: ['']
    })
  }

  subscribeToQueryParams() {
    this.activatedRoute.queryParams.subscribe(qp => {

      this.mapQueryParams = Object.assign({}, qp)
      var tps = []
      if (qp.exceptTypes) {
        tps = qp.exceptTypes.split(':')
        tps.forEach((t, i) => {
          this.types.map((tp, j) => {
            if (t == tp.type) {
              this.types[j].selected = true;
            }
          })
        })
      }
      if (qp.rid) {
        this.selectedRegion = this.findRegionById(qp.rid)
        // this.showRegionMap()
        this.singlePoint = null
        this.showRegionMap(true, tps)
      }
      if (qp.cid) {

      }

    })
  }

  createTypesString(showAll: boolean = false): string {
    var arg: string = ''
    var j = 0
    this.types.forEach((t, i) => {
      if (t.selected || showAll) {
        arg += (j != 0) ? ':' : '';
        arg += t.type
        j++
      }
    })
    return arg
  }


  selectType($event) {
    this.types = $event
    this.mapQueryParams.exceptTypes = this.createTypesString(false)
    this.router.navigate(['warto-zobaczyc'], {
      queryParams: this.mapQueryParams
    })
  }

  showRegionMap(setOnCenter: boolean, tps: string[]) {
    this.lat = this.selectedRegion.lat;
    this.lng = this.selectedRegion.lng;
    this.zoom = 7
    this.makeRegionMap(this.selectedRegion, true, tps)
  }


  makeRegionMap(region: Region, makeEmpty: boolean, exceptAttrs: string[] = []) {
    if (makeEmpty)
      this.markersFullList = []

    region.cities.map(c => {
      let m: WirturViewMarker = {
        data: c,
        localType: 'city',
        icon: '/img/markers/marker-city.png',
        attractionType: null,
        onMap: true
      }
      this.markersFullList.push(m)
    })
    region.attractions.map(a => {

      var bool = true;

      exceptAttrs.map(ex => {
        if (ex == a.attractionType) {
          bool = false;
        }
      })

      if (bool) {
        let m: WirturViewMarker = {
          data: a,
          attractionType: a.attractionType,
          localType: 'attraction',
          icon: '/img/markers/marker-attraction-' + a.attractionType + '.png',
          onMap: true
        }
        this.markersFullList.push(m)
      }
    })
  }



  findRegionById(id: number): Region {

    var r: Region = null
    this.criteria.regions.map(reg => {
      if (reg.id == id) {
        r = reg
      }
    })

    return r

  }



  changeRegion($event) {
    this.mapQueryParams.rid = $event.id
    this.router.navigate(['warto-zobaczyc'], { queryParams: this.mapQueryParams })
  }

  showMarkerCloud(m: WirturViewMarker, index: number) {
    this.infoWindows.map(inf => {
      inf.close()
    })
    this.lat = m.data.lat;
    this.lng = m.data.lng

    this.cloudElementsPut(m, index)


    // this.zoom = 14
    // var infoWindows: AgmInfoWindow[] = this.infoWindows.toArray()
    // console.log(infoWindows[index])
    // this.markersRefs.map((m, i) => {

    //   if (i == index) {
    //     // console.log(i, index, this.markersFullList[i])
    //     return m.zIndex = 300
    //   } else {
    //     return index
    //   }
    // })
  }





  findCurrentCatalog(criteria: Criteria) {
    var ct: Catalog | null = null;
    criteria.catalogs.map(c => {
      if (c.current) {
        ct = c
      }
    })
    return ct
  }


  showElement(m, i) {
    this.infoWindows.map(inf => {
      inf.close()
    })
    this.infoWindows.toArray()[i].open()
    this.infoWindows.toArray()[i].zIndex = 1000;
    this.markersRefs.toArray()[i].zIndex = 1000;
    this.lat = m.data.lat;
    this.lng = m.data.lng
    if (this.zoom < 14)
      this.zoom = 14

    this.cloudElementsPut(m, i)
  }


  cloudElementsPut(m: WirturViewMarker, index: number) {
    var query = ''
    var queryUri = '/api/search/index'

    var catalogId: string = (this.currentCatalog) ? String(this.currentCatalog.id) : '';
    if (m.localType == 'attraction') {
      query = '?regions=&cities=&attractions=' + m.data.id + '&themes=&ages=&catalog=' + catalogId + '&page=1&type=all&status=all&days=&order=default';
    } else if (m.localType == 'city') {
      query = '?regions=&cities=' + m.data.id + '&attractions=&themes=&ages=&catalog=' + catalogId + '&page=1&type=all&status=all&days=&order=default';
    }

    this.eventService.countAttractionEvents(queryUri + query).then(r => {
      // console.log(r.hits.total.value)
      this.infoWindows.toArray()[index].content.childNodes.item(5).textContent = ''
      var el = this.renderer.createElement('a')
      el.setAttribute('href', this.apiUrl + '/wyszukiwanie/' + query)
      el.setAttribute('target', '_blank')
      var text = this.renderer.createText('zobacz w wynikach wyszukiwania')
      el.appendChild(text)
      this.infoWindows.toArray()[index].content.childNodes.item(5).appendChild(el)
      if (this.esGteThen6) {
        this.infoWindows.toArray()[index].content.childNodes.item(3).textContent = String(r.hits.total.value)
      } else {
        this.infoWindows.toArray()[index].content.childNodes.item(3).textContent = String(r.hits.total)
      }

    })
  }

  async cloudSingleElementPut(singlePoint: IndexCriteria): Promise<any> {
    var query = ''
    var queryUri = '/api/search/index'

    var catalogId: string = (this.currentCatalog) ? String(this.currentCatalog.id) : '';
    if (singlePoint._source.baseType == 'attraction') {
      query = '?regions=&cities=&attractions=' + singlePoint._source.id + '&themes=&ages=&catalog=' + catalogId + '&page=1&type=all&status=all&days=&order=default';
    } else if (singlePoint._source.baseType == 'city') {
      query = '?regions=&cities=' + singlePoint._source.id + '&attractions=&themes=&ages=&catalog=' + catalogId + '&page=1&type=all&status=all&days=&order=default';
    }

    singlePoint.query = this.apiUrl + '/wyszukiwanie/' + query;
    this.singlePoint = singlePoint
    return this.eventService.countAttractionEvents(queryUri + query);
  }


  changeZoom($event) {
    this.zoom = $event
  }

  showAll() {
    this.criteria.regions.forEach((r, i) => {
      let bool: boolean = i == 0
      this.makeRegionMap(r, bool)
    })
  }


  openInfoCloud(m: WirturViewMarker) {
    // console.log(m)
  }


  setPoint($event: IndexCriteria) {
    this.markersFullList = []
    this.router.navigate([], { queryParams: {} })
    this.selectedRegion = null
    this.appSelectRegion.resetRegion()
    this.cloudSingleElementPut($event).then(r => {
      // console.log($event)
      this.singlePoint.total = String(r.hits.total.value)
      this.lat = this.singlePoint._source.lat;
      this.lng = this.singlePoint._source.lng;
      this.zoom = 14
      if (this.singlePoint._source.baseType == 'city') {
        this.singlePoint.icon = this.apiUrl + '/img/markers/marker-city.png'
      }
      if (this.singlePoint._source.baseType == 'attraction') {
        this.singlePoint.icon = this.apiUrl + '/img/markers/marker-attraction-' + this.singlePoint._source.localType + '.png'
      }
    })

  }

}
