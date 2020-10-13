import { Injectable } from '@angular/core';
import { Partner } from 'src/app/models/partner';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  constructor(private httpClient: HttpClient) { }

  getPartners(): Observable<Partner[]> {
    return this.httpClient.get<Partner[]>(API_URL + '/api/get/partners')
  }

  update(partner: Partner, image: string): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/partner', { partner, image, folder: 'partners', imageFor: 'partner' }).toPromise()
  }


  create(partner: Partner, image: string) {
    return this.httpClient.post(API_URL + '/api/create/partner', { partner, image, folder: 'partners', imageFor: 'partner' }).toPromise()
  }


  changeOrder(partners: Partner[]): Promise<any> {
    return this.httpClient.post(API_URL + '/api/change/partners/order', partners).toPromise()
  }


  remove(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + '/api/delete/partner/' + id).toPromise()
  }

  createEmpty(): Partner {
    return {
      link: "",
      image: null,
      ordering: null
    }
  }
}
