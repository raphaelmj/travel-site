import { Injectable } from '@angular/core';
import { Link } from '../../models/link';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LinksService } from './links.service';

@Injectable({
  providedIn: 'root'
})
export class LinksResolveService implements Resolve<Link> {

  constructor(private linksService:LinksService) { }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Link>{
    return this.linksService.getLinksTree();
  }

}
