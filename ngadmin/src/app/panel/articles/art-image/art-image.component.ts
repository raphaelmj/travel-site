import { Component, OnInit, Output, Input, ViewChild, ComponentRef, ViewContainerRef, ComponentFactoryResolver, Type, EventEmitter } from '@angular/core';

import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';
import { API_URL } from 'src/app/config';

@Component({
  selector: 'app-art-image',
  templateUrl: './art-image.component.html',
  styleUrls: ['./art-image.component.less']
})
export class ArtImageComponent implements OnInit {

  @Input() image: string
  @Output() emitImageChange: EventEmitter<string> = new EventEmitter()
  @ViewChild('imagePopup', { read: ViewContainerRef, static: true }) imagePopup: ViewContainerRef
  uploadImageC: ComponentRef<UploadImageComponent>
  imageContent: string = null
  apiUrl: string = API_URL
  croppedImage: string = null

  constructor(private fc: ComponentFactoryResolver) { }

  ngOnInit() {

  }

  openEdit() {
    this.imagePopup.clear()
    let editImage = this.fc.resolveComponentFactory(<Type<UploadImageComponent>>UploadImageComponent)
    this.uploadImageC = this.imagePopup.createComponent(editImage)
    this.uploadImageC.instance.wProp = 1
    this.uploadImageC.instance.hProp = 1
    this.uploadImageC.instance.maintainAspectRatio = true
    this.uploadImageC.instance.resizeToWidth = 1600
    this.uploadImageC.instance.hideCloud.subscribe(d => {
      this.uploadImageC.destroy()
    })
    this.uploadImageC.instance.addImageEmit.subscribe(image => {
      this.uploadImageC.destroy()
      // console.log(image)
      this.croppedImage = image.image
      this.emitImageChange.emit(this.croppedImage)
    })
  }

  backBasePhoto() {
    this.croppedImage = null
    this.emitImageChange.emit(this.croppedImage)
  }

}
