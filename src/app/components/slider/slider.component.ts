import {AfterContentInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Anime, Animes} from '../../models/animes';
import {Router} from '@angular/router';

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
   @Output() deleteFromUser = new EventEmitter<Anime>();

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {}

  emitEventOpenAnime(index: number) {
    this.openAnime.emit(this.animes.results[index]);
  }

  emitEventDeleteAnime(index: number) {
    this.deleteFromUser.emit(this.animes.results[index]);
  }

  cleanTitle(realTitle: string) {
    return realTitle.match(/[A-Z][a-z]+|[0-9]+/g).join(' ');
  }

}
