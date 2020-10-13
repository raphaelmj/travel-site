import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { TourEvent } from 'src/app/models/tour-event';
import { API_URL } from 'src/app/config';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/events-catalog/event.service';
import { TourEventStatus } from 'src/app/models/query-params';

@Component({
  selector: 'app-event-row',
  templateUrl: './event-row.component.html',
  styleUrls: ['./event-row.component.less']
})
export class EventRowComponent implements OnInit, OnDestroy {

  @Input() event: TourEvent
  @Output() editEvent: EventEmitter<TourEvent> = new EventEmitter()
  formRow: FormGroup
  apiUrl: string = API_URL

  subStatusChange: Subscription
  subSezonChange: Subscription

  constructor(private fb: FormBuilder, private eventService: EventService) { }

  ngOnInit() {
    this.createForm()
    this.subscribeToStatus()
    this.subscribeToSezon()
  }

  createForm() {
    this.formRow = this.fb.group({
      status: [(this.event.status == 'avl') ? true : false],
      atSezon: this.event.atSezon
    })
  }

  subscribeToStatus() {
    this.subStatusChange = this.formRow.get('status').valueChanges.subscribe(v => {
      // console.log(v)
      var status = TourEventStatus.noavl
      if (v) {
        status = TourEventStatus.avl
      }
      this.eventService.changeField(status, 'status', this.event.id).then(r => {
        console.log(r)
      })
    })
  }

  subscribeToSezon() {
    this.subSezonChange = this.formRow.get('atSezon').valueChanges.subscribe(v => {
      // console.log(v)

      this.eventService.changeField(v, 'atSezon', this.event.id).then(r => {
        console.log(r)
      })
    })
  }

  ngOnDestroy(): void {
    if (this.subStatusChange)
      this.subStatusChange.unsubscribe()
  }

  startEditEvent() {
    this.editEvent.emit(this.event)
  }



}
