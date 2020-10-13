import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { Widget } from 'src/app/models/widget';
import { FormGroup, FormBuilder } from '@angular/forms';
import { API_URL } from 'src/app/config';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';
import { WidgetService } from 'src/app/services/wigdets/widget.service';
import { RefreshWidgetsService } from 'src/app/services/refresh-widgets.service';

@Component({
  selector: 'app-edit-cert',
  templateUrl: './edit-cert.component.html',
  styleUrls: ['./edit-cert.component.less']
})
export class EditCertComponent implements OnInit {


  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Input() widget: Widget
  @ViewChild('imagePopup', { read: ViewContainerRef, static: true }) imagePopup: ViewContainerRef
  uploadImageC: ComponentRef<UploadImageComponent>
  formEdit: FormGroup
  croppedImage: string
  apiUrl: string = API_URL
  constructor(private fb: FormBuilder, private cf: ComponentFactoryResolver, private widgetService: WidgetService, private refreshWidgets: RefreshWidgetsService) { }

  ngOnInit() {
    this.createForm()
  }

  createForm() {
    this.formEdit = this.fb.group({

    })
  }


  backBasePhoto() {
    this.croppedImage = null
  }


  openEdit() {
    this.imagePopup.clear()
    let editImage = this.cf.resolveComponentFactory(<Type<UploadImageComponent>>UploadImageComponent)
    this.uploadImageC = this.imagePopup.createComponent(editImage)
    this.uploadImageC.instance.maintainAspectRatio = false
    this.uploadImageC.instance.resizeToWidth = null
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

  saveData() {
    // console.log(this.formEdit.value)
    let widget: Widget = { ...this.widget, ...{ data: this.formEdit.value } }
    // console.log(widget)
    this.widgetService.updateWidgetCert(widget, this.croppedImage).then(r => {
      console.log(r)
      this.refreshWidgets.makeRefresh()
    })
  }

}
