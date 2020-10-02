import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Anime, Animes} from '../../models/animes';
import {Subscription} from 'rxjs';
import {AnimeService} from '../../services/anime.service';
import {mainURL} from '../../../environments/environment';
import {AngularFireDatabase} from '@angular/fire/database';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  sticky = false;
  subs: Subscription[] = [];
  trending: Animes = {
    results: []
  };
  popular: Animes = {
    results: []
  };

  sliderConfig = {
    slidesToShow: 8,
    slidesToScroll: 2,
    arrows: true,
    autoplay: false
  };

  @ViewChild('stickHeader', {static: true}) header: ElementRef;
  headerBGUrl: string;
  headerTitle: string;
  titleList: string[] = [];

  constructor(private anime: AnimeService,
              private  af: AngularFireDatabase,
              private http: HttpClient) {

  }

  ngOnInit(): void {

    console.log('BokuNoTonariNiAnkokuHaka'.length);
    // tslint:disable-next-line:forin
    for (const key in mainURL) {
      this.subs.push(this.anime.populateAnimeList(key).subscribe(
        t => {
          let htmlPage = t;
          htmlPage = htmlPage.slice(htmlPage.indexOf('<li>'), htmlPage.indexOf('</ul>'));
          const tmpList = htmlPage.split('<li>');
          tmpList.pop();
          for (let link of tmpList) {
            link = link.slice(link.indexOf('\'>') + 2, link.indexOf('</a'));
            this.titleList.push(link);
          }
          for (const link of this.titleList) {
            if (link) {
              this.af.database.ref('/anime').child(link).once('value', snap => {
                if (!snap.exists()) {
                  let tmpLink = link;
                  if (this.isCharDigit(link.charAt(link.length - 1))) {
                    tmpLink = tmpLink.slice(0, -1);
                    this.subs.push(this.anime.getAnimeInfo(tmpLink.match(/[A-Z][a-z]+|[0-9]+/g).join('+')).subscribe(
                      data => {
                          data.realTitle = link;
                          this.af.database.ref('/anime').child(link).set(data);
                        }
                    ));
                  }
                }
              });
            }
          }
        }
      ));
    }
    const an = this.af.list<Anime>('/anime');
    this.subs.push(an.snapshotChanges().subscribe(
      datas => {
        for (const currentAnime of datas) {
          if (!this.headerBGUrl) { this.headerBGUrl = currentAnime.payload.val().results[0].image_url; }
          if (!this.headerTitle) { this.headerTitle = currentAnime.payload.val().realTitle; }
          if (this.popular.results.length < 20) {
            this.popular.results.push(currentAnime.payload.val());
          } else if ( this.trending.results.length < 20) {
            this.trending.results.push(currentAnime.payload.val());
          }
        }
      }
    ));
  }

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }

  @HostListener('window:scroll', ['$event'])
  // tslint:disable-next-line:typedef
  handleScroll() {
    const windowScroll = window.pageYOffset;

    if (windowScroll >= this.header.nativeElement.offsetHeight) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }

   isCharDigit(n) {
    return !!n.trim() && n * 0 === 0;
  }


}
