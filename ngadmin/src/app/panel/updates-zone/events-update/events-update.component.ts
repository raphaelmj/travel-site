import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { FileSystemFileEntry, NgxFileDropEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { UploadUpdateService } from 'src/app/services/upload-update.service';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Catalog } from 'src/app/models/catalog';
import { Subscription } from 'rxjs';
import { BeforeStartEventUpdatesComponent } from './before-start-event-updates/before-start-event-updates.component';

@Component({
  selector: 'app-events-update',
  templateUrl: './events-update.component.html',
  styleUrls: ['./events-update.component.less']
})
export class EventsUpdateComponent implements OnInit, OnDestroy {

  @ViewChild('temp', { read: ViewContainerRef, static: true }) temp: ViewContainerRef
  beforeUpdate: ComponentRef<BeforeStartEventUpdatesComponent>

  folders: string[]
  catalogs: Catalog[]
  nowUploadFolder: string = null
  subFolders: Subscription

  constructor(
    private uploadUpdateService: UploadUpdateService,
    private activatedRoute: ActivatedRoute,
    private cf: ComponentFactoryResolver) {
    this.folders = this.activatedRoute.snapshot.data['folders']
    this.catalogs = this.activatedRoute.snapshot.data['catalogs']
  }


  ngOnInit() {

  }


  dropped(files: NgxFileDropEntry[]) {

    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          let formData = new FormData()
          formData.append('file', file)
          this.uplaod(formData)
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }
    }

  }

  uplaod(formData: FormData) {
    this.uploadUpdateService.uploadFiles(formData).subscribe(event => {
      // console.log(event)
      if (event instanceof HttpResponse) {
        console.log(event.body)
        this.nowUploadFolder = event.body
        this.getFolders()
      }

    })
  }

  getFolders() {
    this.subFolders = this.uploadUpdateService.getEventsUpdateFolders().subscribe(fls => {
      this.folders = fls
    })
  }


  removeFolder(f: string, clearNow: boolean) {
    if (clearNow) {
      this.nowUploadFolder = null
    }
    this.uploadUpdateService.removeEventFolder(f).then(r => {
      this.getFolders()
    })
  }

  startUpdate(f: string) {
    this.temp.clear()
    let cloud = this.cf.resolveComponentFactory(<Type<BeforeStartEventUpdatesComponent>>BeforeStartEventUpdatesComponent)
    this.beforeUpdate = this.temp.createComponent(cloud)
    this.beforeUpdate.instance.folder = f
    this.beforeUpdate.instance.catalogs = this.catalogs
    this.beforeUpdate.instance.emitClose.subscribe(r => {
      this.beforeUpdate.destroy()
    })
  }

  ngOnDestroy(): void {
    if (this.subFolders)
      this.subFolders.unsubscribe()
  }

}
