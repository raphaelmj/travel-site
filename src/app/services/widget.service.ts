import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WidgetsGroup } from '../models/widget';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {

  constructor(private httpClient: HttpClient) { }

  getWigetsGroup(): Observable<WidgetsGroup> {
    return this.httpClient.get<WidgetsGroup>(API_URL + '/api/widgets/group')
  }

}
