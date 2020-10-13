import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Link } from 'src/app/models/link';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CK_EDITOR_CONFIG } from 'src/app/config';
import { LinksService } from 'src/app/services/links/links.service';
import { RefreshContentLinksService } from 'src/app/services/refresh-content-links.service';

@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.less']
})
export class EditContentComponent implements OnInit {

  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Input() link: Link
  formEdit: FormGroup
  ckEditorConfig: any = CK_EDITOR_CONFIG;

  constructor(private fb: FormBuilder, private linkService: LinksService, private refreshContentLinks: RefreshContentLinksService) { }

  ngOnInit() {
    this.createForm()
  }

  createForm() {

    this.formEdit = this.fb.group({
      content: [this.link.content]
    })
  }

  closeEdit() {
    this.emitClose.emit()
  }

  saveData() {
    this.linkService.updateLinkContent(this.formEdit.get('content').value, this.link.id).then(r => {
      this.refreshContentLinks.makeRefresh()
    })
  }

}
