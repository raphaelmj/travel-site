import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/config';
import { City } from 'src/app/models/city';
import { Region } from 'src/app/models/region';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private httpClient: HttpClient) { }


  getCities(): Observable<City[]> {
    return this.httpClient.get<City[]>(API_URL + '/api/get/cities')
  }


  updateCityNameReafactorIndex(city: City, regionId: number): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/filter/city/refactor/index', { city, regionId }).toPromise()
  }

  createCity(city: City, regionId: number) {
    return this.httpClient.post(API_URL + '/api/create/filter/city', { city, regionId }).toPromise()
  }

  deleteCityNameReafactorIndex(id: number) {
    return this.httpClient.delete(API_URL + '/api/delete/filter/city/refactor/index/' + id).toPromise()
  }


  createEmptyCity(): City {
    return {
      name: '',
      alias: null,
      lat: 0,
      lng: 0
    }
  }

}
