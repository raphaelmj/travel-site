import { Component, OnInit, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Inject, ViewChild, Type, OnDestroy } from '@angular/core';
import { PartnerAddEditComponent } from './partner-add-edit/partner-add-edit.component';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Partner } from 'src/app/models/partner';
import Sortable, { MultiDrag, Swap } from 'sortablejs';
import { Subscription } from 'rxjs';
import { PartnerService } from 'src/app/services/partners/partner.service';
import { RefreshPartnersService } from 'src/app/services/refresh-partners.service';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.less']
})
export class PartnersComponent implements OnInit, OnDestroy {

  @ViewChild('editTemp', { read: ViewContainerRef, static: true }) editTemp: ViewContainerRef
  editAddC: ComponentRef<PartnerAddEditComponent>
  @ViewChild('remove', { read: ViewContainerRef, static: true }) removeTemp: ViewContainerRef;
  confirmC: ComponentRef<ConfirmWindowComponent>


  partners: Partner[]
  sortable: Sortable
  subRefresh: Subscription
  subPartners: Subscription

  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private cf: ComponentFactoryResolver,
    private partnerService: PartnerService,
    private refereshPartnersService: RefreshPartnersService
  ) {
    this.partners = this.activatedRoute.snapshot.data['partners']
  }

  ngOnInit() {
    this.subRefresh = this.refereshPartnersService.refresh$.subscribe(r => {
      this.subPartners = this.partnerService.getPartners().subscribe(p => {
        this.partners = p
      })
    })
    this.createSortable()
  }


  createSortable() {

    this.sortable = new Sortable(this.document.getElementById('sortP'), {

      // Element dragging ended
      onEnd: function (/**Event*/evt) {
        // console.log(evt.oldIndex, evt.newIndex)
        var element = this.partners[evt.oldIndex];
        this.partners.splice(evt.oldIndex, 1);
        this.partners.splice(evt.newIndex, 0, element);
        this.changeOrder()
      }.bind(this)

    })
  }


  addPartner() {
    this.editTemp.clear()
    this.removeTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<PartnerAddEditComponent>>PartnerAddEditComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = true
    this.editAddC.instance.partner = this.partnerService.createEmpty()
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })

  }


  openEdit(partner: Partner) {
    this.editTemp.clear()
    this.removeTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<PartnerAddEditComponent>>PartnerAddEditComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = false
    this.editAddC.instance.partner = partner
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })
  }


  startDelete(partner: Partner) {
    this.editTemp.clear()
    this.removeTemp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.removeTemp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = partner.id
    this.confirmC.instance.message = 'Czy checesz usunąć element?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {
      // console.log(r)
      if (r.do) {
        this.deletePartner(r.bundleData)
        this.confirmC.destroy()
      } else {
        this.confirmC.destroy()
      }
    })
  }


  deletePartner(id: number) {
    this.partnerService.remove(id).then(r => {
      this.refereshPartnersService.makeRefresh()
    })
  }

  changeOrder() {
    this.partnerService.changeOrder(this.partners).then(r => {
      this.refereshPartnersService.makeRefresh()
    })
  }


  ngOnDestroy(): void {
    if (this.subRefresh)
      this.subRefresh.unsubscribe()
    if (this.subPartners)
      this.subPartners.unsubscribe()
  }



}
