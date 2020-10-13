import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-custom-checkbox',
  templateUrl: './custom-checkbox.component.html',
  styleUrls: ['./custom-checkbox.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CustomCheckboxComponent implements OnInit {

  @Input() labelText: string
  @Input() labelLink: string = ''
  @Input() selectBool: boolean = false
  @Input() errorBool: boolean = false
  @Output() emitChange: EventEmitter<boolean> = new EventEmitter()

  constructor() { }

  ngOnInit() {
    // this.labelText = this.labelText + ' <a href="' + this.labelLink + '"><i class="fas fa-angle-double-right"></i></a>'
  }

  selectCheckbox() {
    this.selectBool = (this.selectBool) ? false : true
    this.emitChange.emit(this.selectBool)
  }

}
