import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdatesZoneRoutingModule } from './updates-zone-routing.module';
import { UpdatesZoneComponent } from './updates-zone.component';
import { EventsUpdateComponent } from './events-update/events-update.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ngfModule } from 'angular-file';
import { BeforeStartEventUpdatesComponent } from './events-update/before-start-event-updates/before-start-event-updates.component';
import { MatSelectModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [UpdatesZoneComponent, EventsUpdateComponent, BeforeStartEventUpdatesComponent],
  imports: [
    CommonModule,
    UpdatesZoneRoutingModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    ngfModule,
    MatSelectModule,
  ],
  entryComponents: [
    BeforeStartEventUpdatesComponent
  ]
})
export class UpdatesZoneModule { }
