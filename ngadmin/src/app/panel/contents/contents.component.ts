import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type, OnDestroy } from '@angular/core';
import { Link } from 'src/app/models/link';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EditContentComponent } from './edit-content/edit-content.component';
import { RefreshContentLinksService } from 'src/app/services/refresh-content-links.service';
import { ContentService } from 'src/app/services/contents/content/content.service';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.less']
})
export class ContentsComponent implements OnInit, OnDestroy {

  @ViewChild('popTemp', { read: ViewContainerRef, static: true }) popTemp: ViewContainerRef
  contentC: ComponentRef<EditContentComponent>
  links: Link[]
  subRefresh: Subscription
  subLinks: Subscription

  constructor(private activatedRoute: ActivatedRoute, private cf: ComponentFactoryResolver, private refreshContentLinks: RefreshContentLinksService, private contentService: ContentService) {
    this.links = this.activatedRoute.snapshot.data['links']
  }

  ngOnInit() {
    this.subRefresh = this.refreshContentLinks.refresh$.subscribe(bool => {
      if (bool) {
        this.subLinks = this.contentService.getContents().subscribe(ls => {
          this.links = ls
        })
      }
    })
  }

  showEdit(l: Link) {
    this.popTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<EditContentComponent>>EditContentComponent)
    this.contentC = this.popTemp.createComponent(edit)
    this.contentC.instance.link = l
    this.contentC.instance.emitClose.subscribe(c => {
      this.contentC.destroy()
    })
  }

  ngOnDestroy(): void {
    if (this.subRefresh)
      this.subRefresh.unsubscribe
    if (this.subLinks)
      this.subLinks.unsubscribe()
  }


}
