import { Component, OnInit, Inject, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Slide } from 'src/app/models/slide';
import Sortable, { MultiDrag, Swap } from 'sortablejs';
import { DOCUMENT } from '@angular/common';
import { SlideEditAddComponent } from './slide-edit-add/slide-edit-add.component';
import { SlideService } from 'src/app/services/slide/slide.service';
import { RefreshSlidesService } from 'src/app/services/refresh-slides.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.less']
})
export class SlidesComponent implements OnInit, OnDestroy {

  @ViewChild('editTemp', { read: ViewContainerRef, static: true }) editTemp: ViewContainerRef
  editAddC: ComponentRef<SlideEditAddComponent>
  slides: Slide[]
  sortable: Sortable
  subRefresh: Subscription
  subSlides: Subscription

  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private cf: ComponentFactoryResolver,
    private slideService: SlideService,
    private refreshSlidesService: RefreshSlidesService) {
    this.slides = this.activatedRoute.snapshot.data['slides']
  }


  ngOnInit() {
    this.subRefresh = this.refreshSlidesService.refresh$.subscribe(bool => {
      if (bool) {
        this.subSlides = this.slideService.getSlides().subscribe(slides => {
          this.slides = slides
        })
      }
    })
    this.createSortable()
  }


  createSortable() {

    this.sortable = new Sortable(this.document.getElementById('sortSlides'), {

      // Element dragging ended
      onEnd: function (/**Event*/evt) {
        // console.log(evt.oldIndex, evt.newIndex)
        var element = this.slides[evt.oldIndex];
        this.slides.splice(evt.oldIndex, 1);
        this.slides.splice(evt.newIndex, 0, element);
        this.changeSlidesOrder()
      }.bind(this)

    })
  }


  addSlide() {
    let edit = this.cf.resolveComponentFactory(<Type<SlideEditAddComponent>>SlideEditAddComponent)
    this.editAddC = this.editTemp.createComponent(edit)
    this.editAddC.instance.isNew = true
    this.editAddC.instance.slide = this.slideService.createEmpty()
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })
  }


  ngOnDestroy(): void {
    if (this.subRefresh)
      this.subRefresh.unsubscribe()

    if (this.subSlides)
      this.subSlides.unsubscribe()
  }


  changeSlidesOrder() {
    this.slideService.changeSlidesOrder(this.slides).then(r => {
      this.refreshSlidesService.makeRefresh()
    })
  }


}
