import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Banner} from '../../models/banner';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements AfterViewInit {

  @Input() banner: Banner;
  showAd = environment.adsense.show;
  constructor() {}

  ngAfterViewInit() {
    setTimeout(() => {
      try {
        (window['adsbygoogle'] = window['adsbygoogle'] || []).push({
          overlays: {bottom: true}
        });
      } catch (e) {
        console.error(e);
      }
    }, 0);
  }

}
