import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class UploadDocService {



  private units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];

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

  bytesToSize(bytes: number, precision: number = 2) {
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) return '?';

    let unit = 0;

    while (bytes >= 1024) {
      bytes /= 1024;
      unit++;
    }

    return bytes.toFixed(+ precision) + ' ' + this.units[unit];
  };

}
