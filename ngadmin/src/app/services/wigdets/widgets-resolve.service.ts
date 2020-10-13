import { Injectable } from '@angular/core';
import { Widget } from 'src/app/models/widget';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WidgetService } from './widget.service';

@Injectable({
  providedIn: 'root'
})
export class WidgetsResolveService implements Resolve<Widget[]> {

  constructor(private widgetService: WidgetService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Widget[] | Observable<Widget[]> | Promise<Widget[]> {
    return this.widgetService.getWidgets()
  }
}
