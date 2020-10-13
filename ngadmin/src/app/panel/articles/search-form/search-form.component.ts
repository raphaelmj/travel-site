import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Category } from 'src/app/models/category';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { ArtQueryParams } from 'src/app/models/art-query-params';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.less']
})
export class SearchFormComponent implements OnInit, OnChanges {

  @Input() qp: ArtQueryParams;
  @Input() categories: Array<Category | { name: string, id: null }>
  @Output() emitQueryParams: EventEmitter<ArtQueryParams> = new EventEmitter()
  category$: Category | { name: string, id: null }
  searchPhrase: FormControl;
  phraseForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.phraseForm = this.fb.group({
      phrase: [this.qp.phrase]
    })
    this.findCurrentRouteCategory()
    this.subscribeToInput()
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes)
    if (changes.qp.firstChange) {
      this.qp = changes.qp.currentValue;
    }
  }

  subscribeToInput() {
    this.phraseForm.get('phrase').valueChanges.subscribe(value => {
      this.qp.phrase = value
      this.qp.start = 0;
      this.emitQueryParams.emit(this.qp)
    })
  }

  findCurrentRouteCategory() {
    if (this.qp.categoryId == null) {
      this.category$ = this.categories[0]
    } else {
      this.categories.map(c => {
        if (c.id == this.qp.categoryId) {
          this.category$ = c;
        }
      })
    }
  }

  changeCurrentCategory($event, c) {
    if ($event.isUserInput && c.id != this.qp.categoryId) {
      this.qp.categoryId = c.id;
      this.qp.start = 0;
      this.emitQueryParams.emit(this.qp)
    }
  }

}
