import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promo } from 'src/app/models/promo';
import { API_URL } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class PromoService {

  constructor(private httpClient: HttpClient) { }

  getPromos(): Observable<Promo[]> {
    return this.httpClient.get<Promo[]>(API_URL + '/api/get/promos')
  }

  update(promo: Promo, image: string): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/promo', { promo, image, folder: 'promos', imageFor: 'promo' }).toPromise()
  }


  create(promo: Promo, image: string) {
    return this.httpClient.post(API_URL + '/api/create/promo', { promo, image, folder: 'promos', imageFor: 'promo' }).toPromise()
  }


  changeOrder(promos: Promo[]): Promise<any> {
    return this.httpClient.post(API_URL + '/api/change/promos/order', promos).toPromise()
  }


  changeStatus(id: number, status: boolean): Promise<any> {
    return this.httpClient.post(API_URL + '/api/change/promo/status', { id, status }).toPromise()
  }


  remove(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + '/api/delete/promo/' + id).toPromise()
  }

  createEmpty(): Promo {
    return {
      title: "",
      image: null,
      attachFile: null,
      ordering: null,
      status: false
    }
  }

}
