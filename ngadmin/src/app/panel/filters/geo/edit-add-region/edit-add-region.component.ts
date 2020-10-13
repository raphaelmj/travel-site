import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit, ViewContainerRef, ComponentRef, ViewChild, ComponentFactoryResolver, Type } from '@angular/core';
import { Region } from 'src/app/models/region';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RegionService } from 'src/app/services/filters/region.service';
import { RefreshFiltersGeoService } from 'src/app/services/refresh-filters-geo.service';

@Component({
  selector: 'app-edit-add-region',
  templateUrl: './edit-add-region.component.html',
  styleUrls: ['./edit-add-region.component.less']
})
export class EditAddRegionComponent implements OnInit, AfterViewInit {


  @Input() editTitle: string = ""
  @Input() isNew: boolean = true
  @Input() region: Region
  @Output() emitCloseSelect: EventEmitter<any> = new EventEmitter()
  @ViewChild('changeDep', { read: ViewContainerRef, static: true }) cD: ViewContainerRef
  editForm: FormGroup


  constructor(
    private fb: FormBuilder,
    private cf: ComponentFactoryResolver,
    private regionService: RegionService,
    private refreshFiltersGeoService: RefreshFiltersGeoService) { }

  ngOnInit() {
    // console.log(this.region)
    this.editForm = this.createForm()
  }

  ngAfterViewInit(): void {

  }

  closeEdit() {
    this.emitCloseSelect.emit()
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: [this.region.name],
      lat: [this.region.lat],
      lng: [this.region.lng]
    })
  }

  saveData() {
    // console.log(this.editForm.value)
    if (this.isNew) {
      this.createRegion()
    } else {
      this.updateRegion()
    }
  }

  createRegion() {
    let r: Region = this.editForm.value
    this.regionService.createRegion(r).then(rs => {
      // console.log(r)
      this.refreshFiltersGeoService.makeRefresh()
    })
  }

  updateRegion() {
    let r: Region = { ...this.region, ...this.editForm.value }
    this.regionService.updateRegion(r).then(rs => {
      // console.log(rs)
      this.refreshFiltersGeoService.makeRefresh()
    })
  }


}
