import { Component, OnInit, ViewChild, ComponentRef, Inject, ComponentFactoryResolver, ViewContainerRef, Type, OnDestroy } from '@angular/core';
import { Attachment } from 'src/app/models/attachment';
import Sortable, { MultiDrag, Swap } from 'sortablejs';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AttachmentAddEditComponent } from './attachment-add-edit/attachment-add-edit.component';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';
import { AttachmentService } from 'src/app/services/attachments/attachment.service';
import { RefreshAttachmentService } from 'src/app/services/refresh-attachment.service';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.less']
})
export class AttachmentsComponent implements OnInit, OnDestroy {

  @ViewChild('editTemp', { read: ViewContainerRef, static: true }) editTemp: ViewContainerRef
  editAddC: ComponentRef<AttachmentAddEditComponent>
  @ViewChild('remove', { read: ViewContainerRef, static: true }) removeTemp: ViewContainerRef;
  confirmC: ComponentRef<ConfirmWindowComponent>

  attachments: Attachment[]
  sortable: Sortable
  subRefresh: Subscription
  subAttachments: Subscription

  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private cf: ComponentFactoryResolver,
    private attachmentService: AttachmentService,
    private refreshAttachmentService: RefreshAttachmentService
  ) {
    this.attachments = this.activatedRoute.snapshot.data['attachments']
  }


  ngOnInit() {
    this.subRefresh = this.refreshAttachmentService.refresh$.subscribe(bool => {
      if (bool) {
        this.subAttachments = this.attachmentService.getAttachments().subscribe(ats => {
          this.attachments = ats
        })
      }
    })
    this.createSortable()
  }

  createSortable() {

    this.sortable = new Sortable(this.document.getElementById('sortAttachs'), {

      // Element dragging ended
      onEnd: function (/**Event*/evt) {
        // console.log(evt.oldIndex, evt.newIndex)
        var element = this.attachments[evt.oldIndex];
        this.attachments.splice(evt.oldIndex, 1);
        this.attachments.splice(evt.newIndex, 0, element);

      }.bind(this)

    })
  }

  addAttachment() {
    this.editTemp.clear()
    this.removeTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<AttachmentAddEditComponent>>AttachmentAddEditComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = true
    this.editAddC.instance.attachment = this.attachmentService.createEmpty()
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })

  }


  openEdit(a: Attachment) {
    this.editTemp.clear()
    this.removeTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<AttachmentAddEditComponent>>AttachmentAddEditComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = false
    this.editAddC.instance.attachment = a
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })
  }

  startDelete(a: Attachment) {
    this.editTemp.clear()
    this.removeTemp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.removeTemp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = a.id
    this.confirmC.instance.message = 'Czy checesz usunąć grupę?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {
      // console.log(r)
      if (r.do) {
        this.confirmC.destroy()
        this.deleteAttach(r.bundleData)
      } else {
        this.confirmC.destroy()
      }
    })
  }


  deleteAttach(id: number) {
    this.attachmentService.remove(id).then(r => {
      this.refreshAttachmentService.makeRefresh()
    })
  }


  ngOnDestroy(): void {
    if (this.subRefresh)
      this.subRefresh.unsubscribe()
    if (this.subAttachments)
      this.subAttachments.unsubscribe()
  }

}
