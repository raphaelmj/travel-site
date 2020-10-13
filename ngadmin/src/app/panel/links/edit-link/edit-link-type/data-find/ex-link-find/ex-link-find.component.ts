import { Component, OnInit, Input } from '@angular/core';
import { LinksService } from 'src/app/services/links/links.service';
import { RefreshMenuService } from 'src/app/services/refresh-menu.service';

@Component({
  selector: 'app-ex-link-find',
  templateUrl: './ex-link-find.component.html',
  styleUrls: ['./ex-link-find.component.less']
})
export class ExLinkFindComponent implements OnInit {

  external_link:string;
  @Input() id:number;
  type:string;

  constructor(private linkService:LinksService, private refreshmenuService:RefreshMenuService) { 
    this.external_link = ''
    this.type = 'external-link'
  }

  ngOnInit() {
  }

  saveType(){
    this.linkService.changeLinkType(this.id,this.external_link,this.type).then(res=>{
      setTimeout(()=>{
        this.refreshmenuService.makeRefresh()
      },1)
    })
  }

  onKey($event){

  }

}
