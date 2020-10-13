import { Component, OnInit, ComponentRef, Type, ViewContainerRef, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { API_URL } from 'src/app/config';
import { Article } from 'src/app/models/article';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { RefreshArticlesService } from 'src/app/services/refresh-articles.service';
import { ConfirmWindowComponent } from 'src/app/tools/confirm-window/confirm-window.component';
import { ArticlesService } from 'src/app/services/articles/articles.service';
import { Category } from 'src/app/models/category';
import { ArtQueryParams } from 'src/app/models/art-query-params';
import { EditAddArticleComponent } from './edit-add-article/edit-add-article.component';


@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.less']
})
export class ArticlesComponent implements OnInit {

  articles: Article[];
  qParams: ArtQueryParams;
  total: number;
  pagesCount: number;
  limit: number = 20;
  current: number;
  appUrl: string = API_URL;
  categories: Category[];
  selectListCats: Array<Category | { name: string, id: null }> = []

  @ViewChild('editAdd', { read: ViewContainerRef, static: true }) editAddTemp: ViewContainerRef;
  editAddC: ComponentRef<EditAddArticleComponent>
  @ViewChild('remove', { read: ViewContainerRef, static: true }) removeTemp: ViewContainerRef;
  confirmC: ComponentRef<ConfirmWindowComponent>


  constructor(
    private activatedRoute: ActivatedRoute,
    private articlesService: ArticlesService,
    private router: Router,
    private cf: ComponentFactoryResolver,
    private categoriesService: CategoriesService,
    private refreshArticlesService: RefreshArticlesService
  ) {
    // console.log(this.activatedRoute.snapshot.data['articles'])
    this.articles = this.activatedRoute.snapshot.data['articles'].articles;
    this.qParams = this.activatedRoute.snapshot.data['articles'].qp;
    this.total = this.activatedRoute.snapshot.data['articles'].total;
    this.pagesCount = Math.ceil(this.total / this.limit)
    this.categories = this.activatedRoute.snapshot.data['categories']
  }

  ngOnInit() {

    this.prepareSelectArray()

    this.refreshArticlesService.refresh$.subscribe(r => {
      if (r) {
        this.resetQueryParams()
      }
    })
    this.paramsQueryCheck()
  }

  prepareSelectArray() {
    this.selectListCats.push({ name: 'Wszystkie', id: null })
    this.categories.map(c => {
      this.selectListCats.push({ name: c.name, id: c.id })
    })
  }

  paramsQueryCheck() {
    this.activatedRoute.queryParams.subscribe(prms => {

      if (prms.start) {

        if (prms.start == 0) {
          this.current = 1;
        } else {
          this.current = Math.ceil(prms.start / this.limit) + 1;
        }

        this.prepareQueryParams(prms);
        this.getArticles();

      } else {

        if (this.qParams.start == 0) {
          this.current = 1;
        } else {
          this.current = Math.ceil(this.qParams.start / this.limit) + 1
        }

      }
    })
  }

  prepareQueryParams(params) {
    this.qParams.start = params.start;
    this.qParams.limit = params.limit;
    this.qParams.column = params.column;
    this.qParams.order = params.order;
    this.qParams.phrase = params.phrase;
    this.qParams.categoryId = params.categoryId;
  }

  getNewCollection($event) {
    // console.log($event)
    if ($event.nr == 1) {
      this.qParams.start = 0;
    } else {
      this.qParams.start = ($event.nr - 1) * this.limit;
    }
    this.router.navigate(['/panel/articles'], { queryParams: this.qParams });

  }

  searchByCriteria($event) {
    this.prepareQueryParams($event);
    this.router.navigate(['/panel/articles'], { queryParams: this.qParams });
    // this.getArticles();
  }

  getArticles() {
    // console.log(this.qParams)
    this.articlesService.getArticles(this.qParams).subscribe(p => {
      this.articles = p.articles;
      this.qParams = p.qp;
      this.total = p.total;
      this.pagesCount = Math.ceil(this.total / this.limit)
    })
  }



  resetQueryParams() {
    var qp: ArtQueryParams = {
      start: 0,
      limit: 20,
      column: 'publishedAt',
      order: 'desc',
      phrase: '',
      categoryId: null
    }
    this.qParams = qp;
    this.router.navigate(['/panel/articles'], { queryParams: qp });
    this.getArticles();
  }

  changeStatus(id: number, sts: number) {

    this.articlesService.changeStatus(id, sts).then(a => {
      // console.log(a)
      this.getArticles()
    })

  }


  addArticle() {
    let edit = this.cf.resolveComponentFactory(<Type<EditAddArticleComponent>>EditAddArticleComponent)
    this.editAddC = this.editAddTemp.createComponent(edit)
    this.editAddC.instance.isNew = true
    let a: Article = this.articlesService.createEmpty()
    if (this.qParams.categoryId) {
      a.category = this.findCategoryById(this.qParams.categoryId)
      a.categoryId = this.qParams.categoryId
    }
    this.editAddC.instance.article = a
    this.editAddC.instance.categories = this.categories
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })
  }

  editArticle(a: Article) {
    let edit = this.cf.resolveComponentFactory(<Type<EditAddArticleComponent>>EditAddArticleComponent)
    this.editAddC = this.editAddTemp.createComponent(edit)
    this.editAddC.instance.isNew = false
    this.editAddC.instance.article = a
    this.editAddC.instance.categories = this.categories
    this.editAddC.instance.emitClose.subscribe(r => {
      this.editAddC.destroy()
    })
  }


  deleteArticle(article: Article) {
    this.removeTemp.clear()
    let confirm = this.cf.resolveComponentFactory(<Type<ConfirmWindowComponent>>ConfirmWindowComponent)
    this.confirmC = this.removeTemp.createComponent<ConfirmWindowComponent>(confirm)
    this.confirmC.instance.showConfirm = true
    this.confirmC.instance.bundleData = article
    this.confirmC.instance.message = 'Czy checesz usunąć artykuł?'
    this.confirmC.instance.emitActionConfirm.subscribe(r => {
      // console.log(r)
      if (r.do) {
        this.confirmC.destroy()
        this.deleteArticleExec(r.bundleData)
      } else {
        this.confirmC.destroy()
      }
    })
  }


  deleteArticleExec(article: Article) {
    this.articlesService.deleteArticle(article.id).then(r => {
      this.refreshArticlesService.makeRefresh()
    })
  }


  findCategoryById(categoryId: number) {
    var c: Category = null
    this.categories.map(cat => {
      if (cat.id == categoryId) {
        c = cat
      }
    })
    return c
  }

}
