import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { Slide } from 'src/app/models/slide';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';
import { API_URL } from 'src/app/config';
import { SlideService } from 'src/app/services/slide/slide.service';
import { RefreshSlidesService } from 'src/app/services/refresh-slides.service';

@Component({
  selector: 'app-slide-edit-add',
  templateUrl: './slide-edit-add.component.html',
  styleUrls: ['./slide-edit-add.component.less']
})
export class SlideEditAddComponent implements OnInit {

  @ViewChild('imagePopup', { read: ViewContainerRef, static: true }) imagePopup: ViewContainerRef
  uploadImageC: ComponentRef<UploadImageComponent>

  @Input() slide: Slide
  @Input() isNew: boolean = true
  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  slideForm: FormGroup
  apiUrl: string = API_URL
  croppedImage: string = null

  targets: Array<{ name: string, value: '_blank' | '_self' }> = [
    { name: 'W tym samych oknie', value: '_self' },
    { name: 'W nowym oknie', value: '_blank' },
  ]

  constructor(private fb: FormBuilder, private cf: ComponentFactoryResolver, private slideService: SlideService, private refreshSlidesService: RefreshSlidesService) { }

  ngOnInit() {
    this.createForm()
  }

  createForm() {
    this.slideForm = this.fb.group({
      title: [this.slide.title],
      subTitle: [this.slide.subTitle],
      linkTitle: [this.slide.linkTitle],
      link: [this.slide.link],
      target: [this.slide.target],
      status: [this.slide.status]
    })
  }

  closeEdit() {
    this.emitClose.emit()
  }

  openEdit() {
    this.imagePopup.clear()
    let editImage = this.cf.resolveComponentFactory(<Type<UploadImageComponent>>UploadImageComponent)
    this.uploadImageC = this.imagePopup.createComponent(editImage)
    this.uploadImageC.instance.wProp = 1
    this.uploadImageC.instance.hProp = 0.227
    this.uploadImageC.instance.maintainAspectRatio = true
    this.uploadImageC.instance.resizeToWidth = 1920
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


  saveData() {

    if (this.slideForm.valid) {
      var slide: Slide = { ...this.slide, ...this.slideForm.value }

      if (this.isNew) {
        this.createSlide(slide)
      } else {
        this.updateSlide(slide)
      }

    }
  }

  updateSlide(slide: Slide) {
    this.slideService.updateSlide(slide, this.croppedImage).then(r => {
      this.refreshSlidesService.makeRefresh()
    })
  }

  createSlide(slide: Slide) {
    this.slideService.createSlide(slide, this.croppedImage).then(r => {
      this.refreshSlidesService.makeRefresh()
      this.emitClose.emit()
    })
  }

}
