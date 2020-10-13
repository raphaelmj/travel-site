import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ATTRACTIONS_TYPE, AttractionType, API_URL } from '../../config';
import { Attraction } from '../../models/attraction';

@Component({
  selector: 'app-legend-select',
  templateUrl: './legend-select.component.html',
  styleUrls: ['./legend-select.component.less']
})
export class LegendSelectComponent implements OnInit {

  @Input() types: AttractionType[] = []
  @Input() attractions: Attraction[] = []
  @Output() emitSelect: EventEmitter<AttractionType[]> = new EventEmitter()
  apiUrl: string = API_URL;

  constructor() { }

  ngOnInit() {

  }


  hideShow(toExcept: boolean, index: number) {
    this.types[index].selected = !toExcept
    this.emitSelect.emit(this.types)
  }

  checkIsTypeAttractionInCollection(attractionType: AttractionType) {
    var bool = false;
    this.attractions.map(a => {
      if (a.attractionType == attractionType.type) {
        bool = true;
      }
    })
    return bool;
  }

}
