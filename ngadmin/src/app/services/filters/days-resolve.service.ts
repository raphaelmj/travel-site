import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Day } from 'src/app/models/day';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class DaysResolveService implements Resolve<Day[]> {

  constructor(private httpClient: HttpClient) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Day[] | Observable<Day[]> | Promise<Day[]> {
    return this.httpClient.get<Day[]>(API_URL + '/api/get/days')
  }


}
