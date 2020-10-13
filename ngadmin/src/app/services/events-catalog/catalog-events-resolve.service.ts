import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Catalog } from 'src/app/models/catalog';
import { TourEvent } from 'src/app/models/tour-event';
import { Observable } from 'rxjs';
import { TourEventService } from './tour-event.service';
import { QueryParams, TourEventStatus } from 'src/app/models/query-params';

@Injectable({
  providedIn: 'root'
})
export class CatalogEventsResolveService implements Resolve<{ qp: QueryParams, events: TourEvent[], catalog: Catalog, total: number }> {

  constructor(private tourEventService: TourEventService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): { qp: QueryParams, events: TourEvent[], catalog: Catalog, total: number } | Observable<{ qp: QueryParams, events: TourEvent[], catalog: Catalog, total: number }> {

    let qp: QueryParams = {
      limit: (route.queryParams.limit) ? route.queryParams.limit : 20,
      page: (route.queryParams.limit) ? route.queryParams.page : 1,
      status: (route.queryParams.status) ? (route.queryParams.status) : TourEventStatus.all,
      sezon: (route.queryParams.sezon) ? route.queryParams.sezon : 'all',
      type: (route.queryParams.type) ? route.queryParams.type : 'all',
      numberPhrase: (route.queryParams.numberPhrase) ? route.queryParams.numberPhrase : '',
      // regions: (route.queryParams.regions) ? route.queryParams.type : 'all',
      // cities: (route.queryParams.cities) ? route.queryParams.cities : 'all',
      // attractions: (route.queryParams.attractions) ? route.queryParams.attractions : 'all',
      // themes: (route.queryParams.themes) ? route.queryParams.themes : 'all',
      // ages: (route.queryParams.ages) ? route.queryParams.ages : 'all',
      // days: (route.queryParams.days) ? route.queryParams.days : 'all'
    }

    return this.tourEventService.getCatalogEventsQuery(qp, route.params.id)
  }
}
