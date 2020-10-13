import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticlesComponent } from './articles.component';
import { RedirectIfNotauthGuard } from 'src/app/guards/redirect-if-notauth.guard';
import { ArticlesResolveService } from 'src/app/services/articles/articles-resolve.service';
import { CategoriesResolveService } from 'src/app/services/categories/categories-resolve.service';

const routes: Routes = [
  { path: '', component: ArticlesComponent, canActivate: [RedirectIfNotauthGuard], resolve: { articles: ArticlesResolveService, categories: CategoriesResolveService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
