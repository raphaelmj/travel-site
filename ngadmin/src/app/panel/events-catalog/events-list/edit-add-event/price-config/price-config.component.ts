import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { PriceConfig, PricePerDays } from 'src/app/models/tour-event';

@Component({
  selector: 'app-price-config',
  templateUrl: './price-config.component.html',
  styleUrls: ['./price-config.component.less']
})
export class PriceConfigComponent implements OnInit {

  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Output() emitPrice: EventEmitter<PriceConfig[]> = new EventEmitter()
  @Input() priceConfig: PriceConfig[]
  formPrice: FormGroup

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm()
    this.subscribeToChange()
  }

  createForm() {
    this.formPrice = this.fb.group({
      priceConfig: this.createPriceGroupsArray()
    })
  }

  createPriceGroupsArray(): FormArray {
    var arr: FormArray = this.fb.array([])
    if (this.priceConfig) {
      this.priceConfig.map(el => {
        arr.push(this.fb.group({
          groupName: [el.groupName],
          groupDesc: [el.groupDesc],
          prices: this.createPricesArray(el.prices)
        }))
      })
    }
    return arr
  }

  createPriceGroupsEmpty(): FormGroup {
    var formG: FormGroup = this.fb.group({
      groupName: [''],
      groupDesc: [''],
      prices: this.fb.array([])
    })
    return formG
  }

  createPricesArray(ppds: PricePerDays[]): FormArray {
    var arr: FormArray = this.fb.array([])
    if (ppds) {
      ppds.map(pd => {
        arr.push(this.fb.group({
          from: [pd.from],
          to: [pd.to],
          price: [pd.price],
          days: [pd.days]
        }))
      })
    }
    return arr
  }


  createPricesGroupEmpty(): FormGroup {
    return this.fb.group({
      from: [0],
      to: [0],
      price: [0.00],
      days: [0]
    })
  }

  addGroup() {
    (this.formPrice.get('priceConfig') as FormArray).push(this.createPriceGroupsEmpty())
    this.toParentPrice()
  }

  removeGroup(i: number) {
    this.formPrice.get('priceConfig')['controls'].splice(i, 1)
    this.formPrice.get('priceConfig').value.splice(i, 1)
    this.toParentPrice()
  }

  addGroupPrice(i: number) {
    (this.formPrice.get('priceConfig')['controls'][i].get('prices') as FormArray).push(this.createPricesGroupEmpty())
    this.toParentPrice()
  }

  removeGroupPrice(i: number, j: number) {
    this.formPrice.get('priceConfig')['controls'][i].get('prices')['controls'].splice(j, 1)
    this.formPrice.get('priceConfig')['controls'][i].get('prices').value.splice(j, 1)
    this.toParentPrice()
  }

  toParentPrice() {
    this.emitPrice.emit(this.formPrice.get('priceConfig').value)
  }


  subscribeToChange() {
    this.formPrice.get('priceConfig').valueChanges.subscribe(d => {
      // console.log(d)
      this.toParentPrice()
    })
  }


  closeEdit() {
    this.emitClose.emit()
  }

}
