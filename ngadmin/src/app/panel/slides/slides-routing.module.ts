import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SlidesComponent } from './slides.component';
import { SlidesResolveService } from 'src/app/services/slide/slides-resolve.service';


const routes: Routes = [
  { path: '', component: SlidesComponent, resolve: { slides: SlidesResolveService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SlidesRoutingModule { }
