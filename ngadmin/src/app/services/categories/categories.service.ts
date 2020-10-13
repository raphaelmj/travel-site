import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/models/category';
import { API_URL } from 'src/app/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private httpClient: HttpClient) {

  }

  getCategoryById(id: number): Promise<Category> {
    return this.httpClient.get<Category>(API_URL + "/api/get/category/" + id).toPromise();
  }

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(API_URL + "/api/get/categories")
  }

}
