import { Component, OnInit, Input, ComponentFactoryResolver, ViewContainerRef, ViewChild, ComponentRef, Type } from '@angular/core';
import { Slide } from 'src/app/models/slide';
import { API_URL } from 'src/app/config';
import { SlideEditAddComponent } from '../slide-edit-add/slide-edit-add.component';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';
import { SlideService } from 'src/app/services/slide/slide.service';
import { RefreshSlidesService } from 'src/app/services/refresh-slides.service';

@Component({
  selector: 'app-slide-row',
  templateUrl: './slide-row.component.html',
  styleUrls: ['./slide-row.component.less']
})
export class SlideRowComponent implements OnInit {

  @ViewChild('editTemp', { read: ViewContainerRef, static: true }) editTemp: ViewContainerRef
  editAddC: ComponentRef<SlideEditAddComponent>
  @ViewChild('remove', { read: ViewContainerRef, static: true }) removeTemp: ViewContainerRef;
  confirmC: ComponentRef<ConfirmWindowComponent>

  @Input() slide: Slide
  apiUrl: string = API_URL

  constructor(private cf: ComponentFactoryResolver, private slideService: SlideService, private refreshSlidesService: RefreshSlidesService) { }

  ngOnInit() {
  }


  editSlide() {
    let edit = this.cf.resolveComponentFactory(<Type<SlideEditAddComponent>>SlideEditAddComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = false
    this.editAddC.instance.slide = this.slide
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })
  }


  beforeRemoveSlide() {
    this.removeTemp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.removeTemp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = this.slide.id
    this.confirmC.instance.message = 'Czy checesz usunąć slajd?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {
      // console.log(r)
      if (r.do) {
        this.confirmC.destroy()
        this.deleteSlide(r.bundleData)
      } else {
        this.confirmC.destroy()
      }
    })
  }


  deleteSlide(id: number) {
    this.slideService.removeSlide(id).then(r => {
      this.refreshSlidesService.makeRefresh()
    })
  }

  changeStatus(status: boolean) {
    this.slideService.changeStatus(this.slide.id, status).then(s => {
      this.refreshSlidesService.makeRefresh()
    })
  }

}
