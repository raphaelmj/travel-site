import { Component, OnInit, ComponentFactoryResolver, Inject, ViewChild, ComponentRef, ViewContainerRef, Type, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Catalog } from 'src/app/models/catalog';
import { API_URL } from 'src/app/config';
import { DOCUMENT } from '@angular/common';
import Sortable, { MultiDrag, Swap } from 'sortablejs';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';
import { CatalogAddEditComponent } from './catalog-add-edit/catalog-add-edit.component';
import { RefreshCatalogsService } from 'src/app/services/refresh-catalogs.service';
import { CatalogService } from 'src/app/services/events-catalog/catalog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events-catalog',
  templateUrl: './events-catalog.component.html',
  styleUrls: ['./events-catalog.component.less']
})
export class EventsCatalogComponent implements OnInit, OnDestroy {

  @ViewChild('editTemp', { read: ViewContainerRef, static: true }) editTemp: ViewContainerRef
  editAddC: ComponentRef<CatalogAddEditComponent>
  @ViewChild('remove', { read: ViewContainerRef, static: true }) removeTemp: ViewContainerRef;
  confirmC: ComponentRef<ConfirmWindowComponent>

  catalogs: Catalog[]
  apiUrl: string = API_URL
  sortable: Sortable

  subRefresh: Subscription
  subCatalogs: Subscription

  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private cf: ComponentFactoryResolver,
    private catalogService: CatalogService,
    private refreshCatalogsService: RefreshCatalogsService
  ) {
    this.catalogs = this.activatedRoute.snapshot.data['catalogs']
  }


  ngOnInit() {
    this.subRefresh = this.refreshCatalogsService.refresh$.subscribe(bool => {
      if (bool) {
        this.subCatalogs = this.catalogService.getCatalogs().subscribe(cs => {
          this.catalogs = cs
        })
      }
    })
    this.createSortable()
  }


  createSortable() {

    this.sortable = new Sortable(this.document.getElementById('sortCatalogs'), {

      // Element dragging ended
      onEnd: function (/**Event*/evt) {
        // console.log(evt.oldIndex, evt.newIndex)
        var element = this.catalogs[evt.oldIndex];
        this.catalogs.splice(evt.oldIndex, 1);
        this.catalogs.splice(evt.newIndex, 0, element);
        this.changeOrder()

      }.bind(this)

    })
  }

  openEdit(catalog: Catalog) {
    this.editTemp.clear()
    this.removeTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<CatalogAddEditComponent>>CatalogAddEditComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = false
    this.editAddC.instance.catalog = catalog
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })
  }


  addCatalog() {
    this.editTemp.clear()
    this.removeTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<CatalogAddEditComponent>>CatalogAddEditComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = true
    this.editAddC.instance.catalog = this.catalogService.createEmpty()
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })
  }


  changeOrder() {
    this.catalogService.changeOrder(this.catalogs).then(r => {
      this.refreshCatalogsService.makeRefresh()
    })
  }

  ngOnDestroy(): void {
    if (this.subRefresh)
      this.subRefresh.unsubscribe()
    if (this.subCatalogs)
      this.subCatalogs.unsubscribe()
  }

}
