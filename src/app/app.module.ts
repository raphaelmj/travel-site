import { AppRoutes } from './app.routing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { CriteriaService } from './services/criteria.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './search/filters/filters.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { EventService } from './services/event.service';
import { PaginationComponent } from './search/pagination/pagination.component';
import { EventRowComponent } from './search/event-row/event-row.component';
import { PricePopupComponent } from './search/price-popup/price-popup.component';
import { PricePipe } from './pipes/price.pipe';
import { DateBetweenPipe } from './pipes/date-between.pipe';
import { CatalogToViewService } from './services/catalog-to-view.service';
import { CatalogService } from './services/catalog.service';
import { HeaderComponent } from './search/header/header.component';
import { FooterComponent } from './search/footer/footer.component';
import { MenuService } from './services/menu.service';
import { TypeToViewService } from './services/type-to-view.service';
import { GmapsComponent } from './gmaps/gmaps.component';
import { AgmCoreModule } from '@agm/core';
import { SelectRegionComponent } from './gmaps/select-region/select-region.component';
import { LegendSelectComponent } from './gmaps/legend-select/legend-select.component';
import { SearchPointComponent } from './gmaps/search-point/search-point.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    declarations: [AppComponent, SearchComponent, FiltersComponent, PaginationComponent, EventRowComponent, PricePopupComponent, PricePipe, DateBetweenPipe, HeaderComponent, FooterComponent, GmapsComponent, SelectRegionComponent, LegendSelectComponent, SearchPointComponent, NotFoundComponent],
    imports: [AppRoutes, CommonModule, HttpClientModule, ReactiveFormsModule, PerfectScrollbarModule, FormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyB9N1-dp0eV5sRPzb3iAwr9bFp2Iy05XIc' //AIzaSyB9N1-dp0eV5sRPzb3iAwr9bFp2Iy05XIc
        }),
        NgxPageScrollModule,
        NgxPageScrollCoreModule.forRoot({ duration: 1000 })
    ],
    providers: [CriteriaService, EventService, CatalogToViewService, TypeToViewService, CatalogService, MenuService, {
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }],
    bootstrap: [AppComponent],
    entryComponents: [PricePopupComponent]
})
export class AppModule { }
