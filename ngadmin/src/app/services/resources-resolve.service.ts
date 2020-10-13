import { Injectable } from '@angular/core';
import { ResourcesService } from './resources.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourcesResolveService implements Resolve<Array<any>>{

  constructor(private resorcesService: ResourcesService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<any>> {
    return this.resorcesService.getDataResources()
  }

}
