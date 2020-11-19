import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paypal-button',
  templateUrl: './paypal-button.component.html',
  styleUrls: ['./paypal-button.component.css']
})
export class PaypalButtonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  goToLink(url: string) {
    window.open(url);
  }

}
