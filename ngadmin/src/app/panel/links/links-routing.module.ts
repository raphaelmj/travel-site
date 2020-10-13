import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LinksComponent } from './links.component';
import { RedirectIfNotauthGuard } from 'src/app/guards/redirect-if-notauth.guard';
import { LinksResolveService } from 'src/app/services/links/links-resolve.service';
import { MenusComponent } from './menus/menus.component';
import { MenusResolveService } from 'src/app/services/menu/menus-resolve.service';
import { ResourcesResolveService } from 'src/app/services/resources-resolve.service';

const routes: Routes = [
  { path: '', component: LinksComponent, canActivate: [RedirectIfNotauthGuard], resolve: { links: LinksResolveService, resources: ResourcesResolveService } },
  { path: 'menus', component: MenusComponent, canActivate: [RedirectIfNotauthGuard], resolve: { menus: MenusResolveService, resources: ResourcesResolveService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinksRoutingModule { }
