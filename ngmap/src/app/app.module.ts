import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { EventMapComponent } from './event-map/event-map.component';
import { EventService } from './services/event.service';
import { HttpClientModule } from '@angular/common/http';
import { LegendSelectComponent } from './event-map/legend-select/legend-select.component'

@NgModule({
  declarations: [
    AppComponent,
    EventMapComponent,
    LegendSelectComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB9N1-dp0eV5sRPzb3iAwr9bFp2Iy05XIc' //AIzaSyB9N1-dp0eV5sRPzb3iAwr9bFp2Iy05XIc
    })
  ],
  providers: [EventService],
  bootstrap: [AppComponent]
})
export class AppModule { }
