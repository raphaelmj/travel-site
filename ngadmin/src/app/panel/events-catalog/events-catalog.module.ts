import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsCatalogRoutingModule } from './events-catalog-routing.module';
import { EventsCatalogComponent } from './events-catalog.component';
import { EventsListComponent } from './events-list/events-list.component';
import { ListFiltersComponent } from './events-list/list-filters/list-filters.component';
import { ToolsModule } from 'src/app/tools/tools.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatChipsModule, MatSelectModule, MatProgressSpinnerModule, MatSlideToggleModule, MatDatepickerModule, MatIconModule, MatAutocompleteModule } from '@angular/material';
import { EventRowComponent } from './events-list/event-row/event-row.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { EditAddEventComponent } from './events-list/edit-add-event/edit-add-event.component';
import { FiltersFindAddComponent } from './events-list/edit-add-event/filters-find-add/filters-find-add.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CKEditorModule } from 'ckeditor4-angular';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { NgxCurrencyModule } from "ngx-currency";
import { PriceConfigComponent } from './events-list/edit-add-event/price-config/price-config.component';
import { MicroGalleryComponent } from './events-list/edit-add-event/micro-gallery/micro-gallery.component';
import { AttachFilesComponent } from './events-list/edit-add-event/attach-files/attach-files.component';
import { MainImageComponent } from './events-list/main-image/main-image.component';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ngfModule, ngf } from "angular-file";
import { PricePreviewComponent } from './events-list/edit-add-event/price-preview/price-preview.component';
import { AgesSelectComponent } from './events-list/edit-add-event/ages-select/ages-select.component';
import { ThemesSelectComponent } from './events-list/edit-add-event/themes-select/themes-select.component';
import { DaysSelectComponent } from './events-list/edit-add-event/days-select/days-select.component';
import { CatalogAddEditComponent } from './catalog-add-edit/catalog-add-edit.component';

export const MY_FORMATS = {
  // parse: {
  //   dateInput: 'L',
  // },
  display: {
    dateInput: 'L',
    // monthYearLabel: 'MMM YYYY',
    // dateA11yLabel: 'LL',
    // monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [EventsCatalogComponent, EventsListComponent, ListFiltersComponent, EventRowComponent, EditAddEventComponent, FiltersFindAddComponent, PriceConfigComponent, MicroGalleryComponent, AttachFilesComponent, MainImageComponent, PricePreviewComponent, AgesSelectComponent, ThemesSelectComponent, DaysSelectComponent, CatalogAddEditComponent],
  imports: [
    CommonModule,
    EventsCatalogRoutingModule,
    ToolsModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    PipesModule,
    PerfectScrollbarModule,
    CKEditorModule,
    NgxCurrencyModule,
    NgxFileDropModule,
    ngfModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  entryComponents: [EditAddEventComponent, PriceConfigComponent, MicroGalleryComponent, UploadImageComponent, CatalogAddEditComponent]
})
export class EventsCatalogModule { }
