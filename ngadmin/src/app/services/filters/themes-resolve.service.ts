import { Injectable } from '@angular/core';
import { Theme } from 'src/app/models/theme';
import { API_URL } from 'src/app/config';
import { RouterStateSnapshot, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemesResolveService implements Resolve<Theme[]>  {

  constructor(private httpClient: HttpClient) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Theme[] | Observable<Theme[]> | Promise<Theme[]> {
    return this.httpClient.get<Theme[]>(API_URL + '/api/get/themes')
  }
}
