import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Recommendation } from 'src/app/models/recommendation';
import { Observable } from 'rxjs';
import { RecommendationService } from './recommendation.service';

@Injectable({
  providedIn: 'root'
})
export class RecommendationResolveService implements Resolve<Recommendation[]> {

  constructor(private recommService: RecommendationService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recommendation[] | Observable<Recommendation[]> | Promise<Recommendation[]> {
    return this.recommService.getRecommendations()
  }
}
