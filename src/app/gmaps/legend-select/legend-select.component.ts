import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ATTRACTIONS_TYPE, AttractionType, API_URL } from 'src/app/config';
import { MapQueryParams } from 'src/app/models/map-query-params';

@Component({
  selector: 'app-legend-select',
  templateUrl: './legend-select.component.html',
  styleUrls: ['./legend-select.component.less']
})
export class LegendSelectComponent implements OnInit, OnChanges {

  @Input() types: AttractionType[] = []
  @Input() mapQueryParams: MapQueryParams
  @Output() emitSelect: EventEmitter<AttractionType[]> = new EventEmitter()
  apiUrl: string = API_URL;

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.types) {
      this.types = changes.types.currentValue
    }
  }

  hideShow(toExcept: boolean, index: number) {
    this.types[index].selected = !toExcept
    this.emitSelect.emit(this.types)
  }

}
