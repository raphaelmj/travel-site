import { Component, OnInit, Input, Inject } from '@angular/core';
import { Catalog } from 'src/app/models/catalog';
import { API_URL } from 'src/app/config';
import { PageScrollService } from 'ngx-page-scroll-core';
import { DOCUMENT } from '@angular/common';
import { ScrollTopService } from 'src/app/services/scroll-top.service';
import { Subscription } from 'rxjs';
// import { ScrollTopEmitService } from '../services/scroll-top-emit.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  @Input() catalog: Catalog
  @Input() menu: string[]
  apiUrl: string = API_URL
  isOpenMbMenu: boolean = false
  subScroll: Subscription

  constructor(private pageScrollService: PageScrollService,
    @Inject(DOCUMENT) private document: any, private scrollTopService: ScrollTopService) { }

  ngOnInit() {
    // console.log(this.menu)
    this.subScroll = this.scrollTopService.action$.subscribe(bool => {
      if (bool) {
        this.scrollToTop()
      }
    })
  }


  showHideMenu($event) {
    $event.preventDefault()
    this.isOpenMbMenu = !this.isOpenMbMenu
  }


  scrollToTop() {
    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: '#mainBanner',
      scrollOffset: 100
    });
  }

}
