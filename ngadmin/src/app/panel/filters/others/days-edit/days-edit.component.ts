import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Type, OnDestroy } from '@angular/core';
import { Day } from 'src/app/models/day';
import { EditAddDayComponent } from './edit-add-day/edit-add-day.component';
import { DaysService } from 'src/app/services/filters/days.service';
import { RefreshDaysService } from 'src/app/services/refresh-days.service';
import { Subscription } from 'rxjs';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';

@Component({
  selector: 'app-days-edit',
  templateUrl: './days-edit.component.html',
  styleUrls: ['./days-edit.component.less']
})
export class DaysEditComponent implements OnInit, OnDestroy {

  @Input() days: Day[]
  @ViewChild('editTemp', { read: ViewContainerRef, static: true }) editAdd: ViewContainerRef
  editAddDayC: ComponentRef<EditAddDayComponent>
  @ViewChild('confirm', { read: ViewContainerRef, static: true }) confirmTemp: ViewContainerRef
  confirmC: ComponentRef<ConfirmWindowComponent>

  subRefresh: Subscription
  subDays: Subscription

  constructor(private cf: ComponentFactoryResolver, private daysService: DaysService, private refreshDaysService: RefreshDaysService) { }

  ngOnInit() {
    this.subRefresh = this.refreshDaysService.refresh$.subscribe(bool => {
      if (bool) {
        this.subDays = this.daysService.getAll().subscribe(days => {
          this.days = days
        })
      }
    })
  }


  addDay() {
    let edit = this.cf.resolveComponentFactory(<Type<EditAddDayComponent>>EditAddDayComponent)
    this.editAddDayC = this.editAdd.createComponent(edit)
    this.editAddDayC.instance.isNew = true
    this.editAddDayC.instance.day = this.daysService.createEmpty()
    this.editAddDayC.instance.emitClose.subscribe(d => {
      this.editAddDayC.destroy()
    })
  }

  updateData(d: Day) {
    let edit = this.cf.resolveComponentFactory(<Type<EditAddDayComponent>>EditAddDayComponent)
    this.editAddDayC = this.editAdd.createComponent(edit)
    this.editAddDayC.instance.isNew = false
    this.editAddDayC.instance.day = d
    this.editAddDayC.instance.emitClose.subscribe(d => {
      this.editAddDayC.destroy()
    })
  }

  beforeDelete(el: Day) {
    this.confirmTemp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.confirmTemp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = el
    this.confirmC.instance.message = 'Czy checesz usunąć dzień?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {
      if (r.do) {
        this.deleteElement(r.bundleData)
        this.confirmC.destroy()
      } else {
        this.confirmC.destroy()
      }
    })
  }

  deleteElement(el: Day) {
    this.daysService.delete(el.id).then(r => {
      console.log(r)
      this.refreshDaysService.makeRefresh()
    })
  }


  ngOnDestroy(): void {
    if (this.subRefresh)
      this.subRefresh.unsubscribe()

    if (this.subDays)
      this.subDays.unsubscribe()
  }

}
