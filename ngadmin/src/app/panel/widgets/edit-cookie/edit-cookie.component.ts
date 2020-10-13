import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Widget, WidgetCookieData } from 'src/app/models/widget';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CK_EDITOR_CONFIG } from 'src/app/config';
import { WidgetService } from 'src/app/services/wigdets/widget.service';
import { RefreshWidgetsService } from 'src/app/services/refresh-widgets.service';

@Component({
  selector: 'app-edit-cookie',
  templateUrl: './edit-cookie.component.html',
  styleUrls: ['./edit-cookie.component.less']
})
export class EditCookieComponent implements OnInit {

  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Input() widget: Widget
  formEdit: FormGroup
  ckEditorConfig: any = CK_EDITOR_CONFIG;

  constructor(private fb: FormBuilder, private widgetService: WidgetService, private refreshWidgets: RefreshWidgetsService) { }

  ngOnInit() {
    this.createForm()
  }

  createForm() {
    var data: WidgetCookieData = <WidgetCookieData>this.widget.data
    this.formEdit = this.fb.group({
      content: [data.content]
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
