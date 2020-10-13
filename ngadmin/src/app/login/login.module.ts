import { NgModule } from '@angular/core';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import {RouterModule} from "@angular/router";
import {LoginRoutingModule} from "./login-routing.module";
import {MatFormFieldModule,MatInputModule,MatProgressSpinnerModule} from "@angular/material";
import {ServicesModule} from "../services/services.module";
import {RedirectIfAuthGuard} from "../guards/redirect-if-auth.guard";


@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    LoginRoutingModule,
    NoopAnimationsModule,
    ServicesModule,
    RouterModule
  ],
  exports:[

  ],
  declarations: [LoginComponent],
  providers:[RedirectIfAuthGuard]
})
export class LoginModule { }
