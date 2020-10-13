import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class OneFileUploadService {

  constructor(public httpClient: HttpClient) { }


  uploadFiles(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const config: HttpRequest<any> = new HttpRequest('POST', API_URL + '/api/upload/one/file', formData, {
      reportProgress: true
    })


    return this.httpClient.request(config)
  }

  uploadFilesName(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const config: HttpRequest<any> = new HttpRequest('POST', API_URL + '/api/upload/one/file/name', formData, {
      reportProgress: true
    })


    return this.httpClient.request(config)
  }

}
