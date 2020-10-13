import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Catalog } from 'src/app/models/catalog';
import { Observable } from 'rxjs';
import { CatalogService } from './catalog.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogsResolveService implements Resolve<Catalog[]> {

  constructor(private catalogService: CatalogService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Catalog[] | Observable<Catalog[]> | Promise<Catalog[]> {
    return this.catalogService.getCatalogs()
  }
}
