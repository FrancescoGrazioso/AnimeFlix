import {AfterContentInit, Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Anime, Animes} from '../../models/animes';
import {Router} from '@angular/router';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit, AfterContentInit {
   /*@Input() sliderConfig;*/
   @Input() animes: Animes;
   @Input() title: string;
   @Output() openAnime = new EventEmitter<Anime>();
   @Output() deleteFromUser = new EventEmitter<Anime>();
   router: Router;
   isHorizzontal: boolean;

  constructor(
    router: Router
  ) {
    this.router = router;
    this.setHorizzontal();
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {}

  emitEventOpenAnime(index: number) {
    this.openAnime.emit(this.animes.results[index]);
  }

  emitEventDeleteAnime(index: number) {
    this.deleteFromUser.emit(this.animes.results[index]);
  }

  setHorizzontal() {
    if (window.innerWidth > window.innerHeight) { /* orizzontale */
      this.isHorizzontal = true;
    } else { /* verticale */
      this.isHorizzontal = false;
    }
  }

  @HostListener('window:resize')
  // tslint:disable-next-line:typedef
  handleResize() {
    this.setHorizzontal();
  }

}
