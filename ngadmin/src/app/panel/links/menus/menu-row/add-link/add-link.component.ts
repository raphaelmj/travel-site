import { Component, OnInit, Output, EventEmitter, Input, AfterContentInit } from '@angular/core';
import { Link } from 'src/app/models/link';
import { Menu } from 'src/app/models/menu';
import { from, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenusService } from 'src/app/services/menu/menus.service';
import { RefreshMenuService } from 'src/app/services/refresh-menu.service';

@Component({
  selector: 'app-add-link',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.less']
})
export class AddLinkComponent implements OnInit, AfterContentInit {

  @Output() emitCloseAdd: EventEmitter<any> = new EventEmitter()
  @Input() linksBase: Observable<Link>;
  @Input() links: Observable<Link>;
  @Input() linksAddedId: number[];
  @Input() menu: Menu;
  link: Link;
  data: Link[] = []
  addType: string;
  searchPhrase: string;
  link_title: string;

  constructor(private menuService: MenusService, private refreshmenuService: RefreshMenuService) {
    this.addType = 'new'
    this.searchPhrase = '';
    this.link_title = '';
  }

  ngOnInit() {

  }

  ngAfterContentInit(): void {
    this.links.subscribe(d => {
      this.data.push(d)
    })
    this.createListLinksData()
  }

  changeType(type) {
    // console.log(type)
    this.addType = type;
  }

  closeEdit() {
    this.emitCloseAdd.emit()
  }

  caseInsensitiveSearch(str: string, searchStr: string): boolean {
    return new RegExp(searchStr, "i").test(str)
  }

  onKeyLink($event) {
    this.link_title = $event.target.value;
    // console.log(this.link_title)
  }

  onKey($event) {
    this.searchPhrase = $event.target.value;
    this.createListLinksData();

  }

  createListLinksData() {
    this.data = []
    this.links = this.linksBase.pipe(
      filter(d => {
        var bool = true;
        this.linksAddedId.map(id => {
          if (id == d.id) {
            bool = false;
          }
        })
        return this.caseInsensitiveSearch(d.title, this.searchPhrase) && bool;
      })
    )
    this.links.subscribe(data => {
      this.data.push(data)
    })
  }

  selectLinkToAdd(item) {
    this.link = item;
    // this.addLinkToMenu()
  }


  addNewLinkToMenu() {
    this.menuService.addNewLinkToMenu(this.menu.id, this.link_title).then(res => {
      this.refreshmenuService.makeRefresh()
    })
  }


  addLinkToMenu() {
    this.menuService.addLinkToMenu(this.menu.id, this.link).then(res => {
      this.linksAddedId.push(this.link.id)
      this.refreshmenuService.makeRefresh()
      this.createListLinksData()
    })
  }

}
