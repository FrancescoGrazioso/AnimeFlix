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
    private authService: AuthService
  ) { }

  ngOnInit() {
    alert('Siamo in fase di beta chiusa, se non hai ricevuto la mail di invito non sei stato selezionato per partecipare alla ' +
      'versione di prova e quindi non avrai accesso alle funzioni del sito, ci dispiace');
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
