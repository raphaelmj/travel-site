import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromosComponent } from './promos.component';
import { PromoResolveService } from 'src/app/services/promos/promo-resolve.service';


const routes: Routes = [
  { path: '', component: PromosComponent, resolve: { promos: PromoResolveService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromosRoutingModule { }
