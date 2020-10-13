import { Injectable } from '@angular/core';
import { Institution } from 'src/app/models/institution';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {


  constructor(private httpClient: HttpClient) { }

  getInstitutions(): Observable<Institution[]> {
    return this.httpClient.get<Institution[]>(API_URL + '/api/get/institutions')
  }

  update(inst: Institution, image: string): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/institution', { inst, image, folder: 'inst', imageFor: 'inst' }).toPromise()
  }


  create(inst: Institution, image: string) {
    return this.httpClient.post(API_URL + '/api/create/institution', { inst, image, folder: 'inst', imageFor: 'inst' }).toPromise()
  }


  changeOrder(insts: Institution[]): Promise<any> {
    return this.httpClient.post(API_URL + '/api/change/institutions/order', insts).toPromise()
  }


  changeStatus(id: number, status: boolean): Promise<any> {
    return this.httpClient.post(API_URL + '/api/change/institution/status', { id, status }).toPromise()
  }


  remove(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + '/api/delete/institution/' + id).toPromise()
  }

  createEmpty(): Institution {
    return {
      name: "",
      logo: null,
      tourTarget: null,
      description: null,
      ordering: null,
      status: false
    }
  }

}
