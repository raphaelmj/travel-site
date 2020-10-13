import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TourEventStatus, TourEventSezonType, TourEventType } from 'src/app/models/query-params';
import { API_URL } from 'src/app/config';
import { TourEvent } from 'src/app/models/tour-event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) { }

  changeField(value: TourEventStatus, field: string, id: number, ): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/event/' + id, { value: value, field }).toPromise()
  }

  updateEvent(event: TourEvent): Promise<any> {
    return this.httpClient.post(API_URL + '/api/full/update/event', event).toPromise()
  }

  createEvent(event: TourEvent): Promise<any> {
    return this.httpClient.post(API_URL + '/api/create/event', event).toPromise()
  }

  checkIsNumberFree(value: string, isNew: boolean, eventId: number | null) {
    return this.httpClient.post(API_URL + '/api/event/number/free/check', { value, isNew, eventId }).toPromise()
  }

  createEmpty(): TourEvent {
    return {
      Ages: [],
      Attractions: [],
      Cities: [],
      Days: [],
      Regions: [],
      Themes: [],
      attachments: [],
      catalog: null,
      catalogId: null,
      customersLimit: null,
      endAt: null,
      eventSezonType: TourEventSezonType.any,
      eventType: TourEventType.template,
      image: null,
      longDesc: null,
      metaDescription: null,
      metaKeywords: null,
      microGallery: [],
      name: null,
      number: null,
      priceBrutto: null,
      priceConfig: [],
      priceNetto: null,
      smallDesc: null,
      startAt: null,
      status: TourEventStatus.avl,
      tax: null
    }
  }

}
