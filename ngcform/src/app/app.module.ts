import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FrontComponent } from './front/front.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FindEventComponent } from './front/find-event/find-event.component';
import { ServicesModule } from './services/services.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha';
import { CAPTACHA_WEB_KEY } from './config';
import { ToolsModule } from './tools/tools.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    FrontComponent,
    FindEventComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ServicesModule,
    PerfectScrollbarModule,
    RecaptchaV3Module,
    RecaptchaModule,
    RecaptchaFormsModule,
    ToolsModule
  ],
  providers: [{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
  },
  { provide: RECAPTCHA_V3_SITE_KEY, useValue: CAPTACHA_WEB_KEY },
    // {
    //   provide: RECAPTCHA_SETTINGS,
    //   useValue: { siteKey: CAPTACHA_WEB_KEY, size: 'normal' } as RecaptchaSettings,
    // },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
