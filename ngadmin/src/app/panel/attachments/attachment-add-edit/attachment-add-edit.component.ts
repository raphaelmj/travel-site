import { Component, OnInit, Input, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Attachment, AttachDoc, AttachType } from 'src/app/models/attachment';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { RefreshAttachmentService } from 'src/app/services/refresh-attachment.service';
import { OneFileUploadService } from 'src/app/services/one-file-upload.service';
import { HttpResponse } from '@angular/common/http';
import { AttachmentService } from 'src/app/services/attachments/attachment.service';

@Component({
  selector: 'app-attachment-add-edit',
  templateUrl: './attachment-add-edit.component.html',
  styleUrls: ['./attachment-add-edit.component.less']
})
export class AttachmentAddEditComponent implements OnInit {

  @ViewChild('filePdf', { read: ElementRef, static: true }) filePdf: ElementRef;
  @Output() emitAttachFile: EventEmitter<string> = new EventEmitter()

  @Input() attachment: Attachment
  @Input() isNew: boolean = true
  @Output() emitClose: EventEmitter<any> = new EventEmitter()

  attachForm: FormGroup

  iconTypes: Array<{ name: string, value: AttachType }> = [
    { name: 'PDF', value: AttachType.pdf },
    { name: 'Arkusz kalkulacyjny', value: AttachType.excel },
    { name: 'Document tekstowy', value: AttachType.word },
    { name: 'Obrazek', value: AttachType.image }
  ]


  constructor(
    private fb: FormBuilder,
    private attachmentService: AttachmentService,
    private refreshAttachmentService: RefreshAttachmentService,
    private oneFileUploadService: OneFileUploadService
  ) { }

  ngOnInit() {
    this.createForm()
  }


  createForm() {
    this.attachForm = this.fb.group({
      groupName: [this.attachment.groupName],
      status: [this.attachment.status],
      files: this.createFilesArray(this.attachment.files)
    })
  }


  createFilesArray(files: AttachDoc[]): FormArray {
    let fA: FormArray = this.fb.array([])

    files.map(f => {
      fA.push(this.fb.group({
        path: [f.path],
        name: [f.name],
        iconType: [f.iconType]
      }))
    })

    return fA
  }

  createDocGroup(name: string, path: string, iconType: string | null) {
    if (!iconType)
      iconType = AttachType.other

    this.attachForm.get('files')['controls'].push(
      this.fb.group({
        path: [path],
        name: [name],
        iconType: [iconType]
      }))
  }


  closeEdit() {
    this.emitClose.emit()
  }

  removeAttach(index: number) {
    this.attachForm.get('files')['controls'].splice(index, 1)
    this.attachForm.get('files').value.splice(index, 1)
  }


  handleFileInput(file: File, type: string) {
    // console.log(file[0])
    this.oneFileUploadService.uploadFilesName(file[0]).subscribe(event => {
      // console.log(event)
      if (event instanceof HttpResponse) {
        // console.log(event.body)
        // console.log(event.body)
        this.createDocGroup(event.body.name, event.body.path, event.body.typeFile)
      }
    })
  }


  saveData() {

    if (this.attachForm.valid) {
      var attach: Attachment = { ...this.attachment, ...this.attachForm.value }
      // console.log(attach)
      if (this.isNew) {
        this.createAttach(attach)
      } else {
        this.updateAttach(attach)
      }
    }

  }

  createAttach(attachment: Attachment) {
    this.attachmentService.create(attachment).then(r => {
      this.refreshAttachmentService.makeRefresh()
      this.emitClose.emit()
    })
  }

  updateAttach(attachment: Attachment) {
    this.attachmentService.update(attachment).then(r => {
      this.refreshAttachmentService.makeRefresh()
    })
  }

}
