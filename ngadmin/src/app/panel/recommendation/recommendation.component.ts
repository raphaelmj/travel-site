import { Component, OnInit, ViewContainerRef, ComponentRef, ViewChild, Inject, ComponentFactoryResolver, Type } from '@angular/core';
import { InstitutionEditAddComponent } from '../institutions/institution-edit-add/institution-edit-add.component';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';
import { Recommendation } from 'src/app/models/recommendation';
import Sortable, { MultiDrag, Swap } from 'sortablejs';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { RefreshRecommendationsService } from 'src/app/services/refresh-recommendations.service';
import { RecommendationService } from 'src/app/services/recommendations/recommendation.service';
import { RecommendationEditAddComponent } from './recommendation-edit-add/recommendation-edit-add.component';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.less']
})
export class RecommendationComponent implements OnInit {

  @ViewChild('editTemp', { read: ViewContainerRef, static: true }) editTemp: ViewContainerRef
  editAddC: ComponentRef<RecommendationEditAddComponent>
  @ViewChild('remove', { read: ViewContainerRef, static: true }) removeTemp: ViewContainerRef;
  confirmC: ComponentRef<ConfirmWindowComponent>

  recos: Recommendation[]
  sortable: Sortable
  subRefresh: Subscription
  subRecos: Subscription

  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private cf: ComponentFactoryResolver,
    private recoService: RecommendationService,
    private refreshRecommendationsService: RefreshRecommendationsService
  ) {
    this.recos = this.activatedRoute.snapshot.data['recos']
  }

  ngOnInit() {
    this.subRecos = this.refreshRecommendationsService.refresh$.subscribe(bool => {
      if (bool) {
        this.subRecos = this.recoService.getRecommendations().subscribe(recos => {
          this.recos = recos
        })
      }
    })
    this.createSortable()
  }


  createSortable() {

    this.sortable = new Sortable(this.document.getElementById('sortRecos'), {

      // Element dragging ended
      onEnd: function (/**Event*/evt) {
        // console.log(evt.oldIndex, evt.newIndex)
        var element = this.recos[evt.oldIndex];
        this.recos.splice(evt.oldIndex, 1);
        this.recos.splice(evt.newIndex, 0, element);
        this.changeRecoOrder()

      }.bind(this)

    })
  }


  addReco() {
    this.editTemp.clear()
    this.removeTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<RecommendationEditAddComponent>>RecommendationEditAddComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = true
    this.editAddC.instance.reco = this.recoService.createEmpty()
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })

  }


  openEdit(reco: Recommendation) {
    this.editTemp.clear()
    this.removeTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<RecommendationEditAddComponent>>RecommendationEditAddComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = false
    this.editAddC.instance.reco = reco
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })
  }


  startDelete(reco: Recommendation) {
    this.editTemp.clear()
    this.removeTemp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.removeTemp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = reco.id
    this.confirmC.instance.message = 'Czy checesz usunąć element?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {
      // console.log(r)
      if (r.do) {
        this.confirmC.destroy()
        this.deleteReco(r.bundleData)
      } else {
        this.confirmC.destroy()
      }
    })
  }


  deleteReco(id: number) {
    this.recoService.remove(id).then(r => {
      this.refreshRecommendationsService.makeRefresh()
    })
  }


  changeRecoOrder() {
    this.recoService.changeOrder(this.recos).then(r => {
      this.refreshRecommendationsService.makeRefresh()
    })
  }



}
