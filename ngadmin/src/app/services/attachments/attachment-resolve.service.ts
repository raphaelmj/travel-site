import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Attachment } from 'src/app/models/attachment';
import { Observable } from 'rxjs';
import { AttachmentService } from './attachment.service';

@Injectable({
  providedIn: 'root'
})
export class AttachmentResolveService implements Resolve<Attachment[]> {

  constructor(private attachmentService: AttachmentService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Attachment[] | Observable<Attachment[]> | Promise<Attachment[]> {
    return this.attachmentService.getAttachments()
  }
}
