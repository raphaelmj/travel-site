import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshThemesService {

  refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }


  makeRefresh() {
    this.refresh$.next(true);
  }

  noRefresh() {
    this.refresh$.next(false);
  }
}
