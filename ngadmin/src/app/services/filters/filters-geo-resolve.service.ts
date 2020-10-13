import { Injectable } from '@angular/core';
import { Region } from 'src/app/models/region';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FilterService } from './filter.service';
import { City } from 'src/app/models/city';
import { Attraction } from 'src/app/models/attraction';

@Injectable({
  providedIn: 'root'
})
export class FiltersGeoResolveService implements Resolve<{ tree: Region[], freeCities: City[], freeAttractions: Attraction[] }>{

  constructor(private filterService: FilterService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ tree: Region[], freeCities: City[], freeAttractions: Attraction[] }> {
    return this.filterService.getGeoFilters()
  }


}
