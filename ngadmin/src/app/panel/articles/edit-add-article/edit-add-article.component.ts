import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver, Type } from '@angular/core';
import { Article } from 'src/app/models/article';
import { Category } from 'src/app/models/category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _moment from 'moment';
import { CK_EDITOR_CONFIG, API_URL } from 'src/app/config';
import { ArticleGalleryComponent } from '../article-gallery/article-gallery.component';
import { ArticlesService } from 'src/app/services/articles/articles.service';
import { RefreshArticlesService } from 'src/app/services/refresh-articles.service';

@Component({
  selector: 'app-edit-add-article',
  templateUrl: './edit-add-article.component.html',
  styleUrls: ['./edit-add-article.component.less']
})
export class EditAddArticleComponent implements OnInit {

  @Output() emitClose: EventEmitter<any> = new EventEmitter()
  @Input() article: Article
  @Input() categories: Category[]
  @Input() isNew: boolean = true

  @ViewChild('editTemp', { read: ViewContainerRef, static: true }) editTemp: ViewContainerRef
  articleGallery: ComponentRef<ArticleGalleryComponent>

  isLoading: boolean = false
  formArticle: FormGroup
  ckEditorConfig: any = CK_EDITOR_CONFIG;
  croppedImage: string | null = null
  apiUrl: string = API_URL

  constructor(private fb: FormBuilder, private cf: ComponentFactoryResolver, private articlesService: ArticlesService, private refreshArticlesService: RefreshArticlesService) { }

  ngOnInit() {
    // console.log(this.article)
    this.createForm()
  }

  createForm() {
    let status: boolean = (<boolean>this.article.status) == true;
    // let pat = _moment(this.article.publishedAt);
    this.formArticle = this.fb.group({
      categoryId: [this.article.categoryId],
      title: [this.article.title, Validators.required],
      smallDesc: [this.article.smallDesc],
      longDesc: [this.article.longDesc],
      metaDescription: [this.article.metaDescription],
      metaKeywords: [this.article.metaKeywords],
      publishedAt: [this.article.publishedAt],
      status: [status]
    })
  }

  changeImage(event: string) {
    this.croppedImage = event
  }

  closeEdit() {
    this.emitClose.emit()
  }


  openEditGallery() {
    this.editTemp.clear()
    let edit = this.cf.resolveComponentFactory(<Type<ArticleGalleryComponent>>ArticleGalleryComponent)
    this.articleGallery = this.editTemp.createComponent<ArticleGalleryComponent>(edit)

    if (this.article.microGallery)
      this.articleGallery.instance.images = this.article.microGallery

    this.articleGallery.instance.emitChangeGallery.subscribe(images => {
      this.article.microGallery = images
    })
    this.articleGallery.instance.emitClose.subscribe(d => {
      this.articleGallery.destroy()
    })
  }


  submitForm() {

    var article = { ...this.article, ...this.formArticle.value }
    var { category, updatedAt, createdAt, ...restArticle } = article

    var a: Article = restArticle

    if (this.isNew) {
      this.createArticle(article)
    } else {
      this.updateArticle(article)
    }

  }

  updateArticle(article: Article) {
    this.articlesService.updateArticle(article, this.croppedImage).then(r => {
      // console.log(r)
      this.refreshArticlesService.makeRefresh()
    })
  }

  createArticle(article: Article) {
    this.articlesService.createArticle(article, this.croppedImage).then(r => {
      this.refreshArticlesService.makeRefresh()
      this.emitClose.emit()
    })
  }

}
