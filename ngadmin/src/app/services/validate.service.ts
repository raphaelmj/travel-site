import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor(private httpClient: HttpClient) { }

  checkIsAliasExists(type: string, title: string): Promise<any> {
    return this.httpClient.post<any>(API_URL + "/api/check/is/alias/free", { type: type, title: title }).toPromise()
  }

}
