import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Day } from 'src/app/models/day';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DaysService } from 'src/app/services/filters/days.service';
import { RefreshDaysService } from 'src/app/services/refresh-days.service';

@Component({
  selector: 'app-edit-add-day',
  templateUrl: './edit-add-day.component.html',
  styleUrls: ['./edit-add-day.component.less']
})
export class EditAddDayComponent implements OnInit {

  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Input() day: Day
  @Input() isNew: boolean = true
  editForm: FormGroup

  constructor(private fb: FormBuilder, private daysService: DaysService, private refreshDaysService: RefreshDaysService) { }

  ngOnInit() {
    this.editForm = this.createForm()
  }

  createForm(): FormGroup {
    return this.fb.group({
      daysNumber: [this.day.daysNumber, Validators.required],
    })
  }

  closeEdit() {
    this.emitClose.emit()
  }


  saveData() {
    var d: Day = { ...this.day, ...this.editForm.value }
    if (this.isNew) {
      this.daysService.createNew(d).then(r => {
        this.refreshDaysService.makeRefresh()
        this.emitClose.emit()
      })
    } else {
      this.daysService.updateOne(d).then(r => {
        this.refreshDaysService.makeRefresh()
      })
    }
  }


}
