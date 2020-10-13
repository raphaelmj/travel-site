import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/config';
import { Theme } from 'src/app/models/theme';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private httpClient: HttpClient) { }

  createNew(theme: Theme): Promise<any> {
    return this.httpClient.post(API_URL + '/api/create/theme', { theme }).toPromise()
  }

  updateOne(theme: Theme): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/theme', { theme }).toPromise()
  }

  delete(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + '/api/delete/theme/' + id).toPromise()
  }

  getAll(): Observable<Theme[]> {
    return this.httpClient.get<Theme[]>(API_URL + '/api/get/themes')
  }

  createEmpty(): Theme {
    return {
      name: ""
    }
  }

}
