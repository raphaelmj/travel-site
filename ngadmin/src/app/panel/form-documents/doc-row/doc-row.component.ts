import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { Doc } from 'src/app/models/doc';
import { API_URL } from 'src/app/config';
import { ViewNoticeComponent } from './view-notice/view-notice.component';
import * as _moment from 'moment'

@Component({
  selector: 'app-doc-row',
  templateUrl: './doc-row.component.html',
  styleUrls: ['./doc-row.component.less']
})
export class DocRowComponent implements OnInit {

  @ViewChild('infoTemp', { read: ViewContainerRef, static: true }) infoTemp: ViewContainerRef
  viewNoticeC: ComponentRef<ViewNoticeComponent>
  @Input() doc: Doc
  uplaodDateString: string = ''
  apiUrl: string = API_URL
  noticeOpen: boolean = false

  constructor(private cf: ComponentFactoryResolver) { }

  ngOnInit() {
    var d = Date.parse(this.doc.uploadAt)
    // var date: Date = new Date(d)
    this.uplaodDateString = _moment(d).format('DD-MM-YYYY')
  }


  showNotice() {

    this.infoTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<ViewNoticeComponent>>ViewNoticeComponent)
    this.viewNoticeC = this.infoTemp.createComponent(edit)
    this.viewNoticeC.instance.type = this.doc.type
    this.viewNoticeC.instance.data = this.doc.noticeInfo
    this.noticeOpen = true

  }

  hideNotice() {
    if (this.viewNoticeC)
      this.viewNoticeC.destroy()
    this.infoTemp.clear()
    this.noticeOpen = false
  }

}
