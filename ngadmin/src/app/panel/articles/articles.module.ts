import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesComponent } from './articles.component';
import { ToolsModule } from 'src/app/tools/tools.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, MatNativeDateModule, MatChipsModule, MatAutocompleteModule, MatSlideToggleModule, MatSelectModule, MatProgressSpinnerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CKEditorModule } from 'ckeditor4-angular';
import { ArticleGalleryComponent } from './article-gallery/article-gallery.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { EditAddArticleComponent } from './edit-add-article/edit-add-article.component';
import { ArtImageComponent } from './art-image/art-image.component';
import { UploadImageComponent } from 'src/app/tools/upload-image/upload-image.component';
import { NgxFileDropModule } from 'ngx-file-drop';

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
  declarations: [ArticlesComponent, ArticleGalleryComponent, SearchFormComponent, EditAddArticleComponent, ArtImageComponent],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToolsModule,
    PipesModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    CKEditorModule,
    NgxFileDropModule
  ],
  entryComponents: [
    ConfirmWindowComponent, ArticleGalleryComponent, EditAddArticleComponent, UploadImageComponent
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ArticlesModule { }
