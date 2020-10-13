import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Type, OnDestroy } from '@angular/core';
import { Theme } from 'src/app/models/theme';
import { EditAddThemeComponent } from './edit-add-theme/edit-add-theme.component';
import { ThemeService } from 'src/app/services/filters/theme.service';
import { RefreshThemesService } from 'src/app/services/refresh-themes.service';
import { Subscription } from 'rxjs';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';

@Component({
  selector: 'app-themes-edit',
  templateUrl: './themes-edit.component.html',
  styleUrls: ['./themes-edit.component.less']
})
export class ThemesEditComponent implements OnInit, OnDestroy {

  @Input() themes: Theme[]
  @ViewChild('editTemp', { read: ViewContainerRef, static: true }) editAdd: ViewContainerRef
  editAddThemeC: ComponentRef<EditAddThemeComponent>
  @ViewChild('confirm', { read: ViewContainerRef, static: true }) confirmTemp: ViewContainerRef
  confirmC: ComponentRef<ConfirmWindowComponent>


  subRefresh: Subscription
  subThs: Subscription

  constructor(private cf: ComponentFactoryResolver, private themeService: ThemeService, private refreshThemesService: RefreshThemesService) { }


  ngOnInit() {
    this.subRefresh = this.refreshThemesService.refresh$.subscribe(bool => {
      if (bool) {
        this.subThs = this.themeService.getAll().subscribe(themes => {
          this.themes = themes
        })
      }
    })
  }


  addTheme() {
    let edit = this.cf.resolveComponentFactory(<Type<EditAddThemeComponent>>EditAddThemeComponent)
    this.editAddThemeC = this.editAdd.createComponent(edit)
    this.editAddThemeC.instance.isNew = true
    this.editAddThemeC.instance.theme = this.themeService.createEmpty()
    this.editAddThemeC.instance.emitClose.subscribe(d => {
      this.editAddThemeC.destroy()
    })
  }


  updateData(th: Theme) {
    let edit = this.cf.resolveComponentFactory(<Type<EditAddThemeComponent>>EditAddThemeComponent)
    this.editAddThemeC = this.editAdd.createComponent(edit)
    this.editAddThemeC.instance.isNew = false
    this.editAddThemeC.instance.theme = th
    this.editAddThemeC.instance.emitClose.subscribe(d => {
      this.editAddThemeC.destroy()
    })
  }


  beforeDelete(el: Theme) {
    this.confirmTemp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.confirmTemp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = el
    this.confirmC.instance.message = 'Czy checesz usunąć temat?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {
      if (r.do) {
        this.deleteElement(r.bundleData)
        this.confirmC.destroy()
      } else {
        this.confirmC.destroy()
      }
    })
  }

  deleteElement(el: Theme) {
    this.themeService.delete(el.id).then(r => {
      console.log(r)
      this.refreshThemesService.makeRefresh()
    })
  }


  ngOnDestroy(): void {
    if (this.subRefresh)
      this.subRefresh.unsubscribe()

    if (this.subThs)
      this.subThs.unsubscribe()
  }

}
