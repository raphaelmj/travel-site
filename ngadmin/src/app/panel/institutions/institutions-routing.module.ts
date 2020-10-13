import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstitutionsComponent } from './institutions.component';
import { InstitutionResolveService } from 'src/app/services/institution/institution-resolve.service';


const routes: Routes = [
  { path: '', component: InstitutionsComponent, resolve: { institutions: InstitutionResolveService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitutionsRoutingModule { }
