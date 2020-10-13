import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Theme } from 'src/app/models/theme';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-themes-select',
  templateUrl: './themes-select.component.html',
  styleUrls: ['./themes-select.component.less']
})
export class ThemesSelectComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  elementCtrl = new FormControl();

  @Input() elements: Theme[]
  @Input() allElements: Theme[] = []


  @ViewChild('elsInput', { static: true }) elsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;

  @Output() emitData: EventEmitter<Theme[]> = new EventEmitter()

  constructor() {

  }

  ngOnInit() {
    this.removeAdded()
    // this.filteredElements = this.elementCtrl.valueChanges.pipe(
    //   startWith(null),
    //   map((el: string | number | null) => {
    //     return el ? this._filter(el) : this.allElements.slice()
    //   })
    // )
  }


  remove(d: Theme, index: number): void {
    this.elements.splice(index, 1)
    this.emitData.emit(this.elements)
    this.allElements.push(d)
  }

  add($event) {
    console.log($event)
  }

  selected(event: MatAutocompleteSelectedEvent) {
    var id = event.option.value
    var day: Theme[] = this.allElements.filter(d => d.id == parseInt(id))
    if (day) {
      this.elements.push(day[0])
    }
    this.emitData.emit(this.elements)
    this.elsInput.nativeElement.value = '';
    this.elementCtrl.setValue('')
    this.removeAdded()
  }


  removeAdded() {
    this.allElements = this.allElements.filter((el: Theme) => {
      var bool = true
      this.elements.map((elf: Theme) => {
        if (elf.id == el.id) {
          bool = false
        }
      })
      return bool
    })
  }


  // private _filter(value: string | number): Theme[] {
  //   return this.allElements.filter(d => {
  //     var bool = true
  //     this.elements.map((el: Theme) => {
  //       if (el.id == d.id) {
  //         bool = false
  //       }
  //     })
  //     return bool
  //   });
  // }

}
