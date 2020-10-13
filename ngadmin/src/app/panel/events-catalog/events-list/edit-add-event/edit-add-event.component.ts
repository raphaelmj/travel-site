import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, OnDestroy, Type } from '@angular/core';
import { TourEvent, PriceConfig } from 'src/app/models/tour-event';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Region } from 'src/app/models/region';
import { FiltersFindAddComponent } from './filters-find-add/filters-find-add.component';
import { City } from 'src/app/models/city';
import { Attraction } from 'src/app/models/attraction';
import { CK_EDITOR_CONFIG, API_URL } from 'src/app/config';
import { Catalog } from 'src/app/models/catalog';
import * as _moment from 'moment';
import { DateAdapter } from '@angular/material';
import { TourEventStatus, TourEventType, TourEventSezonType } from 'src/app/models/query-params';
import { PriceConfigComponent } from './price-config/price-config.component';
import { MicroGalleryComponent } from './micro-gallery/micro-gallery.component';
import { PricePreviewComponent } from './price-preview/price-preview.component';
import { Day } from 'src/app/models/day';
import { Age } from 'src/app/models/age';
import { Theme } from 'src/app/models/theme';
import { EventService } from 'src/app/services/events-catalog/event.service';
import { RefreshEventsService } from 'src/app/services/refresh-events.service';

@Component({
  selector: 'app-edit-add-event',
  templateUrl: './edit-add-event.component.html',
  styleUrls: ['./edit-add-event.component.less']
})
export class EditAddEventComponent implements OnInit, OnDestroy {

  @ViewChild(FiltersFindAddComponent, { static: true }) filterFind: FiltersFindAddComponent
  @ViewChild(PricePreviewComponent, { static: true }) pricePreview: PricePreviewComponent
  @ViewChild('editTemp', { read: ViewContainerRef, static: true }) editTemp: ViewContainerRef
  priceConfigC: ComponentRef<PriceConfigComponent>
  microGalleryC: ComponentRef<MicroGalleryComponent>

  @Input() event: TourEvent
  @Input() tax: number
  @Input() catalogs: Catalog[]
  @Input() isNew: boolean = false
  @Input() days: Day[]
  @Input() ages: Age[]
  @Input() themes: Theme[]
  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  subEvent: Subscription
  formEvent: FormGroup
  croppedImage: string = null
  apiUrl: string = API_URL
  priceConfig: PriceConfig[]
  isLoading: boolean = false

  ckEditorConfig: any = CK_EDITOR_CONFIG;

  statuses: { value: TourEventStatus, name: string }[] = [
    {
      value: TourEventStatus.avl,
      name: 'Dostępne'
    },
    {
      value: TourEventStatus.noavl,
      name: 'Nie dostępne'
    }
  ]

  types: { value: TourEventType, name: string }[] = [
    {
      value: TourEventType.organize,
      name: 'Kolonie / Zimowiska'
    },
    {
      value: TourEventType.template,
      name: 'Katalogowe'
    }
  ]


  sezons: { value: TourEventSezonType, name: string }[] = [
    {
      value: TourEventSezonType.any,
      name: 'Dowolny'
    },
    {
      value: TourEventSezonType.summer,
      name: 'Kolonie'
    },
    {
      value: TourEventSezonType.winter,
      name: 'Zimowiska'
    }
  ]

  subTypeChange: Subscription


  constructor(
    private fb: FormBuilder,
    dateAdapter: DateAdapter<Date>,
    private cf: ComponentFactoryResolver,
    private eventService: EventService,
    private refreshEventsService: RefreshEventsService
  ) {
    dateAdapter.setLocale('pl-PL')
    // this.priceConfig = this.event.priceConfig
  }

  ngOnInit() {
    this.prepareDataView()

  }


  prepareDataView() {
    this.createForm()
    this.changeTypeSubscribe()
    this.changeSezonTypeSubscribe()
  }


  changeTypeSubscribe() {
    this.subTypeChange = this.formEvent.get('eventType').valueChanges.subscribe(v => {
      if (v == TourEventType.template && this.formEvent.get('eventSezonType').value != TourEventSezonType.any) {
        this.formEvent.get('eventSezonType').setValue(TourEventSezonType.any)
      }
    })
  }

  changeSezonTypeSubscribe() {
    this.subTypeChange = this.formEvent.get('eventSezonType').valueChanges.subscribe(v => {
      if (v != TourEventSezonType.any && this.formEvent.get('eventType').value != TourEventType.organize) {
        this.formEvent.get('eventType').setValue(TourEventType.organize)
      }
    })
  }



  createForm() {
    var c = null
    if (this.event.catalog) {
      c = this.event.catalog.id
    }
    this.formEvent = this.fb.group({
      number: [this.event.number, [Validators.required], this.validateNumberNotTaken.bind(this)],
      name: [this.event.name, [Validators.required, Validators.minLength(3)]],
      smallDesc: [this.event.smallDesc],
      longDesc: [this.event.longDesc],
      priceNetto: [this.event.priceNetto],
      priceBrutto: [this.event.priceBrutto],
      tax: [this.event.tax],
      startAt: [this.event.startAt],
      endAt: [this.event.endAt],
      status: [this.event.status],
      atSezon: [this.event.atSezon],
      eventType: [this.event.eventType],
      eventSezonType: [this.event.eventSezonType],
      attachments: this.createAttachmentsFormArray(),
      metaDescription: [this.event.metaDescription],
      metaKeywords: [this.event.metaKeywords],
      catalog: [c]
    })
  }


  validateNumberNotTaken(control: AbstractControl) {
    var id = null
    if (this.event.id) {
      id = this.event.id
    }
    return this.eventService.checkIsNumberFree(control.value, this.isNew, id).then(res => {
      return res ? null : { numberTaken: true };
    });
  }


  createAttachmentsFormArray(): FormArray {
    var arr: FormArray = this.fb.array([])
    if (this.event.attachments) {
      this.event.attachments.map(a => {
        arr.push(this.fb.group({
          file: [''],
          name: ['']
        }))
      })
    }
    return arr
  }

  addEventAttach(file: string) {

    this.formEvent.get('attachments')['controls'].push(
      this.fb.group({
        file: [file],
        name: ['Nazwa pliku']
      }))
  }

  removeEventAttach(index: number) {
    this.formEvent.get('attachments')['controls'].splice(index, 1)
    this.formEvent.get('attachments').value.splice(index, 1)
  }


  addRegion($event) {
    this.event.Regions.push($event)
  }


  addCity($event) {
    // console.log($event)
    this.event.Cities.push($event)
  }

  addAttraction($event) {
    // console.log($event)
    this.event.Attractions.push($event)
  }


  removeRegion(el: Region, i) {
    this.event.Regions.splice(i, 1)
    this.filterFind.getRegionsList()
  }

  removeCity(el: City, i) {
    this.event.Cities.splice(i, 1)
    this.filterFind.getRegionsList()
    var region: Region = this.filterFind.regionSelected
    if (region) {
      this.filterFind.showCA(region)
    }
  }

  removeAttraction(el: Attraction, i) {
    this.event.Attractions.splice(i, 1)
    this.filterFind.getRegionsList()
    var region: Region = this.filterFind.regionSelected
    if (region) {
      this.filterFind.showCA(region)
    }
  }


  changeThemes(el: Theme[]) {
    this.event.Themes = el
  }

  changeAges(el: Age[]) {
    this.event.Ages = el
  }

  changeDays(el: Day[]) {
    this.event.Days = el
  }


  attachGet($event) {
    // console.log($event)
    this.addEventAttach($event)
  }


  closeEdit() {
    this.emitClose.emit()
  }

  changeImage($event) {
    // console.log($event)
    this.croppedImage = $event
  }


  openPriceConfigEdit() {
    this.editTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<PriceConfigComponent>>PriceConfigComponent)
    this.priceConfigC = this.editTemp.createComponent<PriceConfigComponent>(edit)
    let pc: PriceConfig[] = this.event.priceConfig
    this.priceConfigC.instance.priceConfig = pc
    this.priceConfigC.instance.emitPrice.subscribe(p => {

      this.event.priceConfig = p
      // console.log(this.event.priceConfig)
      this.pricePreview.priceConfig = p
      this.pricePreview.priceConfigGroup = []
      this.pricePreview.makePriceIfExists()
    })
    this.priceConfigC.instance.emitClose.subscribe(d => {
      this.priceConfigC.destroy()
    })
  }

  openMicroGalleryConfigEdit() {
    this.editTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<MicroGalleryComponent>>MicroGalleryComponent)
    this.microGalleryC = this.editTemp.createComponent<MicroGalleryComponent>(edit)

    if (this.event.microGallery)
      this.microGalleryC.instance.galleryImages = this.event.microGallery

    this.microGalleryC.instance.emitGalleryChange.subscribe(images => {
      this.event.microGallery = images
    })
    this.microGalleryC.instance.emitClose.subscribe(d => {
      this.microGalleryC.destroy()
    })
  }


  saveEvent() {

    var values = Object.assign({}, this.formEvent.value)
    values.catalog = this.findCatalogById(values.catalog)

    var event: TourEvent = { ...this.event, ...this.formEvent.value }
    var { updatedAt, createdAt, alias, ...minEvent } = event
    console.log(minEvent)
    minEvent.catalogId = (values.catalog) ? values.catalog.id : values.catalog


    if (this.formEvent.valid) {
      if (this.isNew) {
        this.createEvent(minEvent)
      } else {
        this.updateEvent(minEvent)
      }
    }

  }


  updateEvent(event: TourEvent) {
    this.isLoading = true
    this.eventService.updateEvent(event).then(r => {
      this.isLoading = false
      this.refreshEventsService.makeRefresh()
    })
  }


  createEvent(event: TourEvent) {
    this.isLoading = true
    this.eventService.createEvent(event).then(r => {
      this.isLoading = false
      this.refreshEventsService.makeRefresh()
    })
  }

  findCatalogById(id: number) {
    var cs = this.catalogs.filter(c => c.id == id)
    if (cs.length > 0)
      return cs[0]
    else
      return null
  }

  ngOnDestroy(): void {
    if (this.subTypeChange)
      this.subTypeChange.unsubscribe()
  }


}
