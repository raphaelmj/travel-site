import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';


@Component({
  selector: 'upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.less']
})
export class UploadImageComponent implements OnInit, OnChanges {


  @Output() addImageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() hideCloud: EventEmitter<any> = new EventEmitter<any>();
  @Input() data;
  @Input() resizeToWidth: number = 1320
  @Input() wProp: number = 1;
  @Input() hProp: number = 1;
  @Input() maintainAspectRatio: boolean = false;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor() {
    // console.log(this.wProp)
    // this.aspectRatio = this.wProp + '/' + this.hProp;
    // console.log(this.aspectRatio)
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {

  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(image: string) {
    this.croppedImage = image;
  }
  imageLoaded() {
    // show cropper

  }
  loadImageFailed() {
    // show message
  }

  hideNotSave() {
    this.hideCloud.emit();
  }

  saveChanges() {
    let data = {
      data: this.data,
      image: this.croppedImage
    }
    this.addImageEmit.emit(data)
  }

}
