import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, Input, Output, EventEmitter, ComponentFactoryResolver, Type, ElementRef } from '@angular/core';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';
import { Promo } from 'src/app/models/promo';
import { FormGroup, FormBuilder } from '@angular/forms';
import { API_URL } from 'src/app/config';
import { HttpResponse } from '@angular/common/http';
import { OneFileUploadService } from 'src/app/services/one-file-upload.service';
import { RefreshPromosService } from 'src/app/services/refresh-promos.service';
import { PromoService } from 'src/app/services/promos/promo.service';

@Component({
  selector: 'app-promo-edit-add',
  templateUrl: './promo-edit-add.component.html',
  styleUrls: ['./promo-edit-add.component.less']
})
export class PromoEditAddComponent implements OnInit {

  @ViewChild('imagePopup', { read: ViewContainerRef, static: true }) imagePopup: ViewContainerRef
  uploadImageC: ComponentRef<UploadImageComponent>

  @ViewChild('filePdf', { read: ElementRef, static: true }) filePdf: ElementRef;
  @Output() emitAttachFile: EventEmitter<string> = new EventEmitter()

  @Input() promo: Promo
  @Input() isNew: boolean = true
  @Output() emitClose: EventEmitter<any> = new EventEmitter()

  uploading: boolean = false
  promoForm: FormGroup
  apiUrl: string = API_URL
  croppedImage: string = null
  attachFile: string | null = null

  constructor(
    private fb: FormBuilder,
    private cf: ComponentFactoryResolver,
    private oneFileUploadService: OneFileUploadService,
    private promoService: PromoService,
    private refreshPromosService: RefreshPromosService) { }

  ngOnInit() {
    this.attachFile = this.promo.attachFile
    this.createForm()
  }


  createForm() {
    this.promoForm = this.fb.group({
      title: [this.promo.title],
      status: [this.promo.status]
    })
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

  backBasePhoto() {
    this.croppedImage = null
  }

  resetFile() {
    this.attachFile = this.promo.attachFile
  }

  closeEdit() {
    this.emitClose.emit()
  }


  handleFileInput(file: File, type: string) {
    this.uploading = true
    this.oneFileUploadService.uploadFiles(file[0]).subscribe(event => {
      // console.log(event)
      if (event instanceof HttpResponse) {
        // console.log(event.body)
        if (event.body.typeFile == 'pdf') {
          this.filePdf.nativeElement.value = ''
          // console.log(event.body.file)
          this.attachFile = event.body.file
          this.uploading = false
        }

      }
    })
  }


  saveData() {
    if (this.promoForm.valid) {
      this.promo.attachFile = this.attachFile
      var promo: Promo = { ...this.promo, ...this.promoForm.value }

      if (this.isNew) {
        this.createPromo(promo)
      } else {
        this.updatePromo(promo)
      }

    }

  }


  createPromo(promo: Promo) {
    this.promoService.create(promo, this.croppedImage).then(r => {
      this.refreshPromosService.makeRefresh()
    })
  }

  updatePromo(promo: Promo) {
    this.promoService.update(promo, this.croppedImage).then(r => {
      this.refreshPromosService.makeRefresh()
    })
  }

}
