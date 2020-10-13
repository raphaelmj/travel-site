import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MenusService } from './menus.service';
import { Observable } from 'rxjs';

import { Menu } from '../../models/menu';

@Injectable({
  providedIn: 'root'
})
export class MenusResolveService implements Resolve<Menu> {

  constructor(private menuService: MenusService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Menu> {
    return this.menuService.getMenuWithLinks()
  }

}
