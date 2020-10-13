import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Inject, OnDestroy, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Promo } from 'src/app/models/promo';
import { SlideEditAddComponent } from '../slides/slide-edit-add/slide-edit-add.component';
import { Subscription } from 'rxjs';
import Sortable, { MultiDrag, Swap } from 'sortablejs';
import { DOCUMENT } from '@angular/common';
import { PromoEditAddComponent } from './promo-edit-add/promo-edit-add.component';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';
import { PromoService } from 'src/app/services/promos/promo.service';
import { RefreshPromosService } from 'src/app/services/refresh-promos.service';

@Component({
  selector: 'app-promos',
  templateUrl: './promos.component.html',
  styleUrls: ['./promos.component.less']
})
export class PromosComponent implements OnInit, OnDestroy {


  @ViewChild('editTemp', { read: ViewContainerRef, static: true }) editTemp: ViewContainerRef
  editAddC: ComponentRef<PromoEditAddComponent>
  @ViewChild('remove', { read: ViewContainerRef, static: true }) removeTemp: ViewContainerRef;
  confirmC: ComponentRef<ConfirmWindowComponent>

  promos: Promo[]
  sortable: Sortable
  subRefresh: Subscription
  subPromos: Subscription


  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private cf: ComponentFactoryResolver,
    private promoService: PromoService,
    private refreshPromosService: RefreshPromosService
  ) {
    this.promos = this.activatedRoute.snapshot.data['promos']
  }

  ngOnInit() {

    this.subRefresh = this.refreshPromosService.refresh$.subscribe(bool => {
      if (bool) {
        this.subPromos = this.promoService.getPromos().subscribe(ps => {
          this.promos = ps
        })
      }
    })

    this.createSortable()
  }

  createSortable() {

    this.sortable = new Sortable(this.document.getElementById('sortPromos'), {

      // Element dragging ended
      onEnd: function (/**Event*/evt) {
        // console.log(evt.oldIndex, evt.newIndex)
        var element = this.promos[evt.oldIndex];
        this.promos.splice(evt.oldIndex, 1);
        this.promos.splice(evt.newIndex, 0, element);
        this.changePromosOrder()
      }.bind(this)

    })
  }


  addPromo() {
    this.editTemp.clear()
    this.removeTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<PromoEditAddComponent>>PromoEditAddComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = true
    this.editAddC.instance.promo = this.promoService.createEmpty()
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })

  }


  openEdit(promo: Promo) {
    this.editTemp.clear()
    this.removeTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<PromoEditAddComponent>>PromoEditAddComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = false
    this.editAddC.instance.promo = promo
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })
  }

  startDelete(promo: Promo) {
    this.editTemp.clear()
    this.removeTemp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.removeTemp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = promo.id
    this.confirmC.instance.message = 'Czy checesz usunąć element?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {
      // console.log(r)
      if (r.do) {
        this.confirmC.destroy()
        this.deletePromo(r.bundleData)
      } else {
        this.confirmC.destroy()
      }
    })
  }

  changePromosOrder() {
    this.promoService.changeOrder(this.promos).then(r => {
      this.refreshPromosService.makeRefresh()
    })
  }


  deletePromo(id: number) {

    this.promoService.remove(id).then(r => {
      this.refreshPromosService.makeRefresh()
    })
  }


  ngOnDestroy(): void {
    if (this.subRefresh)
      this.subRefresh.unsubscribe()

    if (this.subPromos)
      this.subPromos.unsubscribe()
  }


}
