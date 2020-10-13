import { Component, OnInit, AfterContentChecked, Output, Input, EventEmitter } from '@angular/core';
import { from } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import {
  HttpClient, HttpClientModule, HttpRequest, HttpResponse, HttpEvent
} from "@angular/common/http"
import { UploadService } from './upload.service';


@Component({
  selector: 'app-drop-files',
  templateUrl: './drop-files.component.html',
  styleUrls: ['./drop-files.component.less']
})
export class DropFilesComponent implements OnInit, AfterContentChecked {

  files: File[] = [];
  filesUF: File[] = [];
  formData: FormData;
  @Output() emitFilesCollect: EventEmitter<any[]> = new EventEmitter()

  constructor(private uplaodService: UploadService, public HttpClient: HttpClient) { }

  ngOnInit() {

  }

  uploadFiles() {
    // this.formData.forEach(f => {

    // })
    this.uplaodService.uploadFiles(this.formData).subscribe(event => {

      if (event instanceof HttpResponse) {
        this.files = []
        this.filesUF = []
        this.emitFilesCollect.emit(event.body)
      }
    })
  }

  removeFileFromCollection(index) {
    this.files.splice(index, 1)
    this.filesUF.splice(index, 1)
  }


  ngAfterContentChecked() {
    from(this.files).pipe(
      filter(file => {
        var bool: boolean = true;
        this.filesUF.map(f => {
          if (f.name == file.name && f.type == file.type && f.size == file.size) {
            bool = false;
          }
        })
        // console.log(file.type)
        if (file.type != 'image/jpeg' && file.type != 'image/png') {
          bool = false;
        }
        return bool
      })
    ).subscribe(fileUnique => {
      this.filesUF.push(fileUnique);
    })
  }

}
