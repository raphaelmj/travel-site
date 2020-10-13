import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttachmentsRoutingModule } from './attachments-routing.module';
import { AttachmentsComponent } from './attachments.component';
import { AttachmentRowComponent } from './attachment-row/attachment-row.component';
import { AttachmentAddEditComponent } from './attachment-add-edit/attachment-add-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule, MatSelectModule } from '@angular/material';
import { ToolsModule } from 'src/app/tools/tools.module';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';


@NgModule({
  declarations: [AttachmentsComponent, AttachmentRowComponent, AttachmentAddEditComponent],
  imports: [
    CommonModule,
    AttachmentsRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    ToolsModule
  ],
  entryComponents: [
    AttachmentAddEditComponent,
    UploadImageComponent
  ]
})
export class AttachmentsModule { }
