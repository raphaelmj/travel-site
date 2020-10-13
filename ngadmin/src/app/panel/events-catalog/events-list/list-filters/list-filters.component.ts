import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TourEventStatus, TourEventSezonType, TourEventType, QueryParams } from 'src/app/models/query-params';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-list-filters',
  templateUrl: './list-filters.component.html',
  styleUrls: ['./list-filters.component.less']
})
export class ListFiltersComponent implements OnInit, OnChanges, OnDestroy {

  @Input() qP: QueryParams
  @Output() changeFilter: EventEmitter<{ numberPhrase: string, status: TourEventStatus, sezon: TourEventSezonType | 'all', type: TourEventType | 'all' }> = new EventEmitter()
  formFilters: FormGroup

  subChange: Subscription
  subChangeType: Subscription
  subChangeSezon: Subscription

  statuses: { value: TourEventStatus | 'all', name: string }[] = [
    {
      value: TourEventStatus.all,
      name: 'Wszystkie'
    },
    {
      value: TourEventStatus.avl,
      name: 'Dostępne'
    },
    {
      value: TourEventStatus.noavl,
      name: 'Nie dostępne'
    }
  ]

  types: { value: TourEventType | 'all', name: string }[] = [
    {
      value: 'all',
      name: 'Wszystkie'
    },
    {
      value: TourEventType.organize,
      name: 'Kolonie / Zimowiska'
    },
    {
      value: TourEventType.template,
      name: 'Katalogowe'
    }
  ]


  sezons: { value: TourEventSezonType | 'all', name: string }[] = [
    {
      value: 'all',
      name: 'Wszystkie'
    },
    {
      value: TourEventSezonType.summer,
      name: 'Kolonie'
    },
    {
      value: TourEventSezonType.winter,
      name: 'Zimowiska'
    }
  ]


  constructor(private fb: FormBuilder) { }



  ngOnInit() {
    this.createForm()
    this.changeFormSubscribe()
    this.changeTypeSubscribe()
    this.changeSezonSubscribe()
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  createForm() {
    this.formFilters = this.fb.group({
      numberPhrase: [this.qP.numberPhrase],
      status: [this.qP.status],
      sezon: [this.qP.sezon],
      type: [this.qP.type]
    })
  }


  changeFormSubscribe() {
    this.subChange = this.formFilters.valueChanges.subscribe(values => {
      // console.log('all', values)
      this.changeFilter.emit(values)
    })
  }

  changeTypeSubscribe() {
    this.subChangeType = this.formFilters.get('type').valueChanges.subscribe(value => {
      // console.log('type', value)
      if (value == TourEventType.template && this.formFilters.get('sezon').value != 'all') {
        this.formFilters.get('sezon').setValue('all')
      }
    })
  }

  changeSezonSubscribe() {
    this.subChangeSezon = this.formFilters.get('sezon').valueChanges.subscribe(value => {
      // console.log('sezon', value)
      if ((value == TourEventSezonType.winter || value == TourEventSezonType.summer) && this.formFilters.get('type').value != TourEventType.organize) {
        this.formFilters.get('type').setValue(TourEventType.organize)
      }
    })
  }


  ngOnDestroy(): void {
    if (this.subChange)
      this.subChange.unsubscribe()
  }


}
