import { Component } from '@angular/core';
import { API_URL } from './config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  apiUrl: string = API_URL
}
