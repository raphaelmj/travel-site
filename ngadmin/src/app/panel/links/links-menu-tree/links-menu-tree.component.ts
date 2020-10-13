import { Component, OnInit, Input, Output, EventEmitter, Type, ComponentRef, ViewContainerRef, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Link } from 'src/app/models/link';
import { MenusService } from 'src/app/services/menu/menus.service';
import { LinksService } from 'src/app/services/links/links.service';
import { RefreshMenuService } from 'src/app/services/refresh-menu.service';
import { ConfirmDoubleWindowComponent } from 'src/app/tools/confirm-double-window/confirm-double-window.component';



interface LinksFlatNode {
  expandable?: boolean;
  linkId: number;
  name: string;
  level: number;
  id: number;
  ordering: any;
  isFirst: boolean;
  isLast: boolean;
  editLink: boolean;
}

@Component({
  selector: 'app-links-menu-tree',
  templateUrl: './links-menu-tree.component.html',
  styleUrls: ['./links-menu-tree.component.less']
})
export class LinksMenuTreeComponent implements OnInit {

  @Input() links: Link[]
  @Output() emitChangeTreeData: EventEmitter<any> = new EventEmitter()
  @Output() emitOpenViewEdit: EventEmitter<any> = new EventEmitter()
  @Output() emitRemoveLink: EventEmitter<any> = new EventEmitter()

  @ViewChild('popUpTemp', { read: ViewContainerRef, static: true }) popUpT: ViewContainerRef;
  doubleConfirmPopup: ComponentRef<ConfirmDoubleWindowComponent>


  linksC: Link[]
  flatNodeMap = new Map<LinksFlatNode, Link>();
  nestedNodeMap = new Map<Link, LinksFlatNode>();

