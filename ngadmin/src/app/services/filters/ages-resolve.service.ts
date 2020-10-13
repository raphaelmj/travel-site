import { Injectable } from '@angular/core';
import { Age } from 'src/app/models/age';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class AgesResolveService implements Resolve<Age[]> {

  constructor(private httpClient: HttpClient) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Age[] | Observable<Age[]> | Promise<Age[]> {
    return this.httpClient.get<Age[]>(API_URL + '/api/get/ages')
  }
}
