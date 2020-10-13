import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attachment } from 'src/app/models/attachment';
import { API_URL } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  constructor(private httpClient: HttpClient) { }


  getAttachments(): Observable<Attachment[]> {
    return this.httpClient.get<Attachment[]>(API_URL + '/api/get/attachments')
  }

  update(attachment: Attachment): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/attachment', { attachment }).toPromise()
  }


  create(attachment: Attachment) {
    return this.httpClient.post(API_URL + '/api/create/attachment', { attachment }).toPromise()
  }


  changeOrder(attachments: Attachment[]): Promise<any> {
    return this.httpClient.post(API_URL + '/api/change/attachments/order', attachments).toPromise()
  }


  changeStatus(id: number, status: boolean): Promise<any> {
    return this.httpClient.post(API_URL + '/api/change/attachment/status', { id, status }).toPromise()
  }


  remove(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + '/api/delete/attachment/' + id).toPromise()
  }

  createEmpty(): Attachment {
    return {
      groupName: "",
      files: [],
      status: false
    }
  }

}
