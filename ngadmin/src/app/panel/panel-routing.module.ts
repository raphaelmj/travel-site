import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PanelComponent } from './panel.component';
import { RedirectIfNotauthGuard } from '../guards/redirect-if-notauth.guard';

const routes: Routes = [
  { path: '', component: PanelComponent, canActivate: [RedirectIfNotauthGuard] },
  { path: 'links', loadChildren: () => import('./links/links.module').then(m => m.LinksModule), canActivate: [RedirectIfNotauthGuard] },
  { path: 'filters', loadChildren: () => import('./filters/filters.module').then(m => m.FiltersModule), canActivate: [RedirectIfNotauthGuard] },
  { path: 'events-catalog', loadChildren: () => import('./events-catalog/events-catalog.module').then(m => m.EventsCatalogModule), canActivate: [RedirectIfNotauthGuard] },
  { path: 'form-documents', loadChildren: () => import('./form-documents/form-documents.module').then(m => m.FormDocumentsModule), canActivate: [RedirectIfNotauthGuard] },
  { path: 'articles', loadChildren: () => import('./articles/articles.module').then(m => m.ArticlesModule), canActivate: [RedirectIfNotauthGuard] },
  { path: 'attachments', loadChildren: () => import('./attachments/attachments.module').then(m => m.AttachmentsModule), canActivate: [RedirectIfNotauthGuard] },
  { path: 'home-pages', loadChildren: () => import('./home-pages/home-pages.module').then(m => m.HomePagesModule), canActivate: [RedirectIfNotauthGuard] },
  { path: 'institutions', loadChildren: () => import('./institutions/institutions.module').then(m => m.InstitutionsModule), canActivate: [RedirectIfNotauthGuard] },
  { path: 'partners', loadChildren: () => import('./partners/partners.module').then(m => m.PartnersModule), canActivate: [RedirectIfNotauthGuard] },
  { path: 'promos', loadChildren: () => import('./promos/promos.module').then(m => m.PromosModule), canActivate: [RedirectIfNotauthGuard] },
  { path: 'recommendations', loadChildren: () => import('./recommendation/recommendation.module').then(m => m.RecommendationModule), canActivate: [RedirectIfNotauthGuard] },
  { path: 'slides', loadChildren: () => import('./slides/slides.module').then(m => m.SlidesModule), canActivate: [RedirectIfNotauthGuard] },
  { path: 'updates', loadChildren: () => import('./updates-zone/updates-zone.module').then(m => m.UpdatesZoneModule), canActivate: [RedirectIfNotauthGuard] },
  { path: "widgets", loadChildren: () => import('./widgets/widgets.module').then(m => m.WidgetsModule), canActivate: [RedirectIfNotauthGuard] },
  { path: "contents", loadChildren: () => import('./contents/contents.module').then(m => m.ContentsModule), canActivate: [RedirectIfNotauthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
