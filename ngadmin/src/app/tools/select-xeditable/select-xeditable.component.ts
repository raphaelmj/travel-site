import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select-xeditable',
  templateUrl: './select-xeditable.component.html',
  styleUrls: ['./select-xeditable.component.less']
})
export class SelectXeditableComponent implements OnInit {

  @Input() selectCollection : any;
  @Input() currentSelect : any;
  @Output() emitSelectedValue : EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    //console.log(this.selectCollection);
    //console.log(this.currentSelect);
  }

  setElementSelect(value){
    //console.log(value);
    this.emitSelectedValue.emit(value);
  }

}
