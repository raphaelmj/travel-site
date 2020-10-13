import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdatesZoneComponent } from './updates-zone.component';
import { EventsUpdateComponent } from './events-update/events-update.component';
import { CatalogsResolveService } from 'src/app/services/events-catalog/catalogs-resolve.service';
import { FoldersZipEventsResolveService } from 'src/app/services/folders-zip-events-resolve.service';


const routes: Routes = [
  { path: '', component: UpdatesZoneComponent },
  { path: 'events', component: EventsUpdateComponent, resolve: { catalogs: CatalogsResolveService, folders: FoldersZipEventsResolveService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdatesZoneRoutingModule { }
