import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventElement } from '../models/event-element';
import { API_URL } from '../config';
import { SearchParams } from '../models/search-params';
import { IndexResponse } from '../models/index-response';
import { Attraction } from '../models/attraction';
import { City } from '../models/city';
import { Catalog } from '../models/catalog';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) { }

  getEvents(searchParams: SearchParams): Observable<IndexResponse> {
    var query = '/api/search/index?regions=' + searchParams.regions + '&cities=' + searchParams.cities + '&attractions=' + searchParams.attractions;
    query += '&themes=' + searchParams.themes;
    query += '&ages=' + searchParams.ages;
    query += '&catalog=' + searchParams.catalog;
    query += '&page=' + searchParams.page;
    query += '&type=' + searchParams.type;
    query += "&status=" + searchParams.status;
    query += '&days=' + searchParams.days;
    query += '&order=' + searchParams.order;
    if (searchParams.only) {
      if (searchParams.only == 'template') {
        query += '&only=template'
      }
    }
    return this.httpClient.get<IndexResponse>(API_URL + query)
  }

  countAttractionEvents(query: string): Promise<IndexResponse> {

    return this.httpClient.get<IndexResponse>(API_URL + query).toPromise()

  }

}
