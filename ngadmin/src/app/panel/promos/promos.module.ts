import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromosRoutingModule } from './promos-routing.module';
import { PromosComponent } from './promos.component';
import { PromoEditAddComponent } from './promo-edit-add/promo-edit-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule, MatSelectModule } from '@angular/material';
import { ToolsModule } from 'src/app/tools/tools.module';
import { PromoRowComponent } from './promo-row/promo-row.component';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';


@NgModule({
  declarations: [PromosComponent, PromoEditAddComponent, PromoRowComponent],
  imports: [
    CommonModule,
    PromosRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    ToolsModule
  ],
  entryComponents: [
    PromoEditAddComponent,
    UploadImageComponent
  ]

})
export class PromosModule { }
