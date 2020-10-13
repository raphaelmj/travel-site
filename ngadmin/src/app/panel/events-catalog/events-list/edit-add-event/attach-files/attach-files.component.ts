import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { OneFileUploadService } from 'src/app/services/one-file-upload.service';

@Component({
  selector: 'app-attach-files',
  templateUrl: './attach-files.component.html',
  styleUrls: ['./attach-files.component.less']
})
export class AttachFilesComponent implements OnInit {

  @ViewChild('filePdf', { read: ElementRef, static: true }) filePdf: ElementRef;
  @Output() emitAttachFile: EventEmitter<string> = new EventEmitter()

  constructor(private oneFileUploadService: OneFileUploadService) { }

  ngOnInit() {
  }


  handleFileInput(file: File, type: string) {
    this.oneFileUploadService.uploadFiles(file[0]).subscribe(event => {
      // console.log(event)
      if (event instanceof HttpResponse) {
        // console.log(event.body)
        if (event.body.typeFile == 'pdf') {
          this.filePdf.nativeElement.value = ''
          console.log(event.body.file)
          this.emitAttachFile.emit(event.body.file)
        }

      }
    })
  }


}
