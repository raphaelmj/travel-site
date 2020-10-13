import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Doc, DocFormType } from 'src/app/models/doc';
import { DocQueryParams } from 'src/app/models/doc-query-params';
import { Subscription } from 'rxjs';
import { DocService } from 'src/app/services/doc/doc.service';

@Component({
  selector: 'app-form-documents',
  templateUrl: './form-documents.component.html',
  styleUrls: ['./form-documents.component.less']
})
export class FormDocumentsComponent implements OnInit {

  docs: Doc[]
  docQueryParams: DocQueryParams
  total: number
  pages: number
  subQuery: Subscription
  subDocs: Subscription
  firstLoad: boolean = true

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private docsService: DocService) {
    this.docs = this.activatedRoute.snapshot.data['docs'].docs
    this.docQueryParams = this.activatedRoute.snapshot.data['docs'].dqp
    this.total = this.activatedRoute.snapshot.data['docs'].total
    this.pages = this.countPages(this.total, this.docQueryParams.limit)
    // console.log(this.activatedRoute.snapshot.data['docs'])
  }

  ngOnInit() {
    this.routeChangeSubscription()
  }

  routeChangeSubscription() {
    this.subQuery = this.activatedRoute.queryParams.subscribe(dqp => {
      console.log(dqp)
      if (!this.firstLoad) {
        this.docQueryParams = this.createDocQueryParams(dqp)
        this.getDocs(this.docQueryParams)
      } else {
        this.firstLoad = false
      }
    })
  }


  getDocs(qp: DocQueryParams) {
    this.subDocs = this.docsService.getDocs(qp).subscribe(r => {
      // console.log(r)
      this.docs = r.docs
      this.docQueryParams = r.dqp
      this.total = r.total
      this.pages = this.countPages(r.total, this.docQueryParams.limit)
    })
  }


  changePage($event) {
    // console.log($event)
    this.docQueryParams.page = $event.nr
    this.router.navigate(['/panel/form-documents'], { queryParams: this.docQueryParams })
  }


  changeFilter(event: { phrase: string, type: 'all' | DocFormType }) {
    this.docQueryParams.page = 1
    this.docQueryParams.type = event.type
    this.docQueryParams.phrase = event.phrase
    this.router.navigate(['/panel/form-documents'], { queryParams: this.docQueryParams })
  }


  createDocQueryParams(qp): DocQueryParams {
    let qParams: DocQueryParams = {
      limit: (qp.limit) ? qp.limit : 20,
      page: (qp.page) ? qp.page : 1,
      type: (qp.type) ? qp.type : 'all',
      phrase: (qp.phrase) ? qp.phrase : ''
    }
    return qParams
  }


  countPages(total: number, limit: number | string): number {
    var pages: number = 1
    if (total > limit) {
      if (typeof limit == 'string')
        limit = parseInt(limit)
      pages = Math.ceil(total / limit)
      return pages
    }
    return pages
  }

}
