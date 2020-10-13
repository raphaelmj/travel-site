import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, ViewContainerRef, ComponentRef, ViewChild, ComponentFactoryResolver, Type, AfterViewChecked, AfterContentChecked, AfterContentInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Link } from 'src/app/models/link';
import { LinksMenuTreeComponent } from './links-menu-tree/links-menu-tree.component';
import { Observable } from 'rxjs';
import { LinksService } from 'src/app/services/links/links.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { EditLinkComponent } from './edit-link/edit-link.component';
import { RefreshMenuService } from 'src/app/services/refresh-menu.service';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';

interface LinksFlatNode {
  expandable?: boolean;
  link_id: number;
  name: string;
  level: number;
  id: number;
  ordering: any;
  isFirst: boolean;
  isLast: boolean;
  editLink: boolean;
}

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.less']
})
export class LinksComponent implements OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked, AfterContentChecked, AfterContentInit {

  @ViewChild('editLink', { read: ViewContainerRef, static: true }) containerLinkEdit: ViewContainerRef
  componentEditLinkRef: ComponentRef<EditLinkComponent>
  links: Link[]
  resources: Observable<any[]>

  @ViewChild('treeLinks', { read: ViewContainerRef, static: true }) treeContainerRef: ViewContainerRef;
  linksMenuTreeComponent: ComponentRef<LinksMenuTreeComponent>

  @ViewChild('customTemplate', { read: ViewContainerRef, static: true }) customTemplate: ViewContainerRef;
  confirmWindow: ComponentRef<ConfirmWindowComponent>

  constructor(
    private activatedRoute: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private linksService: LinksService,
    private componentFactory: ComponentFactoryResolver,
    private refreshmenuService: RefreshMenuService) {
    this.links = this.activatedRoute.snapshot.data['links']
    this.resources = this.activatedRoute.snapshot.data['resources'];
  }

  ngOnInit() {
    this.refreshmenuService.refresh$.subscribe((bool) => {

      if (bool) {
        this.getLinksUpdateData().subscribe(res => {
          this.links = res;
          this.linksMenuTreeComponent.destroy()
          this.treeContainerRef.clear()
          this.showTree()
        })
      }

    })
  }

  ngAfterViewInit(): void {
    // this.linksRows.changes.subscribe((change)=>{
    //   // console.log(change);
    // })
  }


  ngAfterViewChecked(): void {
    // console.log('ngAfterViewChecked')
    // this.showTree()
  }


  ngAfterContentChecked(): void {
    // console.log('ngAfterArticleChecked')

  }


  ngAfterContentInit(): void {
    // console.log('ngAfterArticleInit')
    this.showTree()
  }


  showTree() {

    const tree = this.componentFactoryResolver.resolveComponentFactory(<Type<LinksMenuTreeComponent>>LinksMenuTreeComponent)
    this.linksMenuTreeComponent = <ComponentRef<LinksMenuTreeComponent>>this.treeContainerRef.createComponent(tree);
    this.linksMenuTreeComponent.instance.links = this.links

    this.linksMenuTreeComponent.instance.emitChangeTreeData.subscribe(() => {
      this.linksMenuTreeComponent.destroy()
      this.treeContainerRef.clear()
      this.getLinksUpdateData().subscribe(links => {
        // console.log(links)
        this.links = links;
        this.showTree()
      })
    })


    this.linksMenuTreeComponent.instance.emitOpenViewEdit.subscribe((node) => {

      this.createLinkActionsView(node);

    })

    this.linksMenuTreeComponent.instance.emitRemoveLink.subscribe((node) => {
      this.showConfirmWindow(node)
    })

  }


  getLinksUpdateData(): Observable<any> {
    return this.linksService.getLinksTree()
  }

  createLinkActionsView(node) {
    // console.log(node)
    this.linksService.getLinkDataResource(node.id).then(res => {
      // console.log(res)
      this.containerLinkEdit.clear()
      const edit = this.componentFactory.resolveComponentFactory(<Type<EditLinkComponent>>EditLinkComponent)
      this.componentEditLinkRef = <ComponentRef<EditLinkComponent>>this.containerLinkEdit.createComponent(edit)
      this.componentEditLinkRef.instance.linkId = node.id;
      this.componentEditLinkRef.instance.getLinkData(res);

    })


  }

  showConfirmWindow(node) {

    this.customTemplate.clear()
    const c = this.componentFactory.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmWindow = <ComponentRef<ConfirmWindowComponent>>this.containerLinkEdit.createComponent(c)
    this.confirmWindow.instance.message = 'Czy chcesz usnąć link?';
    this.confirmWindow.instance.showConfirm = true;
    this.confirmWindow.instance.bundleData = node;
    this.confirmWindow.instance.emitActionConfirm.subscribe(res => {
      if (res.do) {
        this.removeLink(res.bundleData.id)
      }
    })

  }

  removeLink(id) {
    this.linksService.removeLinkFromBase(id).then(res => {
      this.refreshmenuService.makeRefresh()
    })
  }

  drop(event: CdkDragDrop<Link[]>) {
    moveItemInArray(this.links, event.previousIndex, event.currentIndex);
  }



}
