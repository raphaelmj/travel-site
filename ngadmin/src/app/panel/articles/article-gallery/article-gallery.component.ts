import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import Sortable, { MultiDrag, Swap } from 'sortablejs';
import { DOCUMENT } from '@angular/common';
import { API_URL } from 'src/app/config';
import { MicroGalleryImage } from 'src/app/models/tour-event';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { HttpResponse } from '@angular/common/http';
import { UploadService } from 'src/app/tools/drop-files/upload.service';

@Component({
  selector: 'app-article-gallery',
  templateUrl: './article-gallery.component.html',
  styleUrls: ['./article-gallery.component.less']
})
export class ArticleGalleryComponent implements OnInit {

  @Input() saveOnChange: boolean = false;
  @Input() articleId: null | number = null;
  @Input() images: MicroGalleryImage[] = []
  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Output() emitChangeGallery: EventEmitter<MicroGalleryImage[]> = new EventEmitter()
  public files: NgxFileDropEntry[] = [];
  sortable: Sortable;
  apiUrl: string = API_URL;

  constructor(@Inject(DOCUMENT) private document: Document, private uploadService: UploadService) {

  }

  ngOnInit() {
    this.createSortable()
  }

  createSortable() {

    this.sortable = new Sortable(this.document.getElementById('sortGrid'), {


      // Element dragging ended
      onEnd: function (/**Event*/evt) {
        // console.log(evt.oldIndex, evt.newIndex)
        var element = this.images[evt.oldIndex];
        this.images.splice(evt.oldIndex, 1);
        this.images.splice(evt.newIndex, 0, element);
        this.emitGalleryChange.emit(this.images)

      }.bind(this)

    })
  }




  closeEdit() {
    this.emitClose.emit()
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
    this.uploadService.uploadFilesArts(formData).subscribe(event => {
      // console.log(event)
      if (event instanceof HttpResponse) {
        event.body.map(img => {
          this.images.push(img)
        })
        this.emitChangeGallery.emit(this.images)
      }

    })
  }


  removeImage(i: number) {
    this.images.splice(i, 1)
    this.emitChangeGallery.emit(this.images)
  }

}
