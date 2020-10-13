import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class FileListService {

  constructor(private httpClient: HttpClient) { }

  listFolder(folder: string): Observable<Array<string>> {
    return this.httpClient.get<Array<string>>(API_URL + '/api/get/files/from/' + folder)
  }

  removeFileFromDir(file: string): Promise<any> {
    return this.httpClient.post(API_URL + '/api/remove/file', { file: file }).toPromise()
  }

}
