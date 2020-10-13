import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocQueryParams } from 'src/app/models/doc-query-params';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/config';
import { Doc } from 'src/app/models/doc';

@Injectable({
  providedIn: 'root'
})
export class DocService {

  constructor(private httpClient: HttpClient) { }


  getDocs(dqp: DocQueryParams): Observable<{ dqp: DocQueryParams, docs: Doc[], total: number }> {
    return this.httpClient.post<{ dqp: DocQueryParams, docs: Doc[], total: number }>(API_URL + '/api/get/docs', dqp)
  }

}
