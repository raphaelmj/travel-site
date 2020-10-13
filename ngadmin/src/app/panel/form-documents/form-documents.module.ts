import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormDocumentsRoutingModule } from './form-documents-routing.module';
import { FormDocumentsComponent } from './form-documents.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolsModule } from 'src/app/tools/tools.module';
import { DocRowComponent } from './doc-row/doc-row.component';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatSelectModule } from '@angular/material';
import { ViewNoticeComponent } from './doc-row/view-notice/view-notice.component';
import { DocsFiltersComponent } from './docs-filters/docs-filters.component';


@NgModule({
  declarations: [FormDocumentsComponent, DocRowComponent, ViewNoticeComponent, DocsFiltersComponent],
  imports: [
    CommonModule,
    FormDocumentsRoutingModule,
    ToolsModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSelectModule
  ],
  entryComponents: [
    ViewNoticeComponent
  ]
})
export class FormDocumentsModule { }
