import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Menu } from 'src/app/models/menu';


@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.less']
})
export class MenusComponent implements OnInit, AfterViewInit {

  menus: Menu[]

  constructor(private activatedRoute: ActivatedRoute) {
    this.menus = this.activatedRoute.snapshot.data['menus']
  }

  ngOnInit() {
    // console.log(this.menus)
  }


  ngAfterViewInit(): void {
  }



}
