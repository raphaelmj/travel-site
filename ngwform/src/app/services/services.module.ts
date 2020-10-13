import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from './events.service';
import { HttpClientModule } from '@angular/common/http'
import { UploadDocService } from './upload-doc.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    EventsService,
    UploadDocService
  ]
})
export class ServicesModule { }
