import { Component, OnInit, ViewChild, ViewContainerRef, EventEmitter, Output, Input, ComponentRef, ComponentFactoryResolver, Type, ElementRef } from '@angular/core';
import { Recommendation } from 'src/app/models/recommendation';
import { FormGroup, FormBuilder } from '@angular/forms';
import { API_URL } from 'src/app/config';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';
import { RefreshRecommendationsService } from 'src/app/services/refresh-recommendations.service';
import { RecommendationService } from 'src/app/services/recommendations/recommendation.service';
import { HttpResponse } from '@angular/common/http';
import { OneFileUploadService } from 'src/app/services/one-file-upload.service';

@Component({
  selector: 'app-recommendation-edit-add',
  templateUrl: './recommendation-edit-add.component.html',
  styleUrls: ['./recommendation-edit-add.component.less']
})
export class RecommendationEditAddComponent implements OnInit {

  @ViewChild('imagePopup', { read: ViewContainerRef, static: true }) imagePopup: ViewContainerRef
  uploadImageC: ComponentRef<UploadImageComponent>

  @ViewChild('filePdf', { read: ElementRef, static: true }) filePdf: ElementRef;
  @Output() emitAttachFile: EventEmitter<string> = new EventEmitter()

  @Input() reco: Recommendation
  @Input() isNew: boolean = true
  @Output() emitClose: EventEmitter<any> = new EventEmitter()

  recoForm: FormGroup
  apiUrl: string = API_URL
  croppedImage: string = null
  attachFile: string | null = null


  constructor(
    private fb: FormBuilder,
    private cf: ComponentFactoryResolver,
    private recoService: RecommendationService,
    private refreshRecommendationsService: RefreshRecommendationsService,
    private oneFileUploadService: OneFileUploadService
  ) { }

  ngOnInit() {
    this.attachFile = this.reco.file
    this.createForm()
  }


  createForm() {
    this.recoForm = this.fb.group({
      name: [this.reco.name],
      status: [this.reco.status]
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
    this.attachFile = this.reco.file
  }

  closeEdit() {
    this.emitClose.emit()
  }

  handleFileInput(file: File, type: string) {
    this.oneFileUploadService.uploadFiles(file[0]).subscribe(event => {
      // console.log(event)
      if (event instanceof HttpResponse) {
        // console.log(event.body)
        if (event.body.typeFile == 'pdf') {
          this.filePdf.nativeElement.value = ''
          // console.log(event.body.file)
          this.attachFile = event.body.file
        }

      }
    })
  }

  saveData() {
    if (this.recoForm.valid) {
      this.reco.file = this.attachFile
      var reco: Recommendation = { ...this.reco, ...this.recoForm.value }
      if (this.isNew) {
        this.createReco(reco)
      } else {
        this.updateReco(reco)
      }
    }
  }


  createReco(reco: Recommendation) {
    this.recoService.create(reco, this.croppedImage).then(r => {
      this.refreshRecommendationsService.makeRefresh()
    })
  }

  updateReco(reco: Recommendation) {
    this.recoService.update(reco, this.croppedImage).then(r => {
      this.refreshRecommendationsService.makeRefresh()
    })
  }

}
