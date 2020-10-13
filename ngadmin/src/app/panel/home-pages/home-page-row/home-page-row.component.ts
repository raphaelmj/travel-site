import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HomePage } from 'src/app/models/home-page';
import { API_URL } from 'src/app/config';

@Component({
  selector: 'app-home-page-row',
  templateUrl: './home-page-row.component.html',
  styleUrls: ['./home-page-row.component.less']
})
export class HomePageRowComponent implements OnInit {

  @Input() hp: HomePage
  @Output() editStart: EventEmitter<HomePage> = new EventEmitter<HomePage>()
  @Output() deleteStart: EventEmitter<HomePage> = new EventEmitter<HomePage>()

  apiUrl: string = API_URL

  constructor() { }

  ngOnInit() {
  }

  openEdit() {
    this.editStart.emit(this.hp)
  }

  deletePromo() {
    this.deleteStart.emit(this.hp)
  }



}
