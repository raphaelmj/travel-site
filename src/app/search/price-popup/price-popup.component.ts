import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventElement, PriceConfigNode } from 'src/app/models/event-element';

@Component({
  selector: 'app-price-popup',
  templateUrl: './price-popup.component.html',
  styleUrls: ['./price-popup.component.less']
})
export class PricePopupComponent implements OnInit {

  @Input() eventElement: EventElement;
  @Output() emitClose: EventEmitter<boolean> = new EventEmitter()
  priceConfigGroup: any = []

  constructor() { }

  ngOnInit() {
    this.makePriceIfExists()
  }

  makePriceIfExists() {
    if (this.eventElement.priceConfig) {
      if (this.eventElement.priceConfig.length > 0) {
        this.eventElement.priceConfig.map(pc => {
          var days = this.findDays(pc.prices)
          var daysGroups = []
          days.map(d => {
            daysGroups.push({ days: d, data: this.findDayData(d, pc.prices) })
          })
          this.priceConfigGroup.push({
            groupName: pc.groupName,
            groupDesc: pc.groupDesc,
            daysGroups
          })
        })
      }
    }
  }

  findDayData(d: number | string, nodes: PriceConfigNode[]) {
    var data = []
    nodes.map(el => {
      if (el.days == d) {
        data.push({
          from: el.from,
          to: el.to,
          price: el.price
        })
      }
    })
    return data;
  }

  findDays(nodes: PriceConfigNode[]) {
    var days: Array<number | string> = []
    nodes.map(el => {

      var bool = true;

      days.map(d => {
        if (d == el.days) {
          bool = false;
        }
      })

      if (bool)
        days.push(el.days)

    })

    return days
  }

  closePopUp() {
    this.emitClose.emit(true)
  }

}
