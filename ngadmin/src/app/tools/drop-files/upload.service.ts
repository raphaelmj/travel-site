import { Injectable } from '@angular/core';
import {
  HttpClient, HttpRequest
} from "@angular/common/http"
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})

export class UploadService {

  constructor(public HttpClient: HttpClient) { }


  uploadFiles(formData: FormData): Observable<any> {

    const config = new HttpRequest('POST', API_URL + '/api/upload/gallery/images', formData, {
      reportProgress: true
    })

    return this.HttpClient.request(config)
  }


  uploadFilesArts(formData: FormData): Observable<any> {

    const config = new HttpRequest('POST', API_URL + '/api/upload/art/gallery/images', formData, {
      reportProgress: true
    })

    return this.HttpClient.request(config)
  }

}
