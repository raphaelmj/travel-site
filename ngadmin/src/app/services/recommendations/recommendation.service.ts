import { Injectable } from '@angular/core';
import { Recommendation } from 'src/app/models/recommendation';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  constructor(private httpClient: HttpClient) { }

  getRecommendations(): Observable<Recommendation[]> {
    return this.httpClient.get<Recommendation[]>(API_URL + '/api/get/recos')
  }

  update(reco: Recommendation, image: string): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/reco', { reco, image, folder: 'inst', imageFor: 'inst' }).toPromise()
  }


  create(reco: Recommendation, image: string) {
    return this.httpClient.post(API_URL + '/api/create/reco', { reco, image, folder: 'inst', imageFor: 'inst' }).toPromise()
  }


  changeOrder(recos: Recommendation[]): Promise<any> {
    return this.httpClient.post(API_URL + '/api/change/recos/order', recos).toPromise()
  }


  changeStatus(id: number, status: boolean): Promise<any> {
    return this.httpClient.post(API_URL + '/api/change/reco/status', { id, status }).toPromise()
  }


  remove(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + '/api/delete/reco/' + id).toPromise()
  }

  createEmpty(): Recommendation {
    return {
      name: "",
      image: null,
      file: null,
      ordering: null,
      status: false
    }
  }

}
