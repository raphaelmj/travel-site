import { Injectable } from '@angular/core';
import { Link } from 'src/app/models/link';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root'
})
export class ContentsResolveService implements Resolve<Link[]> {

  constructor(private contentService: ContentService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Link[] | Observable<Link[]> | Promise<Link[]> {
    return this.contentService.getContents()
  }
}
