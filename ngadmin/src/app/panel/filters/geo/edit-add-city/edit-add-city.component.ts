import { Component, OnInit, Input, EventEmitter, ViewContainerRef, ViewChild, Output, ComponentFactoryResolver, AfterViewInit, ComponentRef, Type } from '@angular/core';
import { City } from 'src/app/models/city';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CityService } from 'src/app/services/filters/city.service';
import { Region } from 'src/app/models/region';
import { RefreshFiltersGeoService } from 'src/app/services/refresh-filters-geo.service';

@Component({
  selector: 'app-edit-add-city',
  templateUrl: './edit-add-city.component.html',
  styleUrls: ['./edit-add-city.component.less']
})
export class EditAddCityComponent implements OnInit, AfterViewInit {


  @Input() editTitle: string = ""
  @Input() isNew: boolean = true
  @Input() city: City
  @Input() region: Region
  @Input() regions: Region[]
  @Output() emitCloseSelect: EventEmitter<any> = new EventEmitter()
  @ViewChild('changeDep', { read: ViewContainerRef, static: true }) cD: ViewContainerRef
  editForm: FormGroup


  constructor(
    private fb: FormBuilder,
    private cf: ComponentFactoryResolver,
    private cityService: CityService,
    private refreshFiltersGeoService: RefreshFiltersGeoService) { }

  ngOnInit() {
    // console.log(this.region)
    this.editForm = this.createForm()
  }

  ngAfterViewInit(): void {
    if (!this.isNew) {
      this.showDepC()
    }
  }

  closeEdit() {
    this.emitCloseSelect.emit()
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: [this.city.name, Validators.required],
      lat: [this.city.lat, Validators.required],
      lng: [this.city.lng, Validators.required],
      region: [this.region.id]
    })
  }

  saveData() {

    if (this.editForm.valid) {
      var c: City = { ...this.city, ...this.editForm.value };
      if (this.isNew) {
        this.createCity(c)
      } else {
        this.updateCity(c)
      }
    }
  }

  updateCity(c: City) {
    this.cityService.updateCityNameReafactorIndex(c, this.editForm.get('region').value).then(r => {
      // console.log(r)
      this.refreshFiltersGeoService.makeRefresh()
    })
  }

  createCity(c: City) {
    this.cityService.createCity(c, this.editForm.get('region').value).then(r => {
      // console.log(r)
      this.refreshFiltersGeoService.makeRefresh()
    })
  }



  showDepC() {

  }

}
