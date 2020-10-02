import {AfterContentInit, Component, Input, OnInit} from '@angular/core';
import {Animes} from '../../models/animes';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, AfterContentInit {
   @Input() sliderConfig;
   @Input() animes: Animes;
   @Input() title: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    for (const anime of this.animes.results) {
      console.log('done')
    }
  }

}
