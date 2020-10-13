import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlidesRoutingModule } from './slides-routing.module';
import { SlidesComponent } from './slides.component';
import { SlideRowComponent } from './slide-row/slide-row.component';
import { SlideEditAddComponent } from './slide-edit-add/slide-edit-add.component';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule, MatSelectModule } from '@angular/material';
import { ToolsModule } from 'src/app/tools/tools.module';


@NgModule({
  declarations: [SlidesComponent, SlideRowComponent, SlideEditAddComponent],
  imports: [
    CommonModule,
    SlidesRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    ToolsModule
  ],
  entryComponents: [
    SlideEditAddComponent,
    UploadImageComponent
  ]
})
export class SlidesModule { }
