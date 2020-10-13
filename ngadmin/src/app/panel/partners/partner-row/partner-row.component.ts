import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Partner } from 'src/app/models/partner';
import { API_URL } from 'src/app/config';

@Component({
  selector: 'app-partner-row',
  templateUrl: './partner-row.component.html',
  styleUrls: ['./partner-row.component.less']
})
export class PartnerRowComponent implements OnInit {

  @Input() partner: Partner
  @Output() editStart: EventEmitter<Partner> = new EventEmitter<Partner>()
  @Output() deleteStart: EventEmitter<Partner> = new EventEmitter<Partner>()

  apiUrl: string = API_URL

  constructor() { }

  ngOnInit() {
  }

  openEdit() {
    this.editStart.emit(this.partner)
  }

  deletePartner() {
    this.deleteStart.emit(this.partner)
  }


}
