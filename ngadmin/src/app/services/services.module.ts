import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from "./auth/user.service";
import { NavService } from './auth/nav.service';
import { LinksService } from './links/links.service';
import { MenusService } from './menu/menus.service';
import { ResourcesService } from './resources.service';
import { RefreshMenuService } from './refresh-menu.service';
import { FilesListResolveService } from './files-list-resolve.service';
import { FileListService } from './file-list.service';
import { ValidateService } from './validate.service';
import { FilterService } from './filters/filter.service';
import { CityService } from './filters/city.service';
import { RegionService } from './filters/region.service';
import { AttractionService } from './filters/attraction.service';
import { AgeService } from './filters/age.service';
import { ThemeService } from './filters/theme.service';
import { FiltersGeoResolveService } from './filters/filters-geo-resolve.service';
import { CatalogService } from './events-catalog/catalog.service';
import { EventService } from './events-catalog/event.service';
import { CatalogEventsResolveService } from './events-catalog/catalog-events-resolve.service';
import { CatalogsResolveService } from './events-catalog/catalogs-resolve.service';
import { TourEventService } from './events-catalog/tour-event.service';
import { TaxResolveService } from './tax-resolve.service';
import { OneFileUploadService } from './one-file-upload.service';
import { FilesService } from './files.service';
import { AgesResolveService } from './filters/ages-resolve.service';
import { ThemesResolveService } from './filters/themes-resolve.service';
import { DaysResolveService } from './filters/days-resolve.service';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
  ],
  declarations: [],
  providers: [
    UserService,
    NavService,
    LinksService,
    MenusService,
    ResourcesService,
    RefreshMenuService,
    FileListService,
    FilesListResolveService,
    ValidateService,
    FilterService,
    CityService,
    RegionService,
    AttractionService,
    AgeService,
    ThemeService,
    FiltersGeoResolveService,
    CatalogService,
    EventService,
    CatalogEventsResolveService,
    CatalogsResolveService,
    TourEventService,
    TaxResolveService,
    OneFileUploadService,
    FilesService,
    AgesResolveService,
    DaysResolveService,
    ThemesResolveService
  ]
})
export class ServicesModule { }
