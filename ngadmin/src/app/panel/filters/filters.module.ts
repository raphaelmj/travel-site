import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FiltersRoutingModule } from './filters-routing.module';
import { FiltersComponent } from './filters.component';
import { GeoComponent } from './geo/geo.component';
import { OthersComponent } from './others/others.component';
import { RegionRowComponent } from './geo/region-row/region-row.component';
import { CityRowComponent } from './geo/region-row/city-row/city-row.component';
import { AttractionRowComponent } from './geo/region-row/city-row/attraction-row/attraction-row.component';
import { RegionAttractionRowComponent } from './geo/region-row/region-attraction-row/region-attraction-row.component';
import { EditAddRegionComponent } from './geo/edit-add-region/edit-add-region.component';
import { EditAddCityComponent } from './geo/edit-add-city/edit-add-city.component';
import { EditAddAttractionComponent } from './geo/edit-add-attraction/edit-add-attraction.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToolsModule } from 'src/app/tools/tools.module';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatChipsModule, MatSelectModule, MatProgressSpinnerModule } from '@angular/material';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';
import { ThemesEditComponent } from './others/themes-edit/themes-edit.component';
import { AgesEditComponent } from './others/ages-edit/ages-edit.component';
import { DaysEditComponent } from './others/days-edit/days-edit.component';
import { EditAddThemeComponent } from './others/themes-edit/edit-add-theme/edit-add-theme.component';
import { EditAddDayComponent } from './others/days-edit/edit-add-day/edit-add-day.component';
import { EditAddAgeComponent } from './others/ages-edit/edit-add-age/edit-add-age.component';


@NgModule({
  declarations: [FiltersComponent, GeoComponent, OthersComponent, RegionRowComponent, CityRowComponent, AttractionRowComponent, RegionAttractionRowComponent, EditAddRegionComponent, EditAddCityComponent, EditAddAttractionComponent, ThemesEditComponent, AgesEditComponent, DaysEditComponent, EditAddThemeComponent, EditAddDayComponent, EditAddAgeComponent],
  imports: [
    CommonModule,
    FiltersRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ToolsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [
    EditAddRegionComponent,
    EditAddCityComponent,
    EditAddAttractionComponent,
    ConfirmWindowComponent,
    EditAddThemeComponent,
    EditAddDayComponent,
    EditAddAgeComponent
  ]
})
export class FiltersModule { }
