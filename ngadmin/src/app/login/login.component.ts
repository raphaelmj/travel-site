import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from "../services/auth/user.service";
import { PatternValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { NavService } from "../services/auth/nav.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, DoCheck {

  email: string = '';
  password: string = '';
  spinnerShow: boolean = false;
  isAuthAlert: boolean = false;
  userEmailPattern = "^[0-9a-z_.-]+@[0-9a-z.-]+\.[a-z]{2,3}$";


  constructor(private userService: UserService, private router: Router, private navService: NavService) { }

  ngOnInit() {
    this.navService.hideNav();
  }

  ngDoCheck(): void {
    // console.log(this.email)
  }

  sumbmitLogin() {
    this.spinnerShow = true;

    this.userService.checkLoginAndMakeToken(this.email, this.password)
      .then((res) => {

        console.log(res)

        this.spinnerShow = false;

        if (!res.success) {
          this.isAuthAlert = true;
        } else {
          this.isAuthAlert = false;
          this.router.navigate(['/panel'])
        }

      })
  }

}
