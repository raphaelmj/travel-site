import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttachmentsComponent } from './attachments.component';
import { AttachmentResolveService } from 'src/app/services/attachments/attachment-resolve.service';


const routes: Routes = [
  { path: '', component: AttachmentsComponent, resolve: { attachments: AttachmentResolveService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttachmentsRoutingModule { }
