import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnersRoutingModule } from './partners-routing.module';
import { PartnersComponent } from './partners.component';
import { PartnerAddEditComponent } from './partner-add-edit/partner-add-edit.component';
import { PartnerRowComponent } from './partner-row/partner-row.component';
import { ToolsModule } from 'src/app/tools/tools.module';
import { MatSelectModule, MatSlideToggleModule, MatButtonModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';


@NgModule({
  declarations: [PartnersComponent, PartnerAddEditComponent, PartnerRowComponent],
  imports: [
    CommonModule,
    PartnersRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    ToolsModule
  ],
  entryComponents: [
    PartnerAddEditComponent,
    ConfirmWindowComponent,
    UploadImageComponent
  ]
})
export class PartnersModule { }
