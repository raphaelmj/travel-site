import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { TourEventService } from 'src/app/services/events-catalog/tour-event.service';
import { Subscription, empty } from 'rxjs';
import { TourEvent } from 'src/app/models/tour-event';
import { QueryParams, TourEventStatus } from 'src/app/models/query-params';
import { Catalog } from 'src/app/models/catalog';
import { API_URL } from 'src/app/config';
import { EditAddEventComponent } from './edit-add-event/edit-add-event.component';
import { Day } from 'src/app/models/day';
import { Age } from 'src/app/models/age';
import { Theme } from 'src/app/models/theme';
import { EventService } from 'src/app/services/events-catalog/event.service';
import { RefreshEventsService } from 'src/app/services/refresh-events.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.less']
})
export class EventsListComponent implements OnInit {

  @ViewChild('editTemp', { read: ViewContainerRef, static: true }) editTemp: ViewContainerRef
  editAddEventC: ComponentRef<EditAddEventComponent>
  events: TourEvent[]
  queryParams: QueryParams
  catalog: Catalog
  catalogs: Catalog[]
  total: number
  pages: number
  apiUrl: string = API_URL
  firstLoad: boolean = true;
  subQParams: Subscription
  subEvents: Subscription
  tax: number
  days: Day[]
  ages: Age[]
  themes: Theme[]

  subRefesh: Subscription

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tourEventService: TourEventService,
    private eventService: EventService,
    private cf: ComponentFactoryResolver,
    private refreshEventsService: RefreshEventsService
  ) {
    this.events = this.activatedRoute.snapshot.data['data'].events
    this.queryParams = this.activatedRoute.snapshot.data['data'].qp
    this.catalog = this.activatedRoute.snapshot.data['data'].catalog
    this.total = this.activatedRoute.snapshot.data['data'].total
    this.pages = this.countPages(this.total, this.queryParams.limit)
    this.tax = this.activatedRoute.snapshot.data['tax']
    this.catalogs = this.activatedRoute.snapshot.data['catalogs']
    this.days = this.activatedRoute.snapshot.data['days']
    this.ages = this.activatedRoute.snapshot.data['ages']
    this.themes = this.activatedRoute.snapshot.data['themes']

  }


  ngOnInit() {
    // console.log(this.activatedRoute.snapshot.data['data'])
    this.routerChange()
    // this.openEventEdit(169)
    this.subRefesh = this.refreshEventsService.refresh$.subscribe(bool => {
      if (bool) {
        this.getEvents(this.queryParams)
      }
    })
  }

  routerChange() {
    this.subQParams = this.activatedRoute.queryParams.subscribe(qp => {
      if (!this.firstLoad) {
        this.queryParams = this.createQueryParams(qp)
        this.getEvents(this.queryParams)
      } else {
        this.firstLoad = false
      }
    })
  }


  getEvents(qp: QueryParams) {
    this.subEvents = this.tourEventService.getCatalogEventsQuery(qp, this.catalogId).subscribe(r => {
      // console.log(r)
      this.events = r.events
      this.catalog = r.catalog
      this.queryParams = r.qp
    })
  }


  changePage($event) {
    // console.log($event)
    this.queryParams.page = $event.nr
    this.router.navigate(['/panel/events-catalog/' + this.catalogId], { queryParams: this.queryParams })
  }


  createQueryParams(qp): QueryParams {
    let qParams: QueryParams = {
      limit: (qp.limit) ? qp.limit : 20,
      page: (qp.page) ? qp.page : 1,
      status: (qp.status) ? (qp.status) : TourEventStatus.all,
      sezon: (qp.sezon) ? qp.sezon : 'all',
      type: (qp.type) ? qp.type : 'all',
      numberPhrase: (qp.numberPhrase) ? qp.numberPhrase : ''
    }
    return qParams
  }

  countPages(total: number, limit: number | string): number {
    var pages: number = 1
    if (total > limit) {
      if (typeof limit == 'string')
        limit = parseInt(limit)
      pages = Math.ceil(total / limit)
      return pages
    }
    return pages
  }

  changeValuesFilters($event) {
    this.queryParams.status = $event.status
    this.queryParams.type = $event.type
    this.queryParams.sezon = $event.sezon
    this.queryParams.numberPhrase = $event.numberPhrase
    this.queryParams.page = 1

    this.router.navigate(['/panel/events-catalog/' + this.catalogId], { queryParams: this.queryParams })
  }

  get catalogId() {
    var cId: string | number = 'empty';
    if (this.catalog) {
      cId = this.catalog.id
    }
    return cId
  }


  editEventOpen($event) {
    // console.log($event)
    this.openEventEdit($event.id)
  }

  openEventEdit(eventId: number) {

    this.getEvent(eventId).then(event => {
      this.editTemp.clear()
      let edit = this.cf.resolveComponentFactory(<Type<EditAddEventComponent>>EditAddEventComponent)
      this.editAddEventC = this.editTemp.createComponent<EditAddEventComponent>(edit)
      this.editAddEventC.instance.isNew = false
      this.editAddEventC.instance.tax = this.tax
      this.editAddEventC.instance.catalogs = this.catalogs
      this.editAddEventC.instance.days = this.days
      this.editAddEventC.instance.ages = this.ages
      this.editAddEventC.instance.themes = this.themes
      this.editAddEventC.instance.event = event

      this.editAddEventC.instance.emitClose.subscribe(r => {
        this.editAddEventC.destroy()
      })
    })

  }

  openEventAdd() {

    this.editTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<EditAddEventComponent>>EditAddEventComponent)
    this.editAddEventC = this.editTemp.createComponent<EditAddEventComponent>(edit)
    this.editAddEventC.instance.isNew = true
    this.editAddEventC.instance.tax = this.tax
    this.editAddEventC.instance.catalogs = this.catalogs
    this.editAddEventC.instance.days = this.days
    this.editAddEventC.instance.ages = this.ages
    this.editAddEventC.instance.themes = this.themes
    this.editAddEventC.instance.event = this.eventService.createEmpty()

    this.editAddEventC.instance.emitClose.subscribe(r => {
      this.editAddEventC.destroy()
    })


  }

  async getEvent(eventId) {
    return await this.tourEventService.getEventFullDataBase(eventId).toPromise()
  }

}
