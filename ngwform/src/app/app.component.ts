import { Component, Inject } from '@angular/core';
import { API_URL } from './config';

declare const formType: string;
// const formType: string = 'insurance'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [
    { provide: Window, useValue: window }
  ],
})
export class AppComponent {
  constructor(@Inject(Window) window: Window) {

  }
  formType: string = formType
  apiUrl: string = API_URL
}
