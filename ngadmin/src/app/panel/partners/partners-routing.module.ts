import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartnersComponent } from './partners.component';
import { PartnersResolveService } from 'src/app/services/partners/partners-resolve.service';


const routes: Routes = [
  { path: '', component: PartnersComponent, resolve: { partners: PartnersResolveService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnersRoutingModule { }
