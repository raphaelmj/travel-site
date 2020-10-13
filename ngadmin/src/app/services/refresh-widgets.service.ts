import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshWidgetsService {

  refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }


  makeRefresh() {
    this.refresh$.next(true);
  }

}
