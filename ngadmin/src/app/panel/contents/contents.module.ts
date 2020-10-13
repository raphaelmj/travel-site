import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentsRoutingModule } from './contents-routing.module';
import { ContentsComponent } from './contents.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { ToolsModule } from 'src/app/tools/tools.module';
import { MatSelectModule, MatSlideToggleModule, MatButtonModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EditContentComponent } from './edit-content/edit-content.component';


@NgModule({
  declarations: [ContentsComponent, EditContentComponent],
  imports: [
    CommonModule,
    ContentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    ToolsModule,
    CKEditorModule
  ],
  entryComponents: [
    EditContentComponent
  ]
})
export class ContentsModule { }
