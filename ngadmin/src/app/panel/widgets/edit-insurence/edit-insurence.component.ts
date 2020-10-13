import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Widget, WidgetInsuranceData } from 'src/app/models/widget';
import { FormGroup, FormBuilder } from '@angular/forms';
import { WidgetService } from 'src/app/services/wigdets/widget.service';
import { RefreshWidgetsService } from 'src/app/services/refresh-widgets.service';

@Component({
  selector: 'app-edit-insurence',
  templateUrl: './edit-insurence.component.html',
  styleUrls: ['./edit-insurence.component.less']
})
export class EditInsurenceComponent implements OnInit {

  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Input() widget: Widget
  formEdit: FormGroup
  constructor(private fb: FormBuilder, private widgetService: WidgetService, private refreshWidgets: RefreshWidgetsService) { }

  ngOnInit() {
    this.createForm()
  }

  createForm() {
    var data: WidgetInsuranceData = <WidgetInsuranceData>this.widget.data
    this.formEdit = this.fb.group({
      topDesc: [data.topDesc],
      regDesc: [data.regDesc]
    })
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
