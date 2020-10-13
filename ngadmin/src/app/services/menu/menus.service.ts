import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Menu } from '../../models/menu';
import { API_URL } from 'src/app/config';
import { Link } from '../../models/link';



@Injectable({
  providedIn: 'root'
})
export class MenusService {

  webUrl: string;

  constructor(private httpClient: HttpClient) {
    this.webUrl = API_URL
  }

  getMenuWithLinksRec(): Observable<Menu> {
    return this.httpClient.get<Menu>(this.webUrl + "/api/get/menus/full")
  }

  getMenuWithLinks(): Observable<Menu> {
    return this.httpClient.get<Menu>(this.webUrl + "/api/get/menus/flat/links")
  }

  getMenu(id: number): Observable<Menu> {
    return this.httpClient.get<Menu>(this.webUrl + "/api/get/menu/" + id)
  }

  getMenuLinksData(id: number): Observable<Link[]> {
    return this.httpClient.get<Link[]>(this.webUrl + "/api/get/menu/links/" + id)
  }


  setOrderInBranch(links: Link[], action: string): Promise<any> {
    return this.httpClient.post(this.webUrl + "/api/change/link/order", { links: links, action: action }).toPromise()
  }

  setMenuField(mid: number, value: any, field: string): Promise<any> {
    return this.httpClient.put(this.webUrl + "/api/update/menu/field/" + mid, { value: value, field: field }).toPromise()
  }

  addNewLinkToMenu(menuId: number, name: string) {
    return this.httpClient.post(this.webUrl + "/api/add/new/link/to/menu", { menuId: menuId, name: name }).toPromise()
  }


  addLinkToMenu(menuId: number, link: Link): Promise<any> {
    return this.httpClient.post(this.webUrl + "/api/add/link/to/menu", { menuId: menuId, link: link }).toPromise()
  }

  getMenuList(): Promise<Menu[]> {
    return this.httpClient.get<Menu[]>(this.webUrl + "/api/get/menus/list").toPromise();
  }

  cacheMenu(id: number): Promise<any> {
    return this.httpClient.post(this.webUrl + "/api/menu/requre/cache/" + id, {}).toPromise()
  }

}
