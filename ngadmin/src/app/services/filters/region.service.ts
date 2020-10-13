import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/config';
import { Region } from 'src/app/models/region';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor(private httpClient: HttpClient) { }

  getRegions(): Observable<Region[]> {
    return this.httpClient.get<Region[]>(API_URL + '/api/get/regions')
  }

  createEmptyRegion(): Region {
    return {
      name: 'nazwa regionu',
      alias: null,
      lat: 0,
      lng: 0
    }
  }

  createRegion(r: Region): Promise<any> {
    return this.httpClient.post(API_URL + '/api/create/region', r).toPromise()
  }

  updateRegion(r: Region) {
    return this.httpClient.post(API_URL + '/api/update/region', r).toPromise()
  }

}
