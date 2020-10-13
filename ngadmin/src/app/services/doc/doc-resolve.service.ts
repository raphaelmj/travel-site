import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DocQueryParams } from 'src/app/models/doc-query-params';
import { Doc } from 'src/app/models/doc';
import { Observable } from 'rxjs';
import { DocService } from './doc.service';

@Injectable({
  providedIn: 'root'
})
export class DocResolveService implements Resolve<{ dqp: DocQueryParams, docs: Doc[], total: number }> {

  constructor(private docService: DocService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): { dqp: DocQueryParams; docs: Doc[]; total: number; } | Observable<{ dqp: DocQueryParams; docs: Doc[]; total: number; }> | Promise<{ dqp: DocQueryParams; docs: Doc[]; total: number; }> {
    var dqp: DocQueryParams = {
      limit: (route.queryParams.limit) ? route.queryParams.limit : 20,
      page: (route.queryParams.page) ? route.queryParams.page : 1,
      type: (route.queryParams.type) ? route.queryParams.type : 'all',
      phrase: (route.queryParams.phrase) ? route.queryParams.phrase : ''
    }
    return this.docService.getDocs(dqp)
  }



}
