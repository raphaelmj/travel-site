import { Component, OnInit, Input } from '@angular/core';
import { InvoiceData, InsuranceData, DocFormType } from 'src/app/models/doc';

@Component({
  selector: 'app-view-notice',
  templateUrl: './view-notice.component.html',
  styleUrls: ['./view-notice.component.less']
})
export class ViewNoticeComponent implements OnInit {

  @Input() data: InsuranceData | InvoiceData
  @Input() type: DocFormType

  constructor() { }

  ngOnInit() {
  }

}
