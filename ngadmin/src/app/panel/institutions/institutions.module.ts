import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstitutionsRoutingModule } from './institutions-routing.module';
import { InstitutionsComponent } from './institutions.component';
import { InstitutionRowComponent } from './institution-row/institution-row.component';
import { InstitutionEditAddComponent } from './institution-edit-add/institution-edit-add.component';
import { ToolsModule } from 'src/app/tools/tools.module';
import { MatSelectModule, MatSlideToggleModule, MatButtonModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';
import { CKEditorModule } from 'ckeditor4-angular';


@NgModule({
  declarations: [InstitutionsComponent, InstitutionRowComponent, InstitutionEditAddComponent],
  imports: [
    CommonModule,
    InstitutionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    CKEditorModule,
    ToolsModule
  ],
  entryComponents: [
    InstitutionEditAddComponent,
    UploadImageComponent
  ]
})
export class InstitutionsModule { }
