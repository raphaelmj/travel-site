import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Institution } from 'src/app/models/institution';
import { Observable } from 'rxjs';
import { InstitutionService } from './institution.service';

@Injectable({
  providedIn: 'root'
})
export class InstitutionResolveService implements Resolve<Institution[]> {

  constructor(private institutionService: InstitutionService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Institution[] | Observable<Institution[]> | Promise<Institution[]> {
    return this.institutionService.getInstitutions()
  }
}
