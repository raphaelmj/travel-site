import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-textarea-xeditable',
  templateUrl: './textarea-xeditable.component.html',
  styleUrls: ['./textarea-xeditable.component.less']
})
export class TextareaXeditableComponent implements OnInit {

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
