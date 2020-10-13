import { Component, OnInit, EventEmitter, Output, AfterContentChecked, Input } from '@angular/core';
import { UploadSimpleService } from './upload-simple.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-drop-files-simple',
  templateUrl: './drop-files-simple.component.html',
  styleUrls: ['./drop-files-simple.component.less']
})
export class DropFilesSimpleComponent implements OnInit, AfterContentChecked {

  files: File[] = [];
  filesUF: File[] = [];
  formData: FormData;
  @Input() folder: string = 'custom';
  @Output() emitFilesCollect: EventEmitter<Array<string>> = new EventEmitter()

  constructor(private uplaodSimpleService: UploadSimpleService, public HttpClient: HttpClient) { }

  ngOnInit() {
  }

  uploadFiles() {

    this.uplaodSimpleService.uploadFiles(this.formData, this.folder).subscribe(event => {

      if (event instanceof HttpResponse) {
        this.files = []
        this.filesUF = []
        // console.log(event.body);
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
