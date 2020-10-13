import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Widget, WidgetAliasType } from 'src/app/models/widget';
import { EditCertComponent } from './edit-cert/edit-cert.component';
import { EditCookieComponent } from './edit-cookie/edit-cookie.component';
import { EditInsurenceComponent } from './edit-insurence/edit-insurence.component';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { EditMapComponent } from './edit-map/edit-map.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';
import { RefreshWidgetsService } from 'src/app/services/refresh-widgets.service';
import { Subscription } from 'rxjs';
import { WidgetService } from 'src/app/services/wigdets/widget.service';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.less']
})
export class WidgetsComponent implements OnInit, OnDestroy {

  @ViewChild('popTemp', { read: ViewContainerRef, static: true }) popTemp: ViewContainerRef
  certC: ComponentRef<EditCertComponent>
  cookieC: ComponentRef<EditCookieComponent>
  insurnaceC: ComponentRef<EditInsurenceComponent>
  invoiceC: ComponentRef<EditInvoiceComponent>
  mapInfoC: ComponentRef<EditMapComponent>
  contactC: ComponentRef<EditContactComponent>
  widgets: Widget[]
  subRefresh: Subscription
  subWidgets: Subscription

  constructor(private activatedRoute: ActivatedRoute, private cf: ComponentFactoryResolver, private refreshWidgets: RefreshWidgetsService, private widgetService: WidgetService) {
    this.widgets = this.activatedRoute.snapshot.data['widgets']
  }

  ngOnInit() {
    this.subRefresh = this.refreshWidgets.refresh$.subscribe(bool => {
      if (bool) {
        this.subWidgets = this.widgetService.getWidgets().subscribe(ws => {
          this.widgets = ws
        })
      }
    })
  }

  showEdit(w: Widget) {
    this.showEditByType(w)
  }

  showEditByType(w: Widget) {
    switch (w.dataType) {
      case WidgetAliasType.cert:
        this.showEditCert(w)
        break
      case WidgetAliasType.cookie:
        this.showEditCookie(w)
        break
      case WidgetAliasType.insurnace:
        this.showEditInsurance(w)
        break
      case WidgetAliasType.invoice:
        this.showEditInvoice(w)
        break
      case WidgetAliasType.fcontact:
        this.showEditInvoice(w)
        break
      case WidgetAliasType.map_info:
        this.showEditMap(w)
        break
      case WidgetAliasType.contact:
        this.showEditContact(w)
        break
    }
  }

  showEditCert(w: Widget) {
    this.popTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<EditCertComponent>>EditCertComponent)
    this.certC = this.popTemp.createComponent(edit)
    this.certC.instance.widget = w
    this.certC.instance.emitClose.subscribe(c => {
      this.certC.destroy()
    })
  }

  showEditCookie(w: Widget) {
    this.popTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<EditCookieComponent>>EditCookieComponent)
    this.cookieC = this.popTemp.createComponent(edit)
    this.cookieC.instance.widget = w
    this.cookieC.instance.emitClose.subscribe(c => {
      this.cookieC.destroy()
    })
  }

  showEditInsurance(w: Widget) {
    this.popTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<EditInsurenceComponent>>EditInsurenceComponent)
    this.insurnaceC = this.popTemp.createComponent(edit)
    this.insurnaceC.instance.widget = w
    this.insurnaceC.instance.emitClose.subscribe(c => {
      this.insurnaceC.destroy()
    })
  }

  showEditInvoice(w: Widget) {
    this.popTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<EditInvoiceComponent>>EditInvoiceComponent)
    this.invoiceC = this.popTemp.createComponent(edit)
    this.invoiceC.instance.widget = w
    this.invoiceC.instance.emitClose.subscribe(c => {
      this.invoiceC.destroy()
    })
  }

  showEditMap(w: Widget) {
    this.popTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<EditMapComponent>>EditMapComponent)
    this.mapInfoC = this.popTemp.createComponent(edit)
    this.mapInfoC.instance.widget = w
    this.mapInfoC.instance.emitClose.subscribe(c => {
      this.mapInfoC.destroy()
    })
  }


  showEditContact(w: Widget) {
    this.popTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<EditContactComponent>>EditContactComponent)
    this.contactC = this.popTemp.createComponent(edit)
    this.contactC.instance.widget = w
    this.contactC.instance.emitClose.subscribe(c => {
      this.contactC.destroy()
    })
  }


  ngOnDestroy(): void {
    if (this.subRefresh)
      this.subRefresh.unsubscribe()
    if (this.subWidgets)
      this.subWidgets.unsubscribe()
  }


}
