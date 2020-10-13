import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/config';
import { Attraction, AttractionTypeEnum } from 'src/app/models/attraction';
import { Region } from 'src/app/models/region';
import { City } from 'src/app/models/city';


@Injectable({
  providedIn: 'root'
})
export class AttractionService {

  constructor(private httpClient: HttpClient) { }


  updateAttractionRefactorIndex(attraction: Attraction, region: Region, city: City | null): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/filter/attraction/refactor/index', { attraction, region, city }).toPromise()
  }

  createAttraction(attraction: Attraction, region: Region, city: City) {
    return this.httpClient.post(API_URL + '/api/create/filter/attraction', { attraction, region, city }).toPromise()
  }

  deleteAttractionNameReafactorIndex(id: number) {
    return this.httpClient.delete(API_URL + '/api/delete/filter/attraction/refactor/index/' + id).toPromise()
  }

  createEmpty(): Attraction {
    return {
      name: '',
      alias: '',
      lat: 0,
      lng: 0,
      attractionType: AttractionTypeEnum.any
    }
  }

}
