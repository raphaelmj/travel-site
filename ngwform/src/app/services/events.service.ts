import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventIndexElement } from '../models/event-element';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private httpClient: HttpClient) { }

  searchForEvent(v: string): Observable<EventIndexElement[]> {
    return this.httpClient.get<EventIndexElement[]>(API_URL + '/api/get/event/search/number?phrase=' + v)
  }

}
