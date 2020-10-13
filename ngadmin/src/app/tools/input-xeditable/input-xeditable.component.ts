import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-xeditable',
  templateUrl: './input-xeditable.component.html',
  styleUrls: ['./input-xeditable.component.less']
})
export class InputXeditableComponent implements OnInit {

  @Input() textClass : string = 'medium-text';
  @Input() xValue : string = '';
  @Input() backBundleData : any;
  isEdit : boolean = false;
  inputValue : string;
  @Output() emitSave : EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.inputValue = this.xValue;
  }

  cancel(){
    this.isEdit = false;
    this.inputValue = this.xValue;
  }

  save(){
    this.emitSave.emit({value:this.inputValue,backBundleData:this.backBundleData});
    this.isEdit = false;
  }

}
