import { Injectable } from '@angular/core';
import { HomePage, Color } from 'src/app/models/home-page';
import { API_URL } from 'src/app/config';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {

  constructor(private httpClient: HttpClient) { }

  getHPS(): Observable<HomePage[]> {
    return this.httpClient.get<HomePage[]>(API_URL + '/api/get/hps')
  }

  update(hp: HomePage, image: string): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/hp', { hp, image, folder: 'hps', imageFor: 'hp' }).toPromise()
  }


  create(hp: HomePage, image: string) {
    return this.httpClient.post(API_URL + '/api/create/hp', { hp, image, folder: 'hps', imageFor: 'hp' }).toPromise()
  }


  changeOrder(promos: HomePage[]): Promise<any> {
    return this.httpClient.post(API_URL + '/api/change/hps/order', promos).toPromise()
  }


  // changeStatus(id: number, status: boolean): Promise<any> {
  //   return this.httpClient.post(API_URL + '/api/change/promo/status', { id, status }).toPromise()
  // }


  remove(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + '/api/delete/hp/' + id).toPromise()
  }

  createEmpty(): HomePage {
    return {
      title: "",
      image: null,
      selfLink: "/",
      ordering: null,
      color: Color.bordo,
      target: '_self'
    }
  }
}
