import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentsComponent } from './contents.component';
import { ContentsResolveService } from 'src/app/services/contents/content/contents-resolve.service';


const routes: Routes = [
  { path: "", component: ContentsComponent, resolve: { links: ContentsResolveService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentsRoutingModule { }
