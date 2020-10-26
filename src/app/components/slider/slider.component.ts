import {AfterContentInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Anime, Animes} from '../../models/animes';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, AfterContentInit {
   @Input() sliderConfig;
   @Input() animes: Animes;
   @Input() title: string;
   @Output() openAnime = new EventEmitter<Anime>();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {}

  emitEventOpenAnime(index: number) {
    this.openAnime.emit(this.animes.results[index]);
  }

  cleanTitle(realTitle: string) {
    return realTitle.match(/[A-Z][a-z]+|[0-9]+/g).join(' ');
  }

}
