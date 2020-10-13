import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { Link } from 'src/app/models/link';
import { API_URL } from 'src/app/config';
import { Menu } from 'src/app/models/menu';



@Injectable({
  providedIn: 'root'
})
export class LinksService {

  constructor(private httpClient: HttpClient) { }

  getLinksList(): Observable<Link> {
    return this.httpClient.get<Link>(API_URL + "/api/get/links");
  }

  getLinksListFlat(): Observable<Link[]> {
    return this.httpClient.get<Link[]>(API_URL + "/api/get/links");
  }

  getLinksListFull(): Observable<Link[]> {
    return this.httpClient.get<Link[]>(API_URL + "/api/get/links/full/data");
  }

  getLinksTree(): Observable<Link> {
    return this.httpClient.get<Link>(API_URL + "/api/get/links/tree");
  }

  createNewLink(title: string, linkId: number): Promise<any> {
    return this.httpClient.post(API_URL + "/api/create/new/link", { title: title, linkId: linkId }).toPromise()
  }

  // getLinkDataResource(id:number){
  //   return Observable.create(observer=>{
  //     fetch(API_URL+"/api/get/link/resource/"+id).then(response=>{
  //       return response
  //     }).then(response=>{
  //       observer.next(response)
  //       observer.complete()
  //     })

  //   })

  // }

  getLinkDataResource(id: number): Promise<any> {

    return this.httpClient.get(API_URL + "/api/get/link/resource/" + id).toPromise().then(res => {
      return res
    }).catch(err => {
      return err;
    })

  }

  updateLinkDataChangeInMenus(id: number, value: any[], type: string, menus: Menu[] | null) {
    return this.httpClient.post(API_URL + "/api/update/link/refactor/menus", {
      id: id,
      title: value['title'],
      path: value['path'],
      view: value['view'],
      metaDesc: value['metaDesc'],
      metaKeywords: value['metaKeywords'],
      metaTitle: value['metaTitle'],
      externalLink: value['externalLink'],
      linkedMenus: menus,
      type: type
    }).toPromise()
  }



  changeLinkType(id: number, data: any, type: string): Promise<any> {
    return this.httpClient.post(API_URL + "/api/change/link/type", {
      id: id,
      data: data,
      type: type
    }).toPromise()
  }


  removeLinkFromBase(id: number): Promise<any> {
    return this.httpClient.delete(API_URL + '/api/remove/link/' + id).toPromise()
  }

  removeLinkReafactorTree(link: Link, action: string): Promise<any> {
    return this.httpClient.post(API_URL + "/api/delete/link/recfactor", {
      link,
      action
    }).toPromise()
  }

  removeLinkFromMenu(linkId: number, menuId: number) {

    return this.httpClient.post(API_URL + "/api/menu/remove/link", {
      linkId: linkId,
      menuId: menuId
    }).toPromise()

  }

  updateLinkContent(content: string, id: number): Promise<any> {
    return this.httpClient.post(API_URL + '/api/update/link/content', { content, id }).toPromise()
  }

}
