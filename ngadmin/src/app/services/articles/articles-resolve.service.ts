import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticlesService } from './articles.service';
import { Article } from 'src/app/models/article';
import { ArtQueryParams } from 'src/app/models/art-query-params';


@Injectable({
  providedIn: 'root'
})
export class ArticlesResolveService implements Resolve<Observable<{ qp: ArtQueryParams, articles: Article[], total: number }>> {

  constructor(private ArticlesService: ArticlesService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ qp: ArtQueryParams, articles: Article[], total: number }> {

    var qp: ArtQueryParams = {
      start: (route.queryParams['start']) ? route.queryParams['start'] : 0,
      limit: (route.queryParams['limit']) ? route.queryParams['limit'] : 20,
      column: (route.queryParams['column']) ? route.queryParams['column'] : 'publishedAt',
      order: (route.queryParams['order']) ? route.queryParams['order'] : 'desc',
      phrase: (route.queryParams['phrase']) ? route.queryParams['phrase'] : '',
      categoryId: (route.queryParams['categoryId']) ? route.queryParams['categoryId'] : null
    }



    return this.ArticlesService.getArticles(qp);
  }

}
