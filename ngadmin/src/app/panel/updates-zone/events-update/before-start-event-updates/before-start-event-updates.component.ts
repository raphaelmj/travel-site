import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Catalog } from 'src/app/models/catalog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadUpdateService } from 'src/app/services/upload-update.service';

@Component({
  selector: 'app-before-start-event-updates',
  templateUrl: './before-start-event-updates.component.html',
  styleUrls: ['./before-start-event-updates.component.less']
})
export class BeforeStartEventUpdatesComponent implements OnInit {

  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Input() folder: string
  @Input() catalogs: Catalog[]

  formC: FormGroup

  constructor(private fb: FormBuilder, private uploadUpdateService: UploadUpdateService) { }

  ngOnInit() {
    this.createForm()
  }

  createForm() {
    this.formC = this.fb.group({
      catalog: [null, Validators.required]
    })
  }

  closeUpdate() {
    this.emitClose.emit()
  }

  startUpdate() {
    console.log(this.formC.valid)
    if (this.formC.valid) {
      this.uploadUpdateService.updateEvents(this.folder, this.formC.get('catalog').value).then(r => {
        console.log(r)
      })
    }
  }

}
