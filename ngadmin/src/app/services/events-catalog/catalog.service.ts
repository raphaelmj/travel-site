import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Catalog } from 'src/app/models/catalog';
import { API_URL } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(private httpClient: HttpClient) { }


  getCatalogs(): Observable<Catalog[]> {
    return this.httpClient.get<Catalog[]>(API_URL + '/api/get/catalogs')
  }

  update(catalog: Catalog, image: string): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/catalog', { catalog, image, folder: 'catalog', imageFor: 'catalog' }).toPromise()
  }


  create(catalog: Catalog, image: string) {
    return this.httpClient.post(API_URL + '/api/create/catalog', { catalog, image, folder: 'catalog', imageFor: 'catalog' }).toPromise()
  }


  changeOrder(catalogs: Catalog[]): Promise<any> {
    return this.httpClient.post(API_URL + '/api/change/catalogs/order', catalogs).toPromise()
  }


  remove(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + '/api/delete/catalog/' + id).toPromise()
  }

  createEmpty(): Catalog {
    return {
      name: "",
      image: null,
      attachFile: null,
      ordering: null,
      current: false,
      searchList: false
    }
  }

}
