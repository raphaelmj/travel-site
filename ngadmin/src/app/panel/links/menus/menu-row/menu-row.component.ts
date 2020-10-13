import { Component, OnInit, Input, AfterContentInit, ComponentRef, Type, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Menu } from 'src/app/models/menu';
import { MenusService } from 'src/app/services/menu/menus.service';
import { Link } from 'src/app/models/link';
import { TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';
import { EditLinkComponent } from '../../edit-link/edit-link.component';
import { Observable, from } from 'rxjs';
import { LinksService } from 'src/app/services/links/links.service';
import { RefreshMenuService } from 'src/app/services/refresh-menu.service';
import { AddLinkComponent } from './add-link/add-link.component';


@Component({
  selector: 'app-menu-row',
  templateUrl: './menu-row.component.html',
  styleUrls: ['./menu-row.component.less']
})
export class MenuRowComponent implements OnInit, AfterContentInit {

  @ViewChild('editLink', { read: ViewContainerRef, static: true }) containerLinkEdit: ViewContainerRef
  componentEditLinkRef: ComponentRef<EditLinkComponent>

  @ViewChild('addLink', { read: ViewContainerRef, static: true }) containerAddLink: ViewContainerRef
  componentAddlinkRef: ComponentRef<AddLinkComponent>

  @Input() menu: Menu;
  @Input() resources: Array<any>

  links: Link[]
  options: ITreeOptions = {
    displayField: 'title',
    isExpandedField: 'expanded',
    idField: 'uuid',
    hasChildrenField: 'nodes',
    actionMapping: {
      mouse: {
        click: (tree, node, $event) => {
          this.createLinkActionsView(node, tree)
        },
        dblClick: (tree, node, $event) => {
          if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
        }
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => {
          node.expandAll();
        }
      }
    },
    nodeHeight: 23,
    allowDrag: (node) => {
      // console.log('drag',node)
      return true;
    },
    allowDrop: (node) => {
      // console.log('drop',node)
      // this.saveTreeStruct();
      return true;
    },
    allowDragoverStyling: true,
    levelPadding: 30,
    useVirtualScroll: true,
    animateExpand: true,
    scrollOnActivate: true,
    animateSpeed: 30,
    animateAcceleration: 1.2,
    scrollContainer: document.documentElement // HTML
  }

  constructor(private menusService: MenusService, private componentFactory: ComponentFactoryResolver, private linksService: LinksService, private refreshmenuService: RefreshMenuService) {

  }

  ngOnInit() {

    this.refreshmenuService.refresh$.subscribe((bool) => {
      // console.log(bool)
      if (bool) {
        this.menusService.getMenu(this.menu.id).subscribe((res) => {
          // console.log(res.linksJson)
          this.links = res.linksJson;
          this.menu = res;
        })
      }

    })
  }


  ngAfterContentInit(): void {
    this.links = this.menu.linksJson;
  }


  saveTreeStruct() {
    let linksJson = JSON.stringify(this.menu.linksJson)
    this.menusService.setMenuField(this.menu.id, linksJson, 'linksJson').then(res => {
      // console.log(res)
    })
  }

  createLinkActionsView(node, tree) {
    // console.log(node.data)
    this.linksService.getLinkDataResource(node.data.id).then(res => {
      // console.log(res)
      this.containerLinkEdit.clear()
      const edit = this.componentFactory.resolveComponentFactory(<Type<EditLinkComponent>>EditLinkComponent)
      this.componentEditLinkRef = <ComponentRef<EditLinkComponent>>this.containerLinkEdit.createComponent(edit)

      this.componentEditLinkRef.instance.getLinkData(res);
      this.componentEditLinkRef.instance.menu = this.menu;
      this.componentEditLinkRef.instance.linkId = node.data.id;

      this.componentEditLinkRef.instance.emitDeleteFromMenu.subscribe(event => {
        this.deleteLinkFromMenu(event.link, event.menu);
      })

    }).catch(err => {
      // console.log(err)
    })


  }


  addLinkToMenu() {

    this.linksService.getLinksListFlat().subscribe(data => {

      const add = this.componentFactory.resolveComponentFactory(<Type<AddLinkComponent>>AddLinkComponent)
      this.componentAddlinkRef = <ComponentRef<AddLinkComponent>>this.containerAddLink.createComponent(add)
      this.componentAddlinkRef.instance.links = from(data);
      this.componentAddlinkRef.instance.linksBase = from(data);
      this.componentAddlinkRef.instance.menu = this.menu;
      this.componentAddlinkRef.instance.linksAddedId = this.flatMenuArray(this.menu.linksJson, []);
      this.componentAddlinkRef.instance.emitCloseAdd.subscribe(res => {
        this.componentAddlinkRef.destroy()
        this.containerAddLink.clear()
      })

    })



  }


  flatMenuArray(links: any[], array: any[] = []) {
    links.forEach((item) => {
      array.push(item.id)
      return this.flatMenuArray(item.children, array)
    })
    return array;
  }


  deleteLinkFromMenu(link: Link, menu: Menu) {
    this.linksService.removeLinkFromMenu(link.id, menu.id).then(res => {
      this.componentEditLinkRef.destroy()
      this.containerLinkEdit.clear()
      this.refreshmenuService.makeRefresh()
    })
  }

  cacheMenu() {
    this.menusService.cacheMenu(this.menu.id).then(res => {
      // console.log(res)
    })
  }

}
