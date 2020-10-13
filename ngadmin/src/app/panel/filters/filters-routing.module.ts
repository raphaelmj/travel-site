import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FiltersComponent } from './filters.component';
import { GeoComponent } from './geo/geo.component';
import { OthersComponent } from './others/others.component';
import { FiltersGeoResolveService } from 'src/app/services/filters/filters-geo-resolve.service';
import { ThemesResolveService } from 'src/app/services/filters/themes-resolve.service';
import { AgesResolveService } from 'src/app/services/filters/ages-resolve.service';
import { DaysResolveService } from 'src/app/services/filters/days-resolve.service';


const routes: Routes = [
  { path: '', component: FiltersComponent },
  { path: 'geo', component: GeoComponent, resolve: { filters: FiltersGeoResolveService } },
  {
    path: 'others', component: OthersComponent, resolve: {
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
export class FiltersRoutingModule { }
