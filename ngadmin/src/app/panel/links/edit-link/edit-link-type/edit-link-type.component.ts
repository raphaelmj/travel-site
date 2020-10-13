import { Component, OnInit, Input, AfterContentInit, Output, EventEmitter, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type, ViewChild } from '@angular/core';
import { Observable, from } from 'rxjs';

import { Link } from 'src/app/models/link';
import { filter, map } from 'rxjs/operators';
import { LINK_TYPES } from 'src/app/link-types';
import { ExLinkFindComponent } from './data-find/ex-link-find/ex-link-find.component';
import { LinksService } from 'src/app/services/links/links.service';
import { RefreshMenuService } from 'src/app/services/refresh-menu.service';


@Component({
  selector: 'app-edit-link-type',
  templateUrl: './edit-link-type.component.html',
  styleUrls: ['./edit-link-type.component.less']
})
export class EditLinkTypeComponent implements OnInit, AfterContentInit {


  @Input() linkData: any;
  selectedType: string;
  customType: string = null;

  linkTypes: Map<string, string>;

  @Output() emitCloseSelect: EventEmitter<any> = new EventEmitter()

  @ViewChild('dataChangeFind', { read: ViewContainerRef, static: true }) dataChangeFind: ViewContainerRef;
  compExlink: ComponentRef<ExLinkFindComponent>

  constructor(private compFactory: ComponentFactoryResolver, private linkService: LinksService, private refreshmenuService: RefreshMenuService) {
    this.linkTypes = LINK_TYPES
  }

  ngOnInit() {
    // console.log(this.linkData)
  }

  inputDataFromParent(linkData: any) {

    this.linkData = linkData;
    this.selectedType = linkData.type;
    this.delegateEditLinkResources(linkData.type)
  }

  ngAfterContentInit(): void {

  }

  closeEdit() {
    this.emitCloseSelect.emit()
  }


  showEditTypeData(type: string) {
    this.customType = null;
    this.delegateEditLinkResources(type)
  }

  delegateEditLinkResources(t) {

    this.selectedType = t;

    switch (t) {

      case 'contact':
        this.dataChangeFind.clear()
        this.customType = 'contact'
        break;

      case 'external-link':
        this.showSetExLinkComponent()
        break;

    }
  }



  showSetExLinkComponent() {
    this.dataChangeFind.clear()
    const comp = this.compFactory.resolveComponentFactory<ExLinkFindComponent>(<Type<ExLinkFindComponent>>ExLinkFindComponent)
    this.compExlink = <ComponentRef<ExLinkFindComponent>>this.dataChangeFind.createComponent(comp);
    this.compExlink.instance.id = this.linkData.link.id;
  }

  saveType() {
    this.linkService.changeLinkType(this.linkData.link.id, null, this.customType).then(res => {
      setTimeout(() => {
        this.refreshmenuService.makeRefresh()
      }, 1)
    })
  }

}
