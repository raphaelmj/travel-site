import { Component, OnInit, Input, AfterContentInit, ComponentRef, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef, Output, EventEmitter, OnDestroy, ElementRef } from '@angular/core';
import { Link } from '../../../models/link';
import { LinksService } from '../../../services/links/links.service';
import { Observable, from } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import { API_URL } from 'src/app/config';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
import { ResourcesService } from 'src/app/services/resources.service';
import { EditLinkTypeComponent } from './edit-link-type/edit-link-type.component';
import { RefreshMenuService } from 'src/app/services/refresh-menu.service';
import { Menu } from 'src/app/models/menu';
import { MenusService } from 'src/app/services/menu/menus.service';
import { map, startWith, filter } from 'rxjs/operators';

@Component({
  selector: 'app-edit-link',
  templateUrl: './edit-link.component.html',
  styleUrls: ['./edit-link.component.less']
})
export class EditLinkComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input() linkId: number;
  @Output() emitDeleteFromMenu: EventEmitter<any> = new EventEmitter()
  linkData: any;
  link: Link;
  type: string;
  menu: Menu;


  domain: string;


  linkForm: FormGroup;

  @ViewChild('menuInput', { static: true }) menuInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  menus: Menu[] = [];
  menusCtrl = new FormControl();
  menusList: Menu[]
  filterMenus: Observable<Menu[]>


  @ViewChild('editLinkType', { read: ViewContainerRef, static: true }) editTypeRef: ViewContainerRef
  editComponent: ComponentRef<EditLinkTypeComponent>


  constructor(
    private linksService: LinksService,
    private menusService: MenusService,
    private resourcesService: ResourcesService,
    private formBuilder: FormBuilder,
    private componentFactory: ComponentFactoryResolver,
    private refreshmenuService: RefreshMenuService) {

    this.domain = API_URL;

  }



  ngOnInit() {

    this.linkForm = this.createLinkForm()
    this.linkForm.get('externalLink').valueChanges.subscribe(value => {
      this.link.externalLink = value;
    })
    this.refreshmenuService.refresh$.subscribe((bool) => {

      if (bool) {
        this.linksService.getLinkDataResource(this.linkId).then(res => {
          this.getLinkData(res);
        })
      }
    })

    this.menusService.getMenuList().then(ms => {
      // console.log(ms)
      // console.log(this.menus)
      this.menusList = ms;
      this.setMenusChips();

      this.filterMenus = this.menusCtrl.valueChanges.pipe(
        startWith(null),
        map((s: string | null | Menu) => s ? this._filter(s) : this.menusList.slice()),
      )



    })

  }

  private _filter(value: string | Menu): Menu[] {
    if (typeof value == 'string') {
      const filterValue = value.toLowerCase();
      return this.menusList.filter(m => m.name.toLowerCase().indexOf(filterValue) === 0);
    } else {
      const filterValue = value.name.toLowerCase();
      return this.menusList.filter(m => m.name.toLowerCase().indexOf(filterValue) === 0);
    }
  }


  add(event: MatChipInputEvent): void {

  }


  remove(menu: Menu): void {

    var index = -1
    this.menus.map((el, i) => {
      if (el.name == menu.name) {
        index = i
      }
    })

    if (index >= 0) {
      this.menusList.push(this.menus[index])
      this.menus.splice(index, 1);
    }

    this.setMenusChips();

  }

  changeCollectInput($event) {
    this.setMenusChips();
  }

  selected(event: MatAutocompleteSelectedEvent): void {

    this.menus.push(event.option.value);
    var index = -1;
    this.menusList.map((el, i) => {
      if (el.name == event.option.value.name) {
        index = i
      }
    })
    this.menusList.splice(index, 1)
    this.menuInput.nativeElement.value = '';
    this.menusCtrl.setValue(null);
  }


  ngAfterContentInit(): void {
    this.linkForm.get('title').setValue(this.link.title)
    this.linkForm.get('path').setValue(this.link.path)
    this.linkForm.get('metaTitle').setValue(this.link.metaTitle)
    this.linkForm.get('metaKeywords').setValue(this.link.metaKeywords)
    this.linkForm.get('metaDesc').setValue(this.link.metaDesc)
    this.linkForm.get('view').setValue(this.link.view)



    if (this.type == 'external-link') {
      this.linkForm.get('externalLink').setValue(this.link.externalLink)
      this.modifiyViewForExternal()
    }
  }

  setMenusChips() {
    if (this.link.Menus != null) {
      this.menus = this.link.Menus;
      this.menusList = this.menusList.filter(m => {
        var bool = true;
        this.menus.map(lm => {
          if (m.id == lm.id) {
            bool = false;
          }
        })
        return bool;
      })
    }
    this.filterMenus = this.menusCtrl.valueChanges.pipe(
      startWith(null),
      map((s: string | null | Menu) => s ? this._filter(s) : this.menusList.slice()),
    )
  }

  getLinkData(res) {

    // console.log(res)

    if (res.link)
      this.link = res.link;

    if (res.link.dataType)
      this.type = res.link.dataType;

    // console.log(this.type)

    if (res)
      this.linkData = res;

    this.delegateLinkData();
  }

  createLinkForm(): FormGroup {
    // console.log(this.link)
    return this.formBuilder.group({
      title: [this.link.title, Validators.required],
      path: [this.link.path, [Validators.pattern('^[0-9a-z\-/]+$')], this.checkIsPathCanAdd.bind(this)],
      metaTitle: [this.link.metaTitle],
      externalLink: [this.link.externalLink],
      view: [this.link.view],
      metaKeywords: [this.link.metaKeywords],
      metaDesc: [this.link.metaDesc]
    })
  }

  checkIsPathCanAdd(abstractControl: AbstractControl) {
    return this.resourcesService.checkIsPathFree(abstractControl.value, (this.link.path) ? this.link.path : '').then(res => {
      return res['bool'] ? null : { pathTaken: true };
    })
  }


  delegateLinkData() {
    console.log('EditLinComponet', this.type)

    switch (this.type) {

      case 'external-link':

        break;

      case 'blank':

        break;

      default:

        break;
    }
  }


  modifiyViewForExternal() {
    this.linkForm.get('path').clearAsyncValidators()
    this.linkForm.get('path').clearValidators()
    this.linkForm.get('metaTitle').disable()
    this.linkForm.get('metaDesc').disable()
    this.linkForm.get('metaKeywords').disable()
    this.linkForm.get('view').disable()
  }


  showLinkTypeEditPopUp() {
    // console.log(this.resArticle, this.resCategory)
    this.editTypeRef.clear()
    const edittype = this.componentFactory.resolveComponentFactory(<Type<EditLinkTypeComponent>>EditLinkTypeComponent)
    this.editComponent = <ComponentRef<EditLinkTypeComponent>>this.editTypeRef.createComponent(edittype)
    this.editComponent.instance.emitCloseSelect.subscribe(event => {
      this.editComponent.destroy()
    })
  }


  saveLinkData() {

    if (this.linkForm.valid) {
      // console.log(this.menus)
      this.linksService.updateLinkDataChangeInMenus(this.linkId, this.linkForm.value, this.type, this.menus).then(res => {
        // console.log(res)
        setTimeout(() => {
          this.refreshmenuService.makeRefresh()
        }, 1)

      })
    }

  }

  deleteFromMenu() {

    this.emitDeleteFromMenu.emit({ link: this.link, menu: this.menu })
  }


  ngOnDestroy(): void {
    // this.refreshmenuService.refresh$.unsubscribe()
  }

}
