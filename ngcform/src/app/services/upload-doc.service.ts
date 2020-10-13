import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class UploadDocService {


  constructor(private httpClient: HttpClient) { }

  public upload(data, type) {


    return this.httpClient.post<any>(API_URL + '/api/send/file/' + type, data, {
      reportProgress: true,
      observe: 'events'
    }).pipe(map((event) => {

      switch (event.type) {

        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / event.total);
          return { status: 'progress', message: progress };

        case HttpEventType.Response:
          return event.body;

        default:
          return `Unhandled event: ${event.type}`;
      }
    })
    );
  }

}
