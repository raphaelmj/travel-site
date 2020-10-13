import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePagesRoutingModule } from './home-pages-routing.module';
import { HomePagesComponent } from './home-pages.component';
import { HomePageRowComponent } from './home-page-row/home-page-row.component';
import { HomePageEditAddComponent } from './home-page-edit-add/home-page-edit-add.component';
import { ToolsModule } from 'src/app/tools/tools.module';
import { MatSelectModule, MatSlideToggleModule, MatButtonModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';


@NgModule({
  declarations: [HomePagesComponent, HomePageRowComponent, HomePageEditAddComponent],
  imports: [
    CommonModule,
    HomePagesRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    ToolsModule
  ],
  entryComponents: [
    HomePageEditAddComponent,
    UploadImageComponent
  ]
})
export class HomePagesModule { }
