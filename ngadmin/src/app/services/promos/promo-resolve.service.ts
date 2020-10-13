import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Promo } from 'src/app/models/promo';
import { Observable } from 'rxjs';
import { PromoService } from './promo.service';

@Injectable({
  providedIn: 'root'
})
export class PromoResolveService implements Resolve<Promo[]> {

  constructor(private promoService: PromoService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promo[] | Observable<Promo[]> | Promise<Promo[]> {
    return this.promoService.getPromos()
  }
}
