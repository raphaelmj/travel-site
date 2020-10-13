import { Component, OnInit } from '@angular/core';
import { NavService } from '../services/auth/nav.service';
import { API_URL } from '../config';
import { UserService } from '../services/auth/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit {

  showNav: boolean = false;
  apiUrl: string = API_URL;

  constructor(private navService: NavService, private userService: UserService, private router: Router) {

  }

  ngOnInit() {

    this.navService.showNav$.subscribe((res) => {
      this.showNav = res;
    })

  }

  logOut() {
    this.userService.logout().then(r => {
      this.router.navigate(['/'])
    })
  }

}
