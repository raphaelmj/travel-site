import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WidgetsGroup, Widget } from 'src/app/models/widget';
import { API_URL } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {

  constructor(private httpClient: HttpClient) { }


  getWidgetsGroup(): Observable<WidgetsGroup> {
    return this.httpClient.get<WidgetsGroup>(API_URL + '/api/get/widgets/group')
  }

  getWidgets(): Observable<Widget[]> {
    return this.httpClient.get<Widget[]>(API_URL + '/api/get/widgets')
  }

  updateWidget(widget: Widget): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/widget', { widget }).toPromise()
  }

  updateWidgetCert(widget: Widget, croppedImage: string): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/widget/cert', { widget, image: croppedImage }).toPromise()
  }

}
