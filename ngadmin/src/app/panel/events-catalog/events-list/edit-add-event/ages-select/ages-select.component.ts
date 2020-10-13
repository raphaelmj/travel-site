import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { Age } from 'src/app/models/age';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-ages-select',
  templateUrl: './ages-select.component.html',
  styleUrls: ['./ages-select.component.less']
})
export class AgesSelectComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  elementCtrl = new FormControl();
  filteredElements: Observable<Age[]>;

  @Input() elements: Age[]
  @Input() allElements: Age[] = []

  @ViewChild('elsInput', { static: true }) elsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;

  @Output() emitData: EventEmitter<Age[]> = new EventEmitter()


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


  remove(d: Age, index: number): void {
    this.elements.splice(index, 1)
    this.emitData.emit(this.elements)
    this.allElements.push(d)
  }

  add($event) {
    console.log($event)
  }

  selected(event: MatAutocompleteSelectedEvent) {
    var id = event.option.value
    var day: Age[] = this.allElements.filter(d => d.id == parseInt(id))
    if (day) {
      this.elements.push(day[0])
    }
    this.emitData.emit(this.elements)
    this.elsInput.nativeElement.value = '';
    this.elementCtrl.setValue('')
    this.removeAdded()
  }


  removeAdded() {
    this.allElements = this.allElements.filter((el: Age) => {
      var bool = true
      this.elements.map((elf: Age) => {
        if (elf.id == el.id) {
          bool = false
        }
      })
      return bool
    })
  }


  // private _filter(value: string | number): Age[] {
  //   return this.allElements.filter(d => {
  //     var bool = true
  //     this.elements.map((el: Age) => {
  //       if (el.id == d.id) {
  //         bool = false
  //       }
  //     })
  //     return bool
  //   });
  // }

}
