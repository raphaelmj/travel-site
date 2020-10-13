import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Type, OnDestroy } from '@angular/core';
import { Age } from 'src/app/models/age';
import { EditAddAgeComponent } from './edit-add-age/edit-add-age.component';
import { AgeService } from 'src/app/services/filters/age.service';
import { RefreshAgesService } from 'src/app/services/refresh-ages.service';
import { Subscription } from 'rxjs';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';

@Component({
  selector: 'app-ages-edit',
  templateUrl: './ages-edit.component.html',
  styleUrls: ['./ages-edit.component.less']
})
export class AgesEditComponent implements OnInit, OnDestroy {

  @Input() ages: Age[]
  @ViewChild('editTemp', { read: ViewContainerRef, static: true }) editAdd: ViewContainerRef
  @ViewChild('confirm', { read: ViewContainerRef, static: true }) confirmTemp: ViewContainerRef
  confirmC: ComponentRef<ConfirmWindowComponent>

  editAddAgeC: ComponentRef<EditAddAgeComponent>
  subRefresh: Subscription
  subAges: Subscription

  constructor(private cf: ComponentFactoryResolver, private agesService: AgeService, private refreshAgesService: RefreshAgesService) { }

  ngOnInit() {
    this.subRefresh = this.refreshAgesService.refresh$.subscribe(bool => {
      if (bool) {
        this.subAges = this.agesService.getAll().subscribe(ages => {
          this.ages = ages
        })
      }
    })
  }

  addAge() {
    let edit = this.cf.resolveComponentFactory(<Type<EditAddAgeComponent>>EditAddAgeComponent)
    this.editAddAgeC = this.editAdd.createComponent(edit)
    this.editAddAgeC.instance.isNew = true
    this.editAddAgeC.instance.age = this.agesService.createEmpty()
    this.editAddAgeC.instance.emitClose.subscribe(d => {
      this.editAddAgeC.destroy()
    })

  }


  updateData(ag: Age) {
    let edit = this.cf.resolveComponentFactory(<Type<EditAddAgeComponent>>EditAddAgeComponent)
    this.editAddAgeC = this.editAdd.createComponent(edit)
    this.editAddAgeC.instance.isNew = false
    this.editAddAgeC.instance.age = ag
    this.editAddAgeC.instance.emitClose.subscribe(d => {
      this.editAddAgeC.destroy()
    })
  }

  beforeDelete(el: Age) {
    this.confirmTemp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.confirmTemp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = el
    this.confirmC.instance.message = 'Czy checesz usunąć przedział?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {
      if (r.do) {
        this.deleteElement(r.bundleData)
        this.confirmC.destroy()
      } else {
        this.confirmC.destroy()
      }
    })
  }

  deleteElement(el: Age) {
    this.agesService.delete(el.id).then(r => {
      console.log(r)
      this.refreshAgesService.makeRefresh()
    })
  }

  ngOnDestroy(): void {
    if (this.subRefresh)
      this.subRefresh.unsubscribe()

    if (this.subAges)
      this.subAges.unsubscribe()
  }

}
