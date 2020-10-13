import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePagesComponent } from './home-pages.component';
import { HomePageResolveService } from 'src/app/services/home-pages/home-page-resolve.service';


const routes: Routes = [
  { path: '', component: HomePagesComponent, resolve: { hps: HomePageResolveService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePagesRoutingModule { }
