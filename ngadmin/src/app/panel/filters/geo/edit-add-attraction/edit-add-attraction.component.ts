import { Component, OnInit, Input, Output, ViewChild, ViewContainerRef, EventEmitter, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { Attraction, AttractionTypeEnum } from 'src/app/models/attraction';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Region } from 'src/app/models/region';
import { City } from 'src/app/models/city';
import { AttractionService } from 'src/app/services/filters/attraction.service';
import { RefreshFiltersGeoService } from 'src/app/services/refresh-filters-geo.service';

@Component({
  selector: 'app-edit-add-attraction',
  templateUrl: './edit-add-attraction.component.html',
  styleUrls: ['./edit-add-attraction.component.less']
})
export class EditAddAttractionComponent implements OnInit, AfterViewInit {

  @Input() editTitle: string = ""
  @Input() isNew: boolean = true
  @Input() attraction: Attraction
  @Input() city: City = null
  @Input() region: Region
  @Output() emitCloseSelect: EventEmitter<any> = new EventEmitter()
  @ViewChild('changeDep', { read: ViewContainerRef, static: true }) cD: ViewContainerRef
  editForm: FormGroup
  aTypes: { name: string, value: AttractionTypeEnum }[] = [
    {
      name: 'Dowolny',
      value: AttractionTypeEnum.any
    },
    {
      name: 'Park',
      value: AttractionTypeEnum.park
    },
    {
      name: 'Muzeum',
      value: AttractionTypeEnum.muzeum
    },
    {
      name: 'Pomniki',
      value: AttractionTypeEnum.monument
    },
    {
      name: 'Obiekty sakralne',
      value: AttractionTypeEnum.sacral
    },
    {
      name: 'Natura',
      value: AttractionTypeEnum.nature
    },
    {
      name: 'Atrakcje wodne',
      value: AttractionTypeEnum.aqua
    },
    {
      name: 'Edukacja',
      value: AttractionTypeEnum.education
    },
    {
      name: 'Kultura',
      value: AttractionTypeEnum.culture
    }
  ]
  @Input() regions: Region[]
  @Input() cities: City[]


  constructor(
    private fb: FormBuilder,
    private cf: ComponentFactoryResolver,
    private attractionService: AttractionService,
    private refreshFiltersGeoService: RefreshFiltersGeoService) { }

  ngOnInit() {
    this.editForm = this.createForm()
    // console.log(this.cities)
  }

  ngAfterViewInit(): void {
    if (!this.isNew) {

    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: [this.attraction.name, Validators.required],
      lat: [this.attraction.lat, Validators.required],
      lng: [this.attraction.lng, Validators.required],
      attractionType: [this.attraction.attractionType, Validators.required]
    })
  }

  saveData() {

    if (this.editForm.valid) {
      var a: Attraction = { ...this.attraction, ...this.editForm.value }
      if (this.isNew) {
        this.createAttraction(a)
      } else {
        this.updateAttraction(a)
      }

    }

  }

  updateAttraction(a: Attraction) {
    this.attractionService.updateAttractionRefactorIndex(a, this.region, this.city).then(r => {
      // console.log(r)
      this.refreshFiltersGeoService.makeRefresh()
    })
  }

  createAttraction(a: Attraction) {
    this.attractionService.createAttraction(a, this.region, this.city).then(r => {
      // console.log(r)
      this.refreshFiltersGeoService.makeRefresh()
    })
  }


  changeRelations($event) {
    // console.log($event)
    this.city = $event.city
    this.region = $event.region
  }


  closeEdit() {
    this.emitCloseSelect.emit()
  }

}
