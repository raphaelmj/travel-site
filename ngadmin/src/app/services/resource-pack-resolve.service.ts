import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ResourcePackResolveService implements Resolve<Observable<[]>>{

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[]> {
    return from([])
  }
}
