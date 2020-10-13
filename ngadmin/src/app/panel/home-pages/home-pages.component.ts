import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, Inject, ComponentFactoryResolver, Type, OnDestroy } from '@angular/core';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';
import { HomePageEditAddComponent } from './home-page-edit-add/home-page-edit-add.component';
import { HomePage } from 'src/app/models/home-page';
import { Subscription } from 'rxjs';
import Sortable, { MultiDrag, Swap } from 'sortablejs';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { HomePageService } from 'src/app/services/home-pages/home-page.service';
import { RefreshHomePagesService } from 'src/app/services/refresh-home-pages.service';

@Component({
  selector: 'app-home-pages',
  templateUrl: './home-pages.component.html',
  styleUrls: ['./home-pages.component.less']
})
export class HomePagesComponent implements OnInit, OnDestroy {

  @ViewChild('editTemp', { read: ViewContainerRef, static: true }) editTemp: ViewContainerRef
  editAddC: ComponentRef<HomePageEditAddComponent>
  @ViewChild('remove', { read: ViewContainerRef, static: true }) removeTemp: ViewContainerRef;
  confirmC: ComponentRef<ConfirmWindowComponent>

  hps: HomePage[]
  sortable: Sortable
  subRefresh: Subscription
  subHPS: Subscription

  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private cf: ComponentFactoryResolver,
    private hpService: HomePageService,
    private refreshHomePagesService: RefreshHomePagesService
  ) {
    this.hps = this.activatedRoute.snapshot.data['hps']
  }


  ngOnInit() {
    this.subRefresh = this.refreshHomePagesService.refresh$.subscribe(bool => {
      if (bool) {
        this.subHPS = this.hpService.getHPS().subscribe(hps => {
          this.hps = hps
        })
      }
    })
    this.createSortable()
  }


  createSortable() {

    this.sortable = new Sortable(this.document.getElementById('sortHps'), {

      // Element dragging ended
      onEnd: function (/**Event*/evt) {
        // console.log(evt.oldIndex, evt.newIndex)
        var element = this.hps[evt.oldIndex];
        this.hps.splice(evt.oldIndex, 1);
        this.hps.splice(evt.newIndex, 0, element);
        this.changeOrder()

      }.bind(this)

    })
  }


  addHp() {
    this.editTemp.clear()
    this.removeTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<HomePageEditAddComponent>>HomePageEditAddComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = true
    this.editAddC.instance.hp = this.hpService.createEmpty()
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })

  }


  openEdit(hp: HomePage) {
    this.editTemp.clear()
    this.removeTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<HomePageEditAddComponent>>HomePageEditAddComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = false
    this.editAddC.instance.hp = hp
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })
  }


  startDelete(hp: HomePage) {
    this.editTemp.clear()
    this.removeTemp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.removeTemp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = hp.id
    this.confirmC.instance.message = 'Czy checesz usunąć element?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {
      // console.log(r)
      if (r.do) {
        this.confirmC.destroy()
        this.deleteHp(r.bundleData)
      } else {
        this.confirmC.destroy()
      }
    })
  }

  deleteHp(id: number) {
    this.hpService.remove(id).then(r => {
      // console.log(r)
      this.refreshHomePagesService.makeRefresh()
    })
  }

  changeOrder() {
    this.hpService.changeOrder(this.hps).then(r => {
      this.refreshHomePagesService.makeRefresh()
    })
  }


  ngOnDestroy(): void {
    if (this.subHPS)
      this.subHPS.unsubscribe()
    if (this.subRefresh)
      this.subRefresh.unsubscribe()
  }

}
