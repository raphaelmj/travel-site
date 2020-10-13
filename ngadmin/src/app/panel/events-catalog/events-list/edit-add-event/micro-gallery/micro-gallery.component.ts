import { Component, OnInit, Output, EventEmitter, Inject, Input } from '@angular/core';
import { UploadService } from 'src/app/tools/drop-files/upload.service';
import { DOCUMENT } from '@angular/common';
import Sortable from 'sortablejs';
import { API_URL } from 'src/app/config';
import { map, filter } from 'rxjs/operators';
import { from } from 'rxjs';
import { MicroGalleryImage } from 'src/app/models/tour-event';
import { HttpResponse } from '@angular/common/http';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-micro-gallery',
  templateUrl: './micro-gallery.component.html',
  styleUrls: ['./micro-gallery.component.less']
})
export class MicroGalleryComponent implements OnInit {

  @Input() galleryImages: MicroGalleryImage[] = []
  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Output() emitGalleryChange: EventEmitter<MicroGalleryImage[]> = new EventEmitter<MicroGalleryImage[]>()
  public files: NgxFileDropEntry[] = [];
  apiUrl: string = API_URL
  sortable: Sortable

  constructor(private uploadService: UploadService, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.createSortable()
  }


  closeEdit() {
    this.emitClose.emit()
  }


  createSortable() {

    this.sortable = new Sortable(this.document.getElementById('sortGallery'), {

      onEnd: function (/**Event*/evt) {
        var element = this.galleryImages[evt.oldIndex];
        this.galleryImages.splice(evt.oldIndex, 1);
        this.galleryImages.splice(evt.newIndex, 0, element);
        this.emitGalleryChange.emit(this.galleryImages)

      }.bind(this)

    })
  }

  dropped(files: NgxFileDropEntry[]) {

    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          let formData = new FormData()
          formData.append('file', file)
          this.uplaod(formData);

          // console.log(droppedFile.relativePath, file);


        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        // console.log(droppedFile.relativePath, fileEntry);
      }
    }

  }

  uplaod(formData: FormData) {
    this.uploadService.uploadFiles(formData).subscribe(event => {
      // console.log(event)
      if (event instanceof HttpResponse) {
        // console.log(event.body)
        event.body.map(img => {
          this.galleryImages.push(img)
        })
        this.emitGalleryChange.emit(this.galleryImages)
      }

    })
  }

  removeImage(i: number) {
    this.galleryImages.splice(i, 1);
    this.emitGalleryChange.emit(this.galleryImages)
  }

}
