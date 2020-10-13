import { Component, OnInit, Input } from '@angular/core';
import { Link } from 'src/app/models/link';

@Component({
  selector: 'app-root-custom-tree',
  templateUrl: './root-custom-tree.component.html',
  styleUrls: ['./root-custom-tree.component.less']
})
export class RootCustomTreeComponent implements OnInit {

  @Input() links:Link[]

  constructor() { }

  ngOnInit() {
  }

  addNew($event){
    console.log($event)
  }

}
