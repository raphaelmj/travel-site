import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { AgmInfoWindow, InfoWindowManager, AgmMarker } from '@agm/core';
import { API_URL, ATTRACTIONS_TYPE, AttractionType } from '../config';
import { Attraction } from "../models/attraction"
import { City } from "../models/city"
import { Catalog } from "../models/catalog"
import { ViewChildren } from '@angular/core';
import { QueryList } from '@angular/core';
import { EventService } from '../services/event.service';
import { Renderer2 } from '@angular/core';
import { ES_GTE_THEN_6 } from '../config'

export interface WirturViewMarker {
  data: City | Attraction;
  attractionType: string | null;
  localType: string | null;
  icon?: string;
  onMap: boolean;
}

@Component({
  selector: 'app-event-map',
  templateUrl: './event-map.component.html',
  styleUrls: ['./event-map.component.less']
})
export class EventMapComponent implements OnInit {

  @Input() cities: City[];
  @Input() attractions: Attraction[]
  @Input() catalog: Catalog;
  @ViewChildren(AgmInfoWindow) infoWindows: QueryList<AgmInfoWindow> = new QueryList<AgmInfoWindow>()
  @ViewChildren(AgmMarker) markersRefs: QueryList<AgmMarker> = new QueryList<AgmMarker>()
  markersFullList: WirturViewMarker[] = []
  types: AttractionType[] = ATTRACTIONS_TYPE
  lat: number = 52.069325;
  lng: number = 19.480297;
  zoom: number = 6
  apiUrl: string = API_URL
  esGteThen6: boolean = ES_GTE_THEN_6;

  constructor(private eventService: EventService, private renderer: Renderer2) { }

  ngOnInit() {
    this.makeEventMap()
  }


  makeEventMap() {

    this.markersFullList = []

    this.cities.map(c => {
      let m: WirturViewMarker = {
        data: c,
        localType: 'city',
        icon: '/img/markers/marker-city.png',
        attractionType: null,
        onMap: true
      }
      this.markersFullList.push(m)
    })
    this.attractions.map(a => {

      var bool = true;

      this.types.map(t => {
        // console.log(a.attractionType, t.type, t.selected)
        if (a.attractionType == t.type) {
          if (t.selected) {
            bool = false
          }
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

  showMarkerCloud(m: WirturViewMarker, index: number) {
    this.infoWindows.map(inf => {
      inf.close()
    })
    this.lat = m.data.lat;
    this.lng = m.data.lng

    this.cloudElementsPut(m, index)

  }

  changeZoom($event) {
    this.zoom = $event
  }

  cloudElementsPut(m: WirturViewMarker, index: number) {
    var query = ''
    var queryUri = '/api/search/index'
    var catalogId: string = (this.catalog) ? String(this.catalog.id) : '';
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


  selectType($event) {
    this.types = $event
    this.makeEventMap()
  }

}
