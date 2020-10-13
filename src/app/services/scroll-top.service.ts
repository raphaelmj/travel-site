import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollTopService {

  action$: BehaviorSubject<boolean> = new BehaviorSubject(false)

  constructor() { }

  scrollToTop() {
    this.action$.next(true)
  }

}
