import { Injectable } from '@angular/core';
import { HomePage } from 'src/app/models/home-page';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HomePageService } from './home-page.service';

@Injectable({
  providedIn: 'root'
})
export class HomePageResolveService implements Resolve<HomePage[]> {

  constructor(private hpService: HomePageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): HomePage[] | Observable<HomePage[]> | Promise<HomePage[]> {
    return this.hpService.getHPS()
  }
}
