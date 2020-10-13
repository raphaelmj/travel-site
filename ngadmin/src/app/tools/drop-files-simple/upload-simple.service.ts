import { Injectable } from '@angular/core';
import {
  HttpClient, HttpRequest
} from "@angular/common/http"
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})

export class UploadSimpleService {

  constructor(public HttpClient: HttpClient) { }


  uploadFiles(formData: FormData, folder: string): Observable<any> {

    const config = new HttpRequest('POST', API_URL + '/api/upload/simple/images/' + folder, formData, {
      reportProgress: true
    })

    return this.HttpClient.request(config)
  }

}
