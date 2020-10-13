import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { InsuranceFormComponent } from './insurance-form/insurance-form.component';
import { FindEventComponent } from './find-event/find-event.component';
import { ServicesModule } from './services/services.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from "@angular/forms"
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha';
import { CAPTACHA_WEB_KEY } from './config';
import { ToolsModule } from './tools/tools.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  declarations: [
    AppComponent,
    InvoiceFormComponent,
    InsuranceFormComponent,
    FindEventComponent
  ],
  imports: [
    BrowserModule,
    ServicesModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    RecaptchaV3Module,
    RecaptchaModule,
    RecaptchaFormsModule,
    ToolsModule
  ],
  providers: [{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  },
  { provide: RECAPTCHA_V3_SITE_KEY, useValue: CAPTACHA_WEB_KEY },],
  bootstrap: [AppComponent]
})
export class AppModule { }
