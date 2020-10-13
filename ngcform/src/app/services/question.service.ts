import { Injectable } from '@angular/core';
import { API_URL } from '../config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private httpClient: HttpClient) { }

  sendQuestionData(data: any): Promise<any> {
    return this.httpClient.post(API_URL + '/api/question/send', data).toPromise()
  }

}
