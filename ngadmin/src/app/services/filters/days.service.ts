import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Day } from 'src/app/models/day';
import { API_URL } from 'src/app/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DaysService {

  constructor(private httpClient: HttpClient) { }


  createNew(day: Day): Promise<any> {
    return this.httpClient.post(API_URL + '/api/create/day', { day }).toPromise()
  }

  updateOne(day: Day): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/day', { day }).toPromise()
  }

  delete(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + '/api/delete/day/' + id).toPromise()
  }

  getAll(): Observable<Day[]> {
    return this.httpClient.get<Day[]>(API_URL + '/api/get/days')
  }

  createEmpty(): Day {
    return {
      daysNumber: 0
    }
  }
}
