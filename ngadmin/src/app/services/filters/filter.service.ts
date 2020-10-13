import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/config';
import { Observable } from 'rxjs';
import { Region } from 'src/app/models/region';
import { Attraction } from 'src/app/models/attraction';
import { City } from 'src/app/models/city';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private httpClient: HttpClient) { }

  getGeoFilters(): Observable<{ tree: Region[], freeCities: City[], freeAttractions: Attraction[] }> {
    return this.httpClient.get<{ tree: Region[], freeCities: City[], freeAttractions: Attraction[] }>(API_URL + '/api/get/geo/filters')
  }

  getRegions(): Observable<Region[]> {
    return this.httpClient.get<Region[]>(API_URL + '/api/get/regions')
  }

  getRegionCities(regionId: number): Observable<City[]> {
    return this.httpClient.get<City[]>(API_URL + '/api/get/region/' + regionId + '/cities')
  }

  getRegionAttractions(regionId: number): Observable<Attraction[]> {
    return this.httpClient.get<Attraction[]>(API_URL + '/api/get/region/' + regionId + '/attractions')
  }


}
