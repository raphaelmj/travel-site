import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {UserService} from "../services/auth/user.service";
import { NavService } from '../services/auth/nav.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectIfAuthGuard implements CanActivate {


    constructor(private router : Router, private userService : UserService, private navService: NavService) {
    }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.isAuth().then((res)=>{

      if(res.success){
        this.navService.showNav()
        this.router.navigate(['/panel'])
      }else{
        this.navService.hideNav()
        return true;
      }
    })
  }
}
