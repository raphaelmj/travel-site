import { Component, OnInit, Input } from '@angular/core';
import { PriceConfig, PricePerDays } from 'src/app/models/tour-event';

@Component({
  selector: 'app-price-preview',
  templateUrl: './price-preview.component.html',
  styleUrls: ['./price-preview.component.less']
})
export class PricePreviewComponent implements OnInit {

  @Input() priceConfig: PriceConfig[] = []
  priceConfigGroup: any[] = []
  constructor() { }

  ngOnInit() {
    this.makePriceIfExists()
  }


  makePriceIfExists() {
    if (this.priceConfig) {
      if (this.priceConfig.length > 0) {
        this.priceConfig.map(pc => {
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

  findDayData(d: number | string, nodes: PricePerDays[]) {
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

  findDays(nodes: PricePerDays[]) {
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

}
