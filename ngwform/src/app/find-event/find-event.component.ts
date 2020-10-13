import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { EventIndexElement } from '../models/event-element';

@Component({
  selector: 'app-find-event',
  templateUrl: './find-event.component.html',
  styleUrls: ['./find-event.component.less']
})
export class FindEventComponent implements OnInit {

  @Input() events: EventIndexElement[] = []
  @Input() isCloudShow: boolean = false;
  @Input() isSetOn: boolean = false;
  @Output() emitSet: EventEmitter<EventIndexElement> = new EventEmitter<EventIndexElement>()

  constructor() { }

  ngOnInit() {
  }

  setEventNumber(ev: EventIndexElement) {
    this.emitSet.emit(ev)
  }

}
