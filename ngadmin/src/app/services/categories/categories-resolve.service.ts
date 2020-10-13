import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Category } from 'src/app/models/category';
import { CategoriesService } from './categories.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesResolveService implements Resolve<Category[]> {

  constructor(private categoriesService: CategoriesService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category[]> {
    return this.categoriesService.getCategories()
  }
}
