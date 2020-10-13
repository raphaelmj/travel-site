import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { WidgetsGroup } from '../models/widget';
import { Observable } from 'rxjs';
import { WidgetService } from './widget.service';


@Injectable({
  providedIn: 'root'
})
export class WidgetResolveService implements Resolve<WidgetsGroup> {

  constructor(private widgetService: WidgetService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WidgetsGroup> | Promise<WidgetsGroup> | WidgetsGroup {
    return this.widgetService.getWigetsGroup()
  }

}
