import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, Inject, ComponentFactoryResolver, Type, OnDestroy } from '@angular/core';
import { InstitutionEditAddComponent } from './institution-edit-add/institution-edit-add.component';
import { Subscription } from 'rxjs';
import Sortable, { MultiDrag, Swap } from 'sortablejs';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { InstitutionService } from 'src/app/services/institution/institution.service';
import { Institution } from 'src/app/models/institution';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';
import { RefreshInstService } from 'src/app/services/refresh-inst.service';

@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.less']
})
export class InstitutionsComponent implements OnInit, OnDestroy {

  @ViewChild('editTemp', { read: ViewContainerRef, static: true }) editTemp: ViewContainerRef
  editAddC: ComponentRef<InstitutionEditAddComponent>
  @ViewChild('remove', { read: ViewContainerRef, static: true }) removeTemp: ViewContainerRef;
  confirmC: ComponentRef<ConfirmWindowComponent>

  insts: Institution[]
  sortable: Sortable
  subRefresh: Subscription
  subInsts: Subscription

  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private cf: ComponentFactoryResolver,
    private institutionService: InstitutionService,
    private refreshInstService: RefreshInstService
  ) {
    this.insts = this.activatedRoute.snapshot.data['institutions']
  }

  ngOnInit() {
    this.subRefresh = this.refreshInstService.refresh$.subscribe(bool => {
      if (bool) {
        this.subInsts = this.institutionService.getInstitutions().subscribe(insts => {
          this.insts = insts
        })
      }
    })
    this.createSortable()
  }


  createSortable() {

    this.sortable = new Sortable(this.document.getElementById('sortInsts'), {

      // Element dragging ended
      onEnd: function (/**Event*/evt) {
        // console.log(evt.oldIndex, evt.newIndex)
        var element = this.insts[evt.oldIndex];
        this.insts.splice(evt.oldIndex, 1);
        this.insts.splice(evt.newIndex, 0, element);
        this.changeInstsOrder()

      }.bind(this)

    })
  }


  addInst() {
    this.editTemp.clear()
    this.removeTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<InstitutionEditAddComponent>>InstitutionEditAddComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = true
    this.editAddC.instance.inst = this.institutionService.createEmpty()
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })

  }


  openEdit(inst: Institution) {
    this.editTemp.clear()
    this.removeTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<InstitutionEditAddComponent>>InstitutionEditAddComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = false
    this.editAddC.instance.inst = inst
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })
  }


  startDelete(inst: Institution) {
    this.editTemp.clear()
    this.removeTemp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.removeTemp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = inst.id
    this.confirmC.instance.message = 'Czy checesz usunąć element?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {
      // console.log(r)
      if (r.do) {
        this.confirmC.destroy()
        this.deleteInst(r.bundleData)
      } else {
        this.confirmC.destroy()
      }
    })
  }

  deleteInst(id: number) {
    this.institutionService.remove(id).then(r => {
      this.refreshInstService.makeRefresh()
    })
  }

  changeInstsOrder() {
    this.institutionService.changeOrder(this.insts).then(r => {
      this.refreshInstService.makeRefresh()
    })
  }


  ngOnDestroy(): void {
    if (this.subRefresh)
      this.subRefresh.unsubscribe()

    if (this.subInsts)
      this.subInsts.unsubscribe()
  }


}
