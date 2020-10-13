import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelRoutingModule } from './panel-routing.module';
import { PanelComponent } from './panel.component';
import { LinksModule } from './links/links.module';
import { PipesModule } from '../pipes/pipes.module';



@NgModule({
  declarations: [PanelComponent],
  imports: [
    CommonModule,
    PanelRoutingModule,
    LinksModule,
    PipesModule
  ],
})
export class PanelModule { }
