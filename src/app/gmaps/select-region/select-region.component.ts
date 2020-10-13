import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Region } from 'src/app/models/region';

@Component({
  selector: 'app-select-region',
  templateUrl: './select-region.component.html',
  styleUrls: ['./select-region.component.less']
})
export class SelectRegionComponent implements OnInit, OnChanges {

  @Input() regions: Region[];
  @Input() selectedRegion: Region
  regionName: string = ''
  isSelectOpen: boolean = false;
  @Output() emitRegionChange: EventEmitter<Region> = new EventEmitter()

  constructor() { }

  ngOnInit() {
    if (this.selectedRegion) {
      this.regionName = this.selectedRegion.name
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes)
    if (changes.selectedRegion.firstChange) {
      this.selectedRegion = null
      this.regionName = ''
    }
  }

  resetRegion() {
    this.selectedRegion = null
    this.regionName = ''
  }

  openCloseSelect() {
    this.isSelectOpen = (this.isSelectOpen) ? false : true
  }

  selectRegion(r: Region) {
    this.selectedRegion = r
    this.regionName = r.name;
    this.isSelectOpen = false
    this.emitRegionChange.emit(r)
  }

}
