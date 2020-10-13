import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { API_URL } from 'src/app/config';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl: string;

  constructor(private httpClient: HttpClient) {
    this.apiUrl = API_URL
  }


  checkLoginAndMakeToken(login: string, password: string): Promise<any> {
    const options = {
      headers: new HttpHeaders({ "Content-type": "application/json" })
    }
    return this.httpClient.post(this.apiUrl + '/api/login', { login: login, password: password }, options).toPromise()
      .then((res: Response) => {
        return res || {};
      })
  }

  isAuth(): Promise<any> {
    return this.httpClient.get(this.apiUrl + '/api/check/auth').toPromise()
      .then((res: Response) => {
        return res || { success: false }
      });
  }

  logout() {
    return this.httpClient.post(this.apiUrl + '/api/logout', {}).toPromise()
  }

}
