import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormDocumentsComponent } from '../form-documents/form-documents.component';
import { DocResolveService } from 'src/app/services/doc/doc-resolve.service';


const routes: Routes = [
  { path: '', component: FormDocumentsComponent, resolve: { docs: DocResolveService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormDocumentsRoutingModule { }
