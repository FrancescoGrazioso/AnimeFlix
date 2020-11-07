import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  pass: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  emailLogin() {
    this.authService.SignIn(this.email, this.pass);
  }

  forgotPassword() {
    const recoveryMail = prompt('Per favore inserisci la mail a cui è associato il tuo account');
    this.authService.ForgotPassword(recoveryMail);
  }

  googleLogin() {
    this.authService.GoogleAuth();
  }

}
