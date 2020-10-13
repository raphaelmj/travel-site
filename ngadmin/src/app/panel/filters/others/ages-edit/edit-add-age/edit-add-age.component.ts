import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Age } from 'src/app/models/age';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AgeService } from 'src/app/services/filters/age.service';
import { RefreshAgesService } from 'src/app/services/refresh-ages.service';

@Component({
  selector: 'app-edit-add-age',
  templateUrl: './edit-add-age.component.html',
  styleUrls: ['./edit-add-age.component.less']
})
export class EditAddAgeComponent implements OnInit {


  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Input() age: Age
  @Input() isNew: boolean = true
  editForm: FormGroup

  constructor(private fb: FormBuilder, private agesService: AgeService, private refreshAgesService: RefreshAgesService) { }

  ngOnInit() {
    this.editForm = this.createForm()
  }

  createForm(): FormGroup {
    return this.fb.group({
      from: [this.age.from, Validators.required],
      to: [this.age.to]
    })
  }

  closeEdit() {
    this.emitClose.emit()
  }

  saveData() {
    var ag: Age = { ...this.age, ...this.editForm.value }
    if (this.isNew) {
      this.agesService.createNew(ag).then(r => {
        console.log(r)
        this.refreshAgesService.makeRefresh()
        this.emitClose.emit()
      })
    } else {
      this.agesService.updateOne(ag).then(r => {
        console.log(r)
        this.refreshAgesService.makeRefresh()
      })
    }
  }

}
