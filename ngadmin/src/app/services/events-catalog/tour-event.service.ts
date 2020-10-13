import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryParams } from 'src/app/models/query-params';
import { API_URL } from 'src/app/config';
import { Observable } from 'rxjs';
import { TourEvent } from 'src/app/models/tour-event';
import { Catalog } from 'src/app/models/catalog';

@Injectable({
  providedIn: 'root'
})
export class TourEventService {

  constructor(private httpClient: HttpClient) { }

  getCatalogEventsQuery(qp: QueryParams, catalogId: number | string): Observable<{ qp: QueryParams, events: TourEvent[], catalog: Catalog, total: number }> {
    return this.httpClient.post<{ qp: QueryParams, events: TourEvent[], catalog: Catalog, total: number }>(API_URL + '/api/get/catalog/events/query', { qp, catalogId })
  }

  getEventFullDataBase(id: number): Observable<TourEvent> {
    return this.httpClient.get<TourEvent>(API_URL + '/api/get/event/' + id)
  }

}
