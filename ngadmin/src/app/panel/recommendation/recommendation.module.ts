import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecommendationRoutingModule } from './recommendation-routing.module';
import { RecommendationComponent } from './recommendation.component';
import { RecommendationRowComponent } from './recommendation-row/recommendation-row.component';
import { RecommendationEditAddComponent } from './recommendation-edit-add/recommendation-edit-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule, MatSelectModule } from '@angular/material';
import { ToolsModule } from 'src/app/tools/tools.module';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';


@NgModule({
  declarations: [RecommendationComponent, RecommendationRowComponent, RecommendationEditAddComponent],
  imports: [
    CommonModule,
    RecommendationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    ToolsModule
  ],
  entryComponents: [
    RecommendationEditAddComponent,
    UploadImageComponent
  ]
})
export class RecommendationModule { }
