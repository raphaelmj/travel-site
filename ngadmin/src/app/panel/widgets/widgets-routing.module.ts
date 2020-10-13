import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetsComponent } from './widgets.component';
import { WidgetsResolveService } from 'src/app/services/wigdets/widgets-resolve.service';


const routes: Routes = [
  { path: "", component: WidgetsComponent, resolve: { widgets: WidgetsResolveService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetsRoutingModule { }
