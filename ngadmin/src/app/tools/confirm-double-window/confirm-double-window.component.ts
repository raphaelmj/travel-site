import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-double-window',
  templateUrl: './confirm-double-window.component.html',
  styleUrls: ['./confirm-double-window.component.less']
})
export class ConfirmDoubleWindowComponent implements OnInit {

  @Input() message: string;
  @Input() btnTextOne: string;
  @Input() btnTextTwo: string;
  @Input() colorClassString: string = 'danger';
  @Input() showConfirm: boolean;
  @Input() backBundleData: any = null;
  @Output() emitActionConfirmOne: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitActionConfirmTwo: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitActionConfirmForget: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {

  }

  confirmOne() {
    this.showConfirm = false;
    this.emitActionConfirmOne.emit({ do: true, backBundleData: this.backBundleData });
  }

  confirmTwo() {
    this.showConfirm = false;
    this.emitActionConfirmTwo.emit({ do: true, backBundleData: this.backBundleData });
  }

  forget() {
    this.showConfirm = false;
    this.emitActionConfirmForget.emit({ do: false, backBundleData: this.backBundleData });
  }

}
