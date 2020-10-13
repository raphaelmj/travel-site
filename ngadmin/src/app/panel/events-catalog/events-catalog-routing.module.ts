import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsCatalogComponent } from './events-catalog.component';
import { CatalogsResolveService } from 'src/app/services/events-catalog/catalogs-resolve.service';
import { EventsListComponent } from './events-list/events-list.component';
import { CatalogEventsResolveService } from 'src/app/services/events-catalog/catalog-events-resolve.service';
import { TaxResolveService } from 'src/app/services/tax-resolve.service';
import { DaysResolveService } from 'src/app/services/filters/days-resolve.service';
import { AgesResolveService } from 'src/app/services/filters/ages-resolve.service';
import { ThemesResolveService } from 'src/app/services/filters/themes-resolve.service';


const routes: Routes = [
  { path: '', component: EventsCatalogComponent, resolve: { catalogs: CatalogsResolveService } },
  {
    path: ':id', component: EventsListComponent, resolve: {
      data: CatalogEventsResolveService,
      tax: TaxResolveService,
      catalogs: CatalogsResolveService,
      days: DaysResolveService,
      ages: AgesResolveService,
      themes: ThemesResolveService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsCatalogRoutingModule { }
