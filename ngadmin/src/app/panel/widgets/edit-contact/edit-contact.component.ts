import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Widget, WidgetContactData } from 'src/app/models/widget';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { CK_EDITOR_CONFIG } from 'src/app/config';
import { RefreshWidgetsService } from 'src/app/services/refresh-widgets.service';
import { WidgetService } from 'src/app/services/wigdets/widget.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.less']
})
export class EditContactComponent implements OnInit {

  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Input() widget: Widget
  formEdit: FormGroup
  ckEditorConfig: any = CK_EDITOR_CONFIG;
  constructor(private fb: FormBuilder, private widgetService: WidgetService, private refreshWidgets: RefreshWidgetsService) { }

  ngOnInit() {
    this.createForm()
    // console.log(this.formEdit.get('banks')['controls'])
  }

  createForm() {
    var data: WidgetContactData = <WidgetContactData>this.widget.data
    this.formEdit = this.fb.group({
      firmName: [data.firmName],
      address: [data.address],
      email: [data.email],
      firstPhones: this.createStringsFormArray(data.firstPhones),
      secondPhones: this.createStringsFormArray(data.secondPhones),
      banks: this.createBanksArray(data.banks)
    })
  }

  createStringsFormArray(strs: string[]): FormArray {
    var array: FormArray = this.fb.array([])
    strs.map(s => {
      array.push(new FormControl(s))
    })
    return array
  }

  createBanksArray(banks: Array<{ name: string, accounts: string[] }>): FormArray {
    var array: FormArray = this.fb.array([])
    banks.map(b => {
      array.push(this.fb.group({
        name: [b.name],
        accounts: this.createStringsFormArray(b.accounts)
      }))
    })
    return array
  }


  addFirstPhone() {
    (this.formEdit.get('firstPhones') as FormArray).push(new FormControl(''))
  }

  removeFirstPhone(i: number) {
    this.formEdit.get('firstPhones')['controls'].splice(i, 1)
    this.formEdit.get('firstPhones').value.splice(i, 1)
  }

  addSecondPhone() {
    (this.formEdit.get('secondPhones') as FormArray).push(new FormControl(''))
  }

  removeSecondPhone(i: number) {
    this.formEdit.get('secondPhones')['controls'].splice(i, 1)
    this.formEdit.get('secondPhones').value.splice(i, 1)
  }

  addBankGroup() {
    (this.formEdit.get('banks') as FormArray).push(this.fb.group({
      name: [''],
      accounts: this.createStringsFormArray([])
    }))
  }

  removeBank(i: number) {
    this.formEdit.get('banks')['controls'].splice(i, 1)
    this.formEdit.get('banks').value.splice(i, 1)
  }


  addAccount(i: number) {
    (this.formEdit.get('banks')['controls'][i].get('accounts') as FormArray).push(new FormControl(''))
  }

  removeBankAccount(i: number, j: number) {
    this.formEdit.get('banks')['controls'][i].get('accounts')['controls'].splice(j, 1)
    this.formEdit.get('banks').value[i].get('accounts').values.splice(j, 1)
  }

  closeEdit() {
    this.emitClose.emit()
  }

  saveData() {
    // console.log(this.formEdit.value)
    let widget: Widget = { ...this.widget, ...{ data: this.formEdit.value } }
    // console.log(widget)
    this.widgetService.updateWidget(widget).then(r => {
      this.refreshWidgets.makeRefresh()
    })
  }

}
