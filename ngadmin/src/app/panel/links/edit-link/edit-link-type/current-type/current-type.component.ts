import { Component, OnInit, Input } from '@angular/core';
import { LINK_TYPES } from 'src/app/link-types';


@Component({
  selector: 'app-current-type',
  templateUrl: './current-type.component.html',
  styleUrls: ['./current-type.component.less']
})
export class CurrentTypeComponent implements OnInit {

  @Input() linkData:any;
  linkTypes:Map<string,string>

  constructor() { 
    this.linkTypes = LINK_TYPES;
  }

  ngOnInit() {
  }

}
