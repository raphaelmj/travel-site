import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Attachment } from 'src/app/models/attachment';
import { AttachmentService } from 'src/app/services/attachments/attachment.service';
import { RefreshAttachmentService } from 'src/app/services/refresh-attachment.service';

@Component({
  selector: 'app-attachment-row',
  templateUrl: './attachment-row.component.html',
  styleUrls: ['./attachment-row.component.less']
})
export class AttachmentRowComponent implements OnInit {

  @Input() attachment: Attachment
  @Output() editStart: EventEmitter<Attachment> = new EventEmitter<Attachment>()
  @Output() deleteStart: EventEmitter<Attachment> = new EventEmitter<Attachment>()

  constructor(
    private attachmentService: AttachmentService,
    private refreshAttachmentService: RefreshAttachmentService
  ) { }

  ngOnInit() {
  }


  openEdit() {
    this.editStart.emit(this.attachment)
  }

  deletePromo() {
    this.deleteStart.emit(this.attachment)
  }

  changeStatus(sts: boolean) {
    this.attachmentService.changeStatus(this.attachment.id, sts).then(r => {
      this.refreshAttachmentService.makeRefresh()
    })
  }

}
