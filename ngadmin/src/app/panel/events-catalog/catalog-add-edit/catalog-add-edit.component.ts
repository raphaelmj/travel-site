import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef, Output, EventEmitter, Input, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';
import { Catalog } from 'src/app/models/catalog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { API_URL } from 'src/app/config';
import { OneFileUploadService } from 'src/app/services/one-file-upload.service';
import { HttpResponse } from '@angular/common/http';
import { RefreshCatalogsService } from 'src/app/services/refresh-catalogs.service';
import { CatalogService } from 'src/app/services/events-catalog/catalog.service';

@Component({
  selector: 'app-catalog-add-edit',
  templateUrl: './catalog-add-edit.component.html',
  styleUrls: ['./catalog-add-edit.component.less']
})
export class CatalogAddEditComponent implements OnInit {

  @ViewChild('imagePopup', { read: ViewContainerRef, static: true }) imagePopup: ViewContainerRef
  uploadImageC: ComponentRef<UploadImageComponent>

  @ViewChild('filePdf', { read: ElementRef, static: true }) filePdf: ElementRef;
  @Output() emitAttachFile: EventEmitter<string> = new EventEmitter()

  @Input() catalog: Catalog
  @Input() isNew: boolean = true
  @Output() emitClose: EventEmitter<any> = new EventEmitter()

  catalogForm: FormGroup
  apiUrl: string = API_URL
  croppedImage: string = null
  attachFile: string | null = null
  isUpdate: boolean = false

  constructor(
    private fb: FormBuilder,
    private cf: ComponentFactoryResolver,
    private oneFileUploadService: OneFileUploadService,
    private catalogService: CatalogService,
    private refreshCatalogsService: RefreshCatalogsService
  ) { }

  ngOnInit() {
    this.createForm()
  }


  createForm() {
    this.catalogForm = this.fb.group({
      name: [this.catalog.name, Validators.required],
      current: [this.catalog.current],
      searchList: [this.catalog.searchList],
      attachFile: [this.catalog.attachFile]
    })
  }


  resetFile() {
    // console.log(this.catalog.attachFile)
    this.catalogForm.get('attachFile').setValue(this.catalog.attachFile)
  }


  openEdit() {
    this.imagePopup.clear()
    let editImage = this.cf.resolveComponentFactory(<Type<UploadImageComponent>>UploadImageComponent)
    this.uploadImageC = this.imagePopup.createComponent(editImage)
    // this.uploadImageC.instance.wProp = 1
    // this.uploadImageC.instance.hProp = 0.227
    this.uploadImageC.instance.maintainAspectRatio = false
    this.uploadImageC.instance.resizeToWidth = 500
    this.uploadImageC.instance.hideCloud.subscribe(d => {
      this.uploadImageC.destroy()
    })
    this.uploadImageC.instance.addImageEmit.subscribe(image => {
      this.uploadImageC.destroy()
      // console.log(image)
      this.croppedImage = image.image
    })
  }

  closeEdit() {
    this.emitClose.emit()
  }


  backBasePhoto() {
    this.croppedImage = null
  }





  handleFileInput(file: File, type: string) {
    this.oneFileUploadService.uploadFiles(file[0]).subscribe(event => {
      // console.log(event)
      if (event instanceof HttpResponse) {
        // console.log(event.body)
        if (event.body.typeFile == 'pdf') {
          this.filePdf.nativeElement.value = ''
          // console.log(event.body.file)
          this.catalogForm.get('attachFile').setValue(event.body.file)
        }

      }
    })
  }

  saveData() {

    if (this.catalogForm.valid) {

      var catalog: Catalog = { ...this.catalog, ...this.catalogForm.value }

      if (this.isNew) {
        this.createCatalog(catalog)
      } else {
        this.updateCatalog(catalog)
      }

    }

  }

  createCatalog(catalog: Catalog) {
    this.isUpdate = true
    this.catalogService.create(catalog, this.croppedImage).then(r => {
      this.isUpdate = false
      this.refreshCatalogsService.makeRefresh()
      this.emitClose.emit()
    })
  }

  updateCatalog(catalog: Catalog) {
    this.isUpdate = true
    this.catalogService.update(catalog, this.croppedImage).then(r => {
      this.isUpdate = false
      this.refreshCatalogsService.makeRefresh()
    })
  }

}
