import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  pass: string;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  emailLogin() {
    this.authService.SignIn(this.email, this.pass).catch(e => console.log(e));
  }

  googleLogin() {
    this.authService.GoogleAuth();
  }

}
