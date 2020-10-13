import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class TaxResolveService implements Resolve<number> {

  constructor(private httpClient: HttpClient) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): number | Observable<number> | Promise<number> {
    return this.httpClient.get<number>(API_URL + '/api/get/tax')
  }
}
