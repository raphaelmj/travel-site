import { Component, OnInit, ViewChild, ComponentRef, ViewContainerRef, EventEmitter, Input, Output, ComponentFactoryResolver, Type } from '@angular/core';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';
import { Partner } from 'src/app/models/partner';
import { FormGroup, FormBuilder } from '@angular/forms';
import { API_URL } from 'src/app/config';
import { PartnerService } from 'src/app/services/partners/partner.service';
import { RefreshPartnersService } from 'src/app/services/refresh-partners.service';

@Component({
  selector: 'app-partner-add-edit',
  templateUrl: './partner-add-edit.component.html',
  styleUrls: ['./partner-add-edit.component.less']
})
export class PartnerAddEditComponent implements OnInit {

  @ViewChild('imagePopup', { read: ViewContainerRef, static: true }) imagePopup: ViewContainerRef
  uploadImageC: ComponentRef<UploadImageComponent>

  @Input() partner: Partner
  @Input() isNew: boolean = true
  @Output() emitClose: EventEmitter<any> = new EventEmitter()

  apiUrl: string = API_URL
  partnerForm: FormGroup
  croppedImage: string = null

  constructor(
    private fb: FormBuilder,
    private cf: ComponentFactoryResolver,
    private partnerService: PartnerService,
    private refereshPartnersService: RefreshPartnersService
  ) { }

  ngOnInit() {
    this.createForm()
  }


  createForm() {
    this.partnerForm = this.fb.group({
      link: [this.partner.link]
    })
  }

  openEdit() {
    this.imagePopup.clear()
    let editImage = this.cf.resolveComponentFactory(<Type<UploadImageComponent>>UploadImageComponent)
    this.uploadImageC = this.imagePopup.createComponent(editImage)
    // this.uploadImageC.instance.wProp = 1
    // this.uploadImageC.instance.hProp = 0.8532
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


  saveData() {

    if (this.partnerForm.valid) {
      let partner: Partner = { ...this.partner, ...this.partnerForm.value }

      if (this.isNew) {
        this.createP(partner)
      } else {
        this.updateP(partner)
      }
    }
  }


  createP(partner: Partner) {
    this.partnerService.create(partner, this.croppedImage).then(r => {
      this.refereshPartnersService.makeRefresh()
      this.emitClose.emit()
    })
  }


  updateP(partner: Partner) {
    this.partnerService.update(partner, this.croppedImage).then(r => {
      this.refereshPartnersService.makeRefresh()
    })
  }


}
