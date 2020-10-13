import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocQueryParams } from 'src/app/models/doc-query-params';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DocFormType } from 'src/app/models/doc';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-docs-filters',
  templateUrl: './docs-filters.component.html',
  styleUrls: ['./docs-filters.component.less']
})
export class DocsFiltersComponent implements OnInit {

  @Input() dQP: DocQueryParams
  @Output() emitChange: EventEmitter<{ phrase: string, type: 'all' | DocFormType }> = new EventEmitter<{ phrase: string, type: 'all' | DocFormType }>()
  formFilters: FormGroup
  subChanges: Subscription

  types: Array<{ name: string, value: 'all' | DocFormType }> = [
    {
      name: 'Wszystkie',
      value: 'all'
    },
    {
      name: 'Ubezpieczenia',
      value: DocFormType.insurance
    },
    {
      name: 'Faktury',
      value: DocFormType.invoice
    },
    {
      name: 'Zapytania',
      value: DocFormType.question
    }
  ]

  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
    this.createForm()
    this.subscribeToChanges()
  }

  subscribeToChanges() {
    this.subChanges = this.formFilters.valueChanges.subscribe(f => {
      this.emitChange.emit(this.formFilters.value)
    })
  }

  createForm() {
    this.formFilters = this.fb.group({
      phrase: [this.dQP.phrase],
      type: [this.dQP.type]
    })
  }

}
