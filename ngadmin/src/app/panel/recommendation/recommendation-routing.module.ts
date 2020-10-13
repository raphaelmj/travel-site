import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecommendationComponent } from './recommendation.component';
import { RecommendationResolveService } from 'src/app/services/recommendations/recommendation-resolve.service';


const routes: Routes = [
  { path: '', component: RecommendationComponent, resolve: { recos: RecommendationResolveService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecommendationRoutingModule { }
