import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FileListService } from './file-list.service';

@Injectable({
  providedIn: 'root'
})
export class FilesListResolveService implements Resolve<Array<string>>{

  constructor(private fileListService: FileListService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<string>> {
    return this.fileListService.listFolder('logotypes')
  }
}
