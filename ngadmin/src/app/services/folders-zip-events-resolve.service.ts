import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UploadUpdateService } from './upload-update.service';

@Injectable({
  providedIn: 'root'
})
export class FoldersZipEventsResolveService implements Resolve<string[]> {

  constructor(private uploadUpdateService: UploadUpdateService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string[] | Observable<string[]> | Promise<string[]> {
    return this.uploadUpdateService.getEventsUpdateFolders()
  }
}
