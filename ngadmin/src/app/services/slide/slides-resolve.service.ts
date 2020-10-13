import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Slide } from 'src/app/models/slide';
import { Observable } from 'rxjs';
import { SlideService } from './slide.service';

@Injectable({
  providedIn: 'root'
})
export class SlidesResolveService implements Resolve<Slide[]> {

  constructor(private slideService: SlideService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Slide[] | Observable<Slide[]> | Promise<Slide[]> {
    return this.slideService.getSlides()
  }
}
