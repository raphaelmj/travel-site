import { Component, OnInit, Output, HostListener, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CriteriaService } from 'src/app/services/criteria.service';
import { IndexCriteria } from 'src/app/models/index-criteria';
import { API_URL } from 'src/app/config';

@Component({
  selector: 'app-search-point',
  templateUrl: './search-point.component.html',
  styleUrls: ['./search-point.component.less']
})
export class SearchPointComponent implements OnInit {

  @Output() emitCriteria: EventEmitter<IndexCriteria> = new EventEmitter()
  suggestsCriterias: IndexCriteria[] = []
  searchForm: FormGroup;
  apiUrl: string = API_URL
  isSelected: boolean = false;

  constructor(private fb: FormBuilder, private criteriaService: CriteriaService) { }

  ngOnInit() {
    this.searchForm = this.createForm()
    this.subscribeToPhrase()
  }

  createForm(): FormGroup {
    return this.fb.group({
      phrase: ['']
    })
  }

  subscribeToPhrase() {
    this.searchForm.get('phrase').valueChanges.pipe(
      debounceTime(1),
      distinctUntilChanged()
    ).subscribe(p => {
      if (p.length > 0) {
        this.searchCriteria(p)
      }
    })
  }

  searchCriteria(phrase: string) {
    this.criteriaService.findCriteria(phrase).subscribe(crs => {
      // console.log(crs)
      this.suggestsCriterias = crs
    })
  }

  @HostListener('document:click', ['$event'])
  clickDocumnet($event) {
    if ($event.target.id != 'inputSugCri' && $event.target.className != 'over-click') {
      this.suggestsCriterias = []
      if (!this.isSelected) {
        this.searchForm.get('phrase').setValue('');
      }
      this.isSelected = false;
    }
  }

  showPoint(sc: IndexCriteria) {
    this.searchForm.get('phrase').setValue(sc._source.name);
    this.isSelected = true;
    this.emitCriteria.emit(sc)
  }

}
