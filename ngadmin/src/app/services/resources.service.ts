import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  constructor(private httpClient: HttpClient) { }

  getDataResources(): Observable<Array<any>> {

    return this.httpClient.get<Array<any>>(API_URL + "/api/get/data/resources")

  }

  checkIsPathFree(path: string, oldPath: string): Promise<boolean> {
    return this.httpClient.post<boolean>(API_URL + "/api/check/is/link/path/free", { path: path, oldPath: oldPath }).toPromise()
  }

}
