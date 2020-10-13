import { Component, OnInit, ComponentRef, ViewChild, ViewContainerRef, Input, Output, EventEmitter, ComponentFactoryResolver, Type } from '@angular/core';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';
import { HomePage, Color } from 'src/app/models/home-page';
import { OneFileUploadService } from 'src/app/services/one-file-upload.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { API_URL } from 'src/app/config';
import { HomePageService } from 'src/app/services/home-pages/home-page.service';
import { RefreshHomePagesService } from 'src/app/services/refresh-home-pages.service';


@Component({
  selector: 'app-home-page-edit-add',
  templateUrl: './home-page-edit-add.component.html',
  styleUrls: ['./home-page-edit-add.component.less']
})
export class HomePageEditAddComponent implements OnInit {

  @ViewChild('imagePopup', { read: ViewContainerRef, static: true }) imagePopup: ViewContainerRef
  uploadImageC: ComponentRef<UploadImageComponent>

  @Input() hp: HomePage
  @Input() isNew: boolean = true
  @Output() emitClose: EventEmitter<any> = new EventEmitter()

  apiUrl: string = API_URL
  hpForm: FormGroup
  croppedImage: string = null

  colors: Array<string> = [
    Color.bordo,
    Color.granat,
    Color.green,
    Color.orange,
    Color.yellow
  ]

  targets: Array<{ name: string, value: '_blank' | '_self' }> = [
    { name: 'W tym samych oknie', value: '_self' },
    { name: 'W nowym oknie', value: '_blank' },
  ]

  constructor(
    private fb: FormBuilder,
    private cf: ComponentFactoryResolver,
    private hpService: HomePageService,
    private refreshHomePagesService: RefreshHomePagesService
  ) { }

  ngOnInit() {
    this.createForm()
  }


  createForm() {
    this.hpForm = this.fb.group({
      title: [this.hp.title],
      selfLink: [this.hp.selfLink],
      target: [this.hp.target]
    })
  }

  openEdit() {
    this.imagePopup.clear()
    let editImage = this.cf.resolveComponentFactory(<Type<UploadImageComponent>>UploadImageComponent)
    this.uploadImageC = this.imagePopup.createComponent(editImage)
    this.uploadImageC.instance.wProp = 1
    this.uploadImageC.instance.hProp = 0.8532
    this.uploadImageC.instance.maintainAspectRatio = true
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

  setColor(c: Color) {
    this.hp.color = c
  }

  saveData() {

    if (this.hpForm.valid) {
      let hp: HomePage = { ...this.hp, ...this.hpForm.value }
      console.log(hp)
      if (this.isNew) {
        this.createHp(hp)
      } else {
        this.updateHp(hp)
      }
    }
  }

  createHp(hp: HomePage) {
    this.hpService.create(hp, this.croppedImage).then(r => {
      // console.log(r)
      this.refreshHomePagesService.makeRefresh()
      this.emitClose.emit()
    })
  }

  updateHp(hp: HomePage) {
    this.hpService.update(hp, this.croppedImage).then(r => {
      // console.log(r)
      this.refreshHomePagesService.makeRefresh()
    })
  }

}
