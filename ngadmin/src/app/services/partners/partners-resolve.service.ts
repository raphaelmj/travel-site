import { Injectable } from '@angular/core';
import { Partner } from 'src/app/models/partner';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PartnerService } from './partner.service';

@Injectable({
  providedIn: 'root'
})
export class PartnersResolveService implements Resolve<Partner[]> {

  constructor(private partnerService: PartnerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Partner[] | Observable<Partner[]> | Promise<Partner[]> {
    return this.partnerService.getPartners()
  }
}
