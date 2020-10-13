import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/config';
import { Observable } from 'rxjs';
import { Article } from 'src/app/models/article';
import { ArtQueryParams } from 'src/app/models/art-query-params';
import { MicroGalleryImage } from 'src/app/models/tour-event';
import * as _moment from "moment"

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private httpClient: HttpClient) {

  }

  getArticles(qp: ArtQueryParams): Observable<{ qp: ArtQueryParams, articles: Article[], total: number }> {
    return this.httpClient.post<{ qp: ArtQueryParams, articles: Article[], total: number }>(API_URL + "/api/get/limit/articles", qp)
  }


  updateArticle(Article: Article, image: string): Promise<any> {

    return this.httpClient.post<any>(API_URL + "/api/update/article/data", { article: Article, image, folder: 'article', imageFor: 'art' }).toPromise()
  }

  createArticle(Article: Article, image: string): Promise<any> {
    return this.httpClient.post<any>(API_URL + "/api/create/article", { article: Article, image, folder: 'article', imageFor: 'art' }).toPromise()
  }


  deleteArticle(cid: number): Promise<any> {
    return this.httpClient.delete(API_URL + "/api/delete/article/" + cid).toPromise()
  }

  changeStatus(id: number, sts: number) {
    return this.httpClient.post(API_URL + "/api/change/article/status", { id: id, status: sts }).toPromise()
  }

  createEmpty(): Article {
    return {
      title: "",
      image: null,
      microGallery: [],
      smallDesc: null,
      longDesc: null,
      onHome: false,
      status: false,
      metaDescription: null,
      metaKeywords: null,
      publishedAt: (new Date()).toISOString()
    }
  }

}
