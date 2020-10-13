import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/config';
import { Age } from 'src/app/models/age';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgeService {

  constructor(private httpClient: HttpClient) { }


  createNew(age: Age): Promise<any> {
    return this.httpClient.post(API_URL + '/api/create/age', { age }).toPromise()
  }

  updateOne(age: Age): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/age', { age }).toPromise()
  }


  getAll(): Observable<Age[]> {
    return this.httpClient.get<Age[]>(API_URL + '/api/get/ages')
  }

  delete(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + '/api/delete/age/' + id).toPromise()
  }

  createEmpty(): Age {
    return {
      from: 0,
      to: 0
    }
  }

}
