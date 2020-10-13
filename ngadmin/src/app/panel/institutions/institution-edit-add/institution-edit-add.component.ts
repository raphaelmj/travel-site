import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef, ComponentRef, EventEmitter, Output, Input, Type } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';
import { API_URL, CK_EDITOR_CONFIG } from 'src/app/config';
import { Institution } from 'src/app/models/institution';
import { InstitutionService } from 'src/app/services/institution/institution.service';
import { RefreshInstService } from 'src/app/services/refresh-inst.service';

@Component({
  selector: 'app-institution-edit-add',
  templateUrl: './institution-edit-add.component.html',
  styleUrls: ['./institution-edit-add.component.less']
})
export class InstitutionEditAddComponent implements OnInit {

  @ViewChild('imagePopup', { read: ViewContainerRef, static: true }) imagePopup: ViewContainerRef
  uploadImageC: ComponentRef<UploadImageComponent>

  @Input() inst: Institution
  @Input() isNew: boolean = true
  @Output() emitClose: EventEmitter<any> = new EventEmitter()

  instForm: FormGroup
  apiUrl: string = API_URL
  croppedImage: string = null
  ckEditorConfig: any = CK_EDITOR_CONFIG;

  constructor(
    private fb: FormBuilder,
    private cf: ComponentFactoryResolver,
    private institutionService: InstitutionService,
    private refreshInstService: RefreshInstService
  ) { }

  ngOnInit() {
    this.createForm()
  }

  createForm() {
    this.instForm = this.fb.group({
      name: [this.inst.name],
      status: [this.inst.status],
      tourTarget: [this.inst.tourTarget],
      description: [this.inst.description]
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

  closeEdit() {
    this.emitClose.emit()
  }

  saveData() {
    if (this.instForm.valid) {
      var inst: Institution = { ...this.inst, ...this.instForm.value }
      if (this.isNew) {
        this.createInst(inst)
      } else {
        this.updateInst(inst)
      }
    }
  }


  createInst(inst: Institution) {
    this.institutionService.create(inst, this.croppedImage).then(r => {
      this.refreshInstService.makeRefresh()
      this.emitClose.emit()
    })
  }

  updateInst(inst: Institution) {
    this.institutionService.update(inst, this.croppedImage).then(r => {
      this.refreshInstService.makeRefresh()
    })
  }

}
