import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Link } from 'src/app/models/link';
import { API_URL } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private httpClient: HttpClient) { }

  getContents(): Observable<Link[]> {
    return this.httpClient.get<Link[]>(API_URL + '/api/get/links/content')
  }

}
