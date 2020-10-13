import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from 'ngadmin/src/app/config';
import { Region } from '../models/region';
import { Theme } from '../models/theme';
import { Age } from '../models/age';
import { Criteria } from '../models/criteria';
import { IndexCriteria } from '../models/index-criteria';

@Injectable({
  providedIn: 'root'
})
export class CriteriaService {

  constructor(private httpClient: HttpClient) { }

  getCriteriaList(): Observable<Criteria> {
    return this.httpClient.get<Criteria>(API_URL + '/api/get/search/criteria')
  }

  findCriteria(phrase: string): Observable<IndexCriteria[]> {
    return this.httpClient.get<IndexCriteria[]>(API_URL + '/api/get/point/search?phrase=' + phrase)
  }

}
