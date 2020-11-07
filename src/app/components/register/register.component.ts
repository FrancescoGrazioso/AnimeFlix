import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email: string;
  pass: string;
  confPass: string;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  emailSignUp() {
    if (this.pass === this.confPass) {
      this.authService.SignUp(this.email, this.pass);
    } else {
      alert('Le password non corrispondono');
    }
  }

  googleLogin() {
    this.authService.GoogleAuth();
  }

}
