import { Component, OnInit } from '@angular/core';
import { Theme } from 'src/app/models/theme';
import { Age } from 'src/app/models/age';
import { Day } from 'src/app/models/day';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.less']
})
export class OthersComponent implements OnInit {

  themes: Theme[]
  ages: Age[]
  days: Day[]

  constructor(private activatedRoute: ActivatedRoute) {
    this.themes = this.activatedRoute.snapshot.data['themes']
    this.ages = this.activatedRoute.snapshot.data['ages']
    this.days = this.activatedRoute.snapshot.data['days']
  }

  ngOnInit() {
  }

}
