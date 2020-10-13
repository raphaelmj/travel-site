import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinksRoutingModule } from './links-routing.module';
import { LinksComponent } from './links.component';
import { MatTreeModule } from '@angular/material/tree';
import { ServicesModule } from 'src/app/services/services.module';
import { MenusComponent } from './menus/menus.component';
import { MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatChipsModule, MatAutocompleteModule } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MenuRowComponent } from './menus/menu-row/menu-row.component';
import { LinksMenuTreeComponent } from './links-menu-tree/links-menu-tree.component';
import { ToolsModule } from 'src/app/tools/tools.module';
import { TreeModule } from 'angular-tree-component';
import { EditLinkComponent } from './edit-link/edit-link.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditLinkTypeComponent } from './edit-link/edit-link-type/edit-link-type.component';
import { CurrentTypeComponent } from './edit-link/edit-link-type/current-type/current-type.component';

import { ExLinkFindComponent } from './edit-link/edit-link-type/data-find/ex-link-find/ex-link-find.component';
import { AddLinkComponent } from './menus/menu-row/add-link/add-link.component';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';
import { LinksCustomTreeComponent } from './root-custom-tree/links-custom-tree/links-custom-tree.component';
import { RootCustomTreeComponent } from './root-custom-tree/root-custom-tree.component';
import { ConfirmDoubleWindowComponent } from 'src/app/tools/confirm-double-window/confirm-double-window.component';

@NgModule({
  declarations: [
    LinksComponent,
    MenusComponent,
    MenuRowComponent,
    LinksMenuTreeComponent,
    EditLinkComponent,
    EditLinkTypeComponent,
    CurrentTypeComponent,
    ExLinkFindComponent,
    AddLinkComponent, LinksCustomTreeComponent, RootCustomTreeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LinksRoutingModule,
    MatTreeModule,
    ServicesModule,
    MatIconModule,
    ToolsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    DragDropModule,
    TreeModule.forRoot()
  ],
  entryComponents: [
    LinksMenuTreeComponent,
    EditLinkComponent,
    EditLinkTypeComponent,
    ExLinkFindComponent,
    AddLinkComponent,
    ConfirmWindowComponent,
    ConfirmDoubleWindowComponent
  ]
})
export class LinksModule { }