  private transformer = (node: Link, level: number) => {

    const flatNode: LinksFlatNode = {
      expandable: !!node.children && node.children.length > 0,
      linkId: node.linkId,
      name: node.title,
      level: level,
      id: node.id,
      ordering: node.ordering,
      isFirst: node.isFirst,
      isLast: node.isLast,
      editLink: (node.editLink) ? node.editLink : false
    };
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode)
    return flatNode;
  }


  treeControl = new FlatTreeControl<LinksFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: LinksFlatNode) => node.expandable;
  hasNoContent = (_: number, _nodeData: LinksFlatNode) => _nodeData.name === '';

  constructor(private menusService: MenusService, private linksService: LinksService, private componentFactory: ComponentFactoryResolver) { }

  ngOnInit() {

    this.dataSource.data = this.links;
    this.treeControl.expandAll()
  }


  addNewItem(node: LinksFlatNode) {


    const parentNode = this.flatNodeMap.get(node);

    const newNode: Link = {
      id: null,
      linkId: node.id,
      title: 'Pusty Link',
      editLink: true
    }
    if (parentNode.children == undefined) {
      parentNode.children = []
    }
    parentNode.children.map((c, i) => {
      parentNode.children[i].isLast = false;
    })

    parentNode.children.push(newNode)
    this.dataSource.data = this.links;
    this.treeControl.expandAll()
  }

  addEmptyItemAsRoot() {

    const newNode: Link = {
      id: null,
      linkId: null,
      title: 'Pusty Link',
      editLink: true
    }

    this.links.unshift(newNode)
    this.dataSource.data = this.links;

  }

  putTop(level, id) {

    this.linksC = []
    this.findLinkLevelCollection(level, id, this.links, 0);

    var data: Link[] = Object.assign([], this.linksC)
    var place = 0;

    this.linksC.map((l, i) => {
      if (l.id == id) {
        place = i;
      }
    })

    if (place != 0) {
      data[place - 1] = Object.assign({}, this.linksC[place])
      data[place] = Object.assign({}, this.linksC[place - 1])
    }
    // console.log('data',data)

    // console.log(data)
    this.menusService.setOrderInBranch(data, 'top').then((res) => {
      // console.log('sort',res)
      // this. updateTreeAfterEvent();
      this.emitChangeTreeData.emit()
    });

  }

  putBottom(level, id) {

    this.linksC = []
    this.findLinkLevelCollection(level, id, this.links, 0);

    var data: Link[] = Object.assign([], this.linksC)
    var place = 0;

    this.linksC.map((l, i) => {
      if (l.id == id) {
        place = i;
      }
    })

    if (place < (this.linksC.length - 1)) {
      data[place + 1] = Object.assign({}, this.linksC[place])
      data[place] = Object.assign({}, this.linksC[place + 1])
    }

    // console.log('data',data)

    this.menusService.setOrderInBranch(data, 'top').then((res) => {
      // console.log('sort',res)
      // this. updateTreeAfterEvent();
      this.emitChangeTreeData.emit()
    });

  }



  findLinkLevelCollection(level: number, id: number, links: Link[], counter: number) {


    if (counter == level) {


      if (this.checkIsInCollection(links, id)) {

        this.linksC = links;

      }

    } else {

      counter++
      links.forEach(res => {

        this.findLinkLevelCollection(level, id, res['children'], counter)

      })

    }


  }

  checkIsInCollection(coll: Link[], id: number) {
    var bool = false;
    coll.map(res => {
      if (id == res.id) {
        bool = true;
      }
    })
    return bool;
  }

  addNewItemToBase($event) {
    console.log($event)
    this.linksService.createNewLink($event.value, $event.backBundleData).then(res => {
      this.emitChangeTreeData.emit()
    })
  }

  editItemInBase($event) {
    // console.log($event)
  }

  editCategory(node) {
    this.emitOpenViewEdit.emit(node)
  }

  removeCategory(node) {
    this.emitRemoveLink.emit(node)
  }


  removeLink(node: LinksFlatNode) {
    this.popUpT.clear()
    var conf = this.componentFactory.resolveComponentFactory(<Type<ConfirmDoubleWindowComponent>>ConfirmDoubleWindowComponent)
    this.doubleConfirmPopup = <ComponentRef<ConfirmDoubleWindowComponent>>this.popUpT.createComponent(conf)
    this.doubleConfirmPopup.instance.showConfirm = true;
    this.doubleConfirmPopup.instance.message = 'Czy checesz usunąć link? <br>Jeżeli tak, w jakim wariancie: <br>WSZYSTKO(wraz linkami podrzędnymi), <br>JEDEN(tylko usuwany - podrzędne przechodzą na wyższy level)';
    this.doubleConfirmPopup.instance.btnTextOne = 'WSZYSTKO'
    this.doubleConfirmPopup.instance.btnTextTwo = 'JEDEN';
    this.doubleConfirmPopup.instance.backBundleData = node;
    this.doubleConfirmPopup.instance.emitActionConfirmForget.subscribe(d => {
      this.doubleConfirmPopup.destroy()
      this.popUpT.clear()
    })
    this.doubleConfirmPopup.instance.emitActionConfirmOne.subscribe(d => {
      let link: Link = {
        id: d.backBundleData.id,
        linkId: d.backBundleData.linkId,
        title: d.backBundleData.name
      }
      this.linksService.removeLinkReafactorTree(link, 'ALL').then(r => {
        this.doubleConfirmPopup.destroy()
        this.popUpT.clear()
        this.emitChangeTreeData.emit()
      })
    })
    this.doubleConfirmPopup.instance.emitActionConfirmTwo.subscribe(d => {
      let link: Link = {
        id: d.backBundleData.id,
        linkId: d.backBundleData.linkId,
        title: d.backBundleData.name
      }
      this.linksService.removeLinkReafactorTree(link, 'ONE').then(r => {
        this.doubleConfirmPopup.destroy()
        this.popUpT.clear()
        this.emitChangeTreeData.emit()
      })
    })
  }

  removeEmptyNode(node: LinksFlatNode) {
    this.emitChangeTreeData.emit()
  }

  changeParent(node: LinksFlatNode) {
    // console.log(node)
  }


  editLink(node) {
    // console.log(node)
    this.emitOpenViewEdit.emit(node)

  }

}
