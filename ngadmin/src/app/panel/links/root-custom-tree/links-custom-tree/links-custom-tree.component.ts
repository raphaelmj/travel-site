import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Link } from 'src/app/models/link';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-links-custom-tree',
  templateUrl: './links-custom-tree.component.html',
  styleUrls: ['./links-custom-tree.component.less']
})
export class LinksCustomTreeComponent implements OnInit {

  @Input() link: Link;
  @Input() parent:Link|string;
  @Output() emitAddNew:EventEmitter<any> = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<Link[]>) {
    // console.log(event)
    moveItemInArray(this.link.children, event.previousIndex, event.currentIndex);
  }



  addNewParentComponent($event){
    
    if($event instanceof MouseEvent){
      this.emitAddNew.emit({parent:this.parent,current:this.link})
    }else{
      /*
      /add new child
      */
      console.log($event)
    }

  }

}
