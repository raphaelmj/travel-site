import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class UploadUpdateService {

  constructor(private httpClient: HttpClient) { }


  uploadFiles(formData: FormData): Observable<any> {

    const config = new HttpRequest('POST', API_URL + '/api/upload/update/zip', formData, {
      reportProgress: true
    })

    return this.httpClient.request(config)
  }

  getEventsUpdateFolders(): Observable<string[]> {
    return this.httpClient.get<string[]>(API_URL + '/api/get/folders/events/list')
  }

  removeEventFolder(folder: string): Promise<any> {
    return this.httpClient.post(API_URL + '/api/remove/folder/events', { folder }).toPromise()
  }

  updateEvents(folder: string, catalogId: number) {
    return this.httpClient.post(API_URL + '/api/folder/update/events', { folder, catalogId }).toPromise()
  }

}
