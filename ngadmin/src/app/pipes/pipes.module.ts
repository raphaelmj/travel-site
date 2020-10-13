import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceByTypePipe } from './resource-by-type.pipe';
import { DateTimePipe } from './date-time.pipe';
import { TourTypePipe } from './tour-type.pipe';
import { TourSezonPipe } from './tour-sezon.pipe';

@NgModule({
  declarations: [ResourceByTypePipe, DateTimePipe, TourTypePipe, TourSezonPipe],
  imports: [
    CommonModule
  ],
  exports: [
    ResourceByTypePipe,
    DateTimePipe,
    TourSezonPipe,
    TourTypePipe,
  ]
})
export class PipesModule { }
