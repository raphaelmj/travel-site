import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {UserService} from "../services/auth/user.service";
import { NavService } from '../services/auth/nav.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectIfNotauthGuard implements CanActivate {


    constructor(private router: Router, private authService : UserService, private navService: NavService) {

    }

    canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      return this.authService.isAuth().then((res)=>{

        if(!res.success){
          this.navService.hideNav()
          this.router.navigate(['/login']);
        }else{
          this.navService.showNav()
          return true;
        }

      });

  }
}
