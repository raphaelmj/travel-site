import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { CriteriaResolveService } from './services/criteria-resolve.service';
import { EventsResolveService } from './services/events-resolve.service';
import { MenuResolveService } from './services/menu-resolve.service';
import { GmapsComponent } from './gmaps/gmaps.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { WidgetResolveService } from './services/widget-resolve.service';

const routes: Routes = [
    { path: '', pathMatch: 'full', component: SearchComponent, resolve: { events: EventsResolveService, criteria: CriteriaResolveService, menu: MenuResolveService } },
    { path: 'warto-zobaczyc', pathMatch: 'full', component: GmapsComponent, resolve: { criteria: CriteriaResolveService, menu: MenuResolveService, widgets: WidgetResolveService } },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '/404' }
];

export const AppRoutes = RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
});
