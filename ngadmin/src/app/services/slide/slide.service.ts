import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Slide } from 'src/app/models/slide';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class SlideService {

  constructor(private httpClient: HttpClient) { }


  getSlides(): Observable<Slide[]> {
    return this.httpClient.get<Slide[]>(API_URL + '/api/get/slides')
  }


  updateSlide(slide: Slide, image: string): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/slide', { slide, image, folder: 'slides', imageFor: 'slide' }).toPromise()
  }


  createSlide(slide: Slide, image: string) {
    return this.httpClient.post(API_URL + '/api/create/slide', { slide, image, folder: 'slides', imageFor: 'slide' }).toPromise()
  }


  changeSlidesOrder(slides: Slide[]): Promise<any> {
    return this.httpClient.post(API_URL + '/api/change/slides/order', slides).toPromise()
  }


  changeStatus(id: number, status: boolean): Promise<any> {
    return this.httpClient.post(API_URL + '/api/change/slide/status', { id, status }).toPromise()
  }


  removeSlide(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + '/api/delete/slide/' + id).toPromise()
  }

  createEmpty(): Slide {
    return {
      image: null,
      link: '',
      title: '',
      subTitle: '',
      linkTitle: '',
      target: '_self',
      status: false,
      ordering: null
    }
  }

}
