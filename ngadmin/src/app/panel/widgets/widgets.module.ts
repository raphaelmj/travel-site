import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetsRoutingModule } from './widgets-routing.module';
import { WidgetsComponent } from './widgets.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { EditInsurenceComponent } from './edit-insurence/edit-insurence.component';
import { EditMapComponent } from './edit-map/edit-map.component';
import { EditCookieComponent } from './edit-cookie/edit-cookie.component';
import { EditCertComponent } from './edit-cert/edit-cert.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule, MatSelectModule } from '@angular/material';
import { ToolsModule } from 'src/app/tools/tools.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';

@NgModule({
  declarations: [WidgetsComponent, EditContactComponent, EditInvoiceComponent, EditInsurenceComponent, EditMapComponent, EditCookieComponent, EditCertComponent],
  imports: [
    CommonModule,
    WidgetsRoutingModule,
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
    EditContactComponent,
    EditCookieComponent,
    EditInsurenceComponent,
    EditInvoiceComponent,
    EditMapComponent,
    EditCertComponent,
    UploadImageComponent
  ]
})
export class WidgetsModule { }
